export interface ProductForProject {
  name: string;
  code: string;
  specificProduct: string;
  unit: string;
  priceNhap: number;
  priceBan: number;
  quantity: number;
  totalNhap: number;
  totalBan: number;
  origin: string;
  brand: string;
  supplier: string;
  priceDate: string;
  asker: string;
  note: string;
}

export interface Project {
  projectName: string;
  products: ProductForProject[];
}