// /src/models/Project.ts
export interface Project {
  _id?: string;
  name: string;
  code: string;
  time?: string; // Thời gian
  supervisor: string;
  list_product: ProjectProduct[];
  total: number;
  progress?: string; // Tiến độ
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface ProjectProduct {
  _id?: string;
  product: Product; // Thay string bằng object Product
  quantity: number;
  total_product: number;
}

export interface Product {
  _id: string;
  name: string;
  code: string;
  specificProduct?: string;
  origin?: string;
  brand?: string;
  yrs_manu?: string;
  price: number;
  unit?: string;
  priceDate?: string;
  supplier?: string;
  asker?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}