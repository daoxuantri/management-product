// /src/api/productApi.ts
import { Product } from '../models/Product';

export const fetchProducts = async (): Promise<{
  success: boolean;
  message: string;
  data: Product[];
}> => {
  try {
    const response = await fetch('http://192.168.1.27:4000/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const fetchProductById = async (id: string): Promise<{
  success: boolean;
  message: string;
  data: Product;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Product not found');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteProduct = async (id: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`http://192.168.1.27:4000/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete product');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Delete failed');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};