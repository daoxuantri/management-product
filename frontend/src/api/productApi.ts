// /src/lib/api.ts
export const fetchProducts = async (): Promise<{
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    code: string;
    specificProduct: string;
    origin: string;
    brand: string;
    yrs_manu: string;
    price: number;
    unit: string;
    supplier: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
}> => {
  try {
    const response = await fetch('http://192.168.1.20:4000/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};