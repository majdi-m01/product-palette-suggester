
import { Product } from "@/types/product";
import { products } from "@/data/products";

// Simulating vector embedding calculation 
// In a real app, this would use a language model like BERT, USE, or OpenAI embeddings
const calculateEmbedding = (text: string): number[] => {
  // This is a simplified mock of embedding calculation
  // Real implementation would use a proper NLP model
  const simpleHash = (str: string) => {
    return Array.from(str).reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
  };
  
  // Generate a deterministic pseudo-random embedding of dimension 10
  const seed = simpleHash(text);
  return Array(10).fill(0).map((_, i) => {
    // Deterministic pseudo-random values between -1 and 1
    return Math.sin(seed * (i + 1) * 0.1) * 0.5 + Math.cos(seed * (i + 2) * 0.1) * 0.5;
  });
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same dimensions");
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Pre-process products to add embeddings (this would be done at build time or on the server)
const productsWithEmbeddings = products.map(product => {
  // Combine name, description, and category for embedding
  const contentForEmbedding = `${product.name} ${product.description} ${product.category}`;
  return {
    ...product,
    // Calculate and store embeddings
    embeddings: calculateEmbedding(contentForEmbedding),
    // Extract potential keywords for keyword matching
    keywords: [
      ...product.name.toLowerCase().split(/\s+/),
      ...product.description.toLowerCase().split(/\s+/).filter(word => word.length > 3),
      product.category.toLowerCase()
    ]
  };
});

// Retrieve context from product database (RAG approach)
const retrieveContext = (query: string) => {
  const queryEmbedding = calculateEmbedding(query);
  
  // Find products with similar embeddings
  return productsWithEmbeddings
    .map(product => ({
      product,
      similarity: cosineSimilarity(queryEmbedding, product.embeddings || [])
    }))
    .sort((a, b) => b.similarity - a.similarity);
};

// Keyword matching for additional relevance signals
const keywordMatch = (query: string, product: Product): number => {
  if (!product.keywords) return 0;
  
  const queryWords = query.toLowerCase().split(/\s+/);
  let matches = 0;
  
  queryWords.forEach(word => {
    if (word.length > 2 && product.keywords?.some(keyword => keyword.includes(word))) {
      matches++;
    }
  });
  
  return matches / queryWords.length;
};

// Category affinity - check if query mentions product category
const categoryMatch = (query: string, product: Product): number => {
  return query.toLowerCase().includes(product.category.toLowerCase()) ? 1 : 0;
};

// Main recommendation function
export const getRecommendations = (query: string, limit: number = 3): Product[] => {
  if (!query.trim()) return [];
  
  console.log(`Getting recommendations for: "${query}"`);
  
  // Retrieve similar products via embedding similarity (vector search)
  const similarProducts = retrieveContext(query);
  
  // Hybrid ranking: combine embedding similarity with keyword matching
  const rankedProducts = similarProducts.map(({ product, similarity }) => {
    const keywordScore = keywordMatch(query, product);
    const categoryScore = categoryMatch(query, product) * 0.5;
    
    // Combined score with different weights
    const finalScore = similarity * 0.6 + keywordScore * 0.3 + categoryScore * 0.1;
    
    return {
      product,
      score: finalScore
    };
  });
  
  // Sort by final score and return top N products
  return rankedProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// Analyze query for user preferences and requirements
export const analyzeQuery = (query: string): {
  preferences: string[];
  priceRange?: { min?: number; max?: number };
  categories: string[];
} => {
  const preferences: string[] = [];
  let priceRange: { min?: number; max?: number } = {};
  const categories: string[] = [];
  
  // Extract potential price ranges
  const priceRegex = /under\s+\$?(\d+)|less\s+than\s+\$?(\d+)|around\s+\$?(\d+)|about\s+\$?(\d+)|below\s+\$?(\d+)|max\s+\$?(\d+)|maximum\s+\$?(\d+)/i;
  const priceMatch = query.match(priceRegex);
  
  if (priceMatch) {
    // Find the first non-undefined group which is our price
    const priceValue = parseInt(priceMatch.slice(1).find(p => p !== undefined) || "0", 10);
    if (priceValue > 0) {
      priceRange.max = priceValue;
      preferences.push(`Price under $${priceValue}`);
    }
  }
  
  // Check for categories
  const allCategories = Array.from(new Set(products.map(p => p.category.toLowerCase())));
  allCategories.forEach(category => {
    if (query.toLowerCase().includes(category)) {
      categories.push(category);
      preferences.push(`${category} products`);
    }
  });
  
  // Simple attribute extraction
  const qualityTerms = ["high quality", "premium", "best", "top", "excellent"];
  const styleTerms = ["minimalist", "modern", "classic", "stylish", "elegant"];
  
  qualityTerms.forEach(term => {
    if (query.toLowerCase().includes(term)) {
      preferences.push(term);
    }
  });
  
  styleTerms.forEach(term => {
    if (query.toLowerCase().includes(term)) {
      preferences.push(term);
    }
  });
  
  return { preferences, priceRange, categories };
};
