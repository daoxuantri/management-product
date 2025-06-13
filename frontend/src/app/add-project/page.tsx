'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { createProject } from '@/api/projectApi';
import { fetchProducts } from '@/api/productApi';
import { Project, ProjectProduct, Product } from '@/models/Project';
import { toast } from 'react-toastify';

export default function AddProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    code: '',
    time: '',
    supervisor: '',
    progress: 'Chưa hoàn thành',
    note: '',
    list_product: [],
    total: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data || []);
      } catch (err) {
        setError('Lỗi khi tải danh sách sản phẩm');
        toast.error('Lỗi khi tải danh sách sản phẩm');
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  const handleSelectSuggestion = (product: Product) => {
    setSearchTerm(`${product.name} (${product.code})`);
    setSuggestions([]);
  };

  const handleAddProduct = () => {
    if (!searchTerm || quantity <= 0) {
      setError('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      toast.error('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }

    const product = products.find((p) => `${p.name} (${p.code})` === searchTerm);
    if (!product) {
      setError('Sản phẩm không tồn tại');
      toast.error('Sản phẩm không tồn tại');
      return;
    }

    const newProductItem: ProjectProduct = {
      product,
      quantity,
      total_product: product.price * quantity,
      _id: `${Date.now()}-${product._id}`,
    };
    setFormData((prev) => ({
      ...prev,
      list_product: [...(prev.list_product || []), newProductItem],
      total: (prev.total || 0) + newProductItem.total_product,
    }));
    setSearchTerm('');
    setQuantity(1);
    setSuggestions([]);
    setError(null);
    toast.success('Thêm sản phẩm thành công');
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedList = formData.list_product?.filter((item) => item._id !== productId) || [];
    const totalRemoved = formData.list_product?.find((item) => item._id === productId)?.total_product || 0;
    setFormData((prev) => ({
      ...prev,
      list_product: updatedList,
      total: (prev.total || 0) - totalRemoved,
    }));
    toast.success('Xóa sản phẩm thành công');
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.time || !formData.supervisor || !formData.progress) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const submissionData: Partial<Project> = {
        ...formData,
        time: formData.time || '',
        list_product: formData.list_product?.map((item) => ({
          product: typeof item.product === 'string' ? item.product : item.product._id,
          quantity: item.quantity,
          total_product: item.total_product,
          _id: item._id,
        })),
      };
      const response = await createProject(submissionData);
      if (response.success) {
        toast.success('Thêm dự án thành công');
        router.push('/project');
      } else {
        throw new Error(response.message || 'Thêm dự án thất bại');
      }
    } catch (e) {
      const errorMessage = `Lỗi khi thêm dự án: ${(e as Error).message}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getProductInfo = (product: string | Product): { name: string; code: string } => {
    if (typeof product === 'string') {
      const found = products.find((p) => p._id === product);
      return { name: found?.name || 'N/A', code: found?.code || 'N/A' };
    }
    return { name: product.name, code: product.code };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/project')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            >
              <FaArrowLeft size={16} /> Quay lại
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Thêm dự án mới</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án *</label>
              <input
                type="text"
                placeholder="Nhập tên dự án"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã dự án *</label>
              <input
                type="text"
                placeholder="Nhập mã dự án"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.code || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (dd/MM/yyyy) *</label>
              <input
                type="text"
                placeholder="Nhập thời gian"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.time || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Người giám sát *</label>
              <input
                type="text"
                placeholder="Nhập tên người giám sát"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.supervisor || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, supervisor: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiến độ *</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.progress || 'Chưa hoàn thành'}
                onChange={(e) => setFormData((prev) => ({ ...prev, progress: e.target.value }))}
              >
                <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
                <option value="Hủy">Hủy</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                placeholder="Nhập ghi chú (tùy chọn)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                value={formData.note || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm trong dự án</h3>
            <div className="flex gap-4 mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Tìm tên hoặc mã sản phẩm..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-sm">
                    {suggestions.map((prod) => (
                      <div
                        key={prod._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer transition"
                        onClick={() => handleSelectSuggestion(prod)}
                      >
                        {prod.name} ({prod.code}) - {prod.price.toLocaleString()} VNĐ
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                placeholder="Số lượng"
                className="w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
              <button
                onClick={handleAddProduct}
                className="w-1/4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
              >
                <FaPlus size={16} />
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {formData.list_product?.map((item) => {
                const { name, code } = getProductInfo(item.product);
                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 text-sm"
                  >
                    <span>
                      {name} ({code}) - x{item.quantity} - {item.total_product.toLocaleString()} VNĐ
                    </span>
                    <button
                      onClick={() => item._id && handleRemoveProduct(item._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Tổng giá: {formData.total?.toLocaleString() || 0} VNĐ
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => router.push('/project')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}