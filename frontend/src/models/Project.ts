// src/models/Project.ts
export interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
  stock?: number;
}

export interface ProjectProduct {
  product: Product | string; // Hỗ trợ cả Product (UI) và string (API)
  quantity: number;
  total_product: number;
  _id?: string;
}

export interface Project {
  _id?: string;
  name: string;
  code: string;
  time: string;
  supervisor: string;
  list_product?: ProjectProduct[];
  total?: number;
  progress: string;
  note?: string;
}