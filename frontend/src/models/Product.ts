// /src/models/Product.ts
export interface Product {
  _id: string;
  name: string;
  code: string;
  specificProduct: string;
  origin: string;
  brand: string;
  yrs_manu: string;
  price: number;
  unit: string;
  priceDate: string; // Có thể là ngày hoặc số (ví dụ: 45935)
  supplier: string;
  asker: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}