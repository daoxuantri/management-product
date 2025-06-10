// /models/Product.ts
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
  priceDate: string;
  supplier: string;
  asker : string, 
  note: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}