import { ProductPriceModel } from '../models/ProductPriceModel';

export const mockProducts: ProductPriceModel[] = [
  {
    id: 1,
    code: 'SP001',
    name: 'Sản phẩm A',
    price: 100000,
    priceDate: '2025-05-01',
    supplier: 'Nhà cung cấp A',
    asker: 'Người hỏi A',
    brand: 'Brand A',
  },
  {
    id: 2,
    code: 'SP002',
    name: 'Sản phẩm B',
    price: 200000,
    priceDate: '2025-05-02',
    supplier: 'Nhà cung cấp B',
    asker: 'Người hỏi B',
    brand: 'Brand B',
  },
  {
    id: 3,
    code: 'SP003',
    name: 'Sản phẩm C',
    price: 150000,
    priceDate: '2025-04-30',
    supplier: 'Nhà cung cấp A',
    asker: 'Người hỏi C',
    brand: 'Brand A',
  },
];