
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  rating?: number;
  stock?: number;
  sku?: string;
  // Enhanced semantic search fields
  keywords?: string[];
  attributes?: Record<string, string>;
  embeddings?: number[];
  // New fields for better recommendations
  popularity?: number;
  tags?: string[];
  releaseDate?: string;
  similarProducts?: string[]; // IDs of similar products
}
