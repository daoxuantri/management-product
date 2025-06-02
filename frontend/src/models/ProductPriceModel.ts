export interface ProductPriceModel {
    id?: number;
    code: string;
    name?: string;
    specificProduct?: string;
    unit?: string;
    price?: number;
    priceDate?: string;
    origin?: string;
    brand?: string;
    supplier: string;
    asker: string;
    note?: string;
  }