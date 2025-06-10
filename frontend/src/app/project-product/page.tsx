// /src/app/project-product/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import ProjectList from '@/components/ProjectList';
import { fetchProducts } from '@/api/productApi';
import { Product } from '@/models/Product';
import Loading from '@/components/Loading';

export default function ProjectProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'projects'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading message="Đang tải danh sách..." size="large" className="bg-white" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý dự án & danh mục sản phẩm</h1>

      <div className="flex gap-4 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Danh sách sản phẩm cung cấp
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('projects')}
        >
          Danh sách dự án
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
                className="w-full pl-10 pr-4 py-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border rounded">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Tên sản phẩm</th>
                  <th className="p-3 text-left">Mã sản phẩm</th>
                  <th className="p-3 text-left">Năm sản xuất</th>
                  <th className="p-3 text-left">Giá</th>
                  <th className="p-3 text-left">Đơn vị</th>
                  <th className="p-3 text-left">Nhà cung cấp</th>
                  <th className="p-3 text-left">Ghi chú</th>
                  <th className="p-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.code}</td>
                    <td className="p-3">{product.yrs_manu}</td>
                    <td className="p-3">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="p-3">{product.unit}</td>
                    <td className="p-3">{product.supplier}</td>
                    <td className="p-3">{product.note}</td>
                    <td className="p-3">
                      <Link href={`/product/${product._id}`} className="text-blue-500">
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && <ProjectList />}
    </div>
  );
}