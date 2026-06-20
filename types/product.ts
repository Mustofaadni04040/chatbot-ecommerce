export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string | null;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  imageUrl?: string | null;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  inStockOnly?: boolean;
}
