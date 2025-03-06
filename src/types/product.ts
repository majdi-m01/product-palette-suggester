
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
  // Adding fields to help with semantic search
  keywords?: string[];
  attributes?: Record<string, string>;
  embeddings?: number[];
}
