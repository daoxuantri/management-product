'use client';

import { useState, useEffect, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { createProject } from '@/api/projectApi';
import { fetchProducts } from '@/api/productApi';
import { Project, Product, ProjectProduct } from '@/models/Project';

interface AddProjectDialogProps {
  onClose: () => void;
}

export default function AddProjectDialog({ onClose }: AddProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);
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

  // Tải danh sách sản phẩm
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Lỗi khi tải danh sách sản phẩm');
      }
    };
    loadProducts();
  }, []);

  // Gợi ý sản phẩm khi nhập tìm kiếm
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

  // Xử lý chọn gợi ý sản phẩm
  const handleSelectSuggestion = (product: Product) => {
    setSearchTerm(`${product.name} (${product.code})`);
    setSuggestions([]);
  };

  // Thêm sản phẩm vào danh sách
  const handleAddProduct = () => {
    if (!searchTerm || quantity <= 0) {
      setError('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }

    const product = products.find(
      (p) => `${p.name} (${p.code})` === searchTerm
    );
    if (!product) {
      setError('Sản phẩm không tồn tại');
      return;
    }

    const newProductItem: ProjectProduct = {
      product, // Lưu toàn bộ object Product để hiển thị trong UI
      quantity,
      total_product: product.price * quantity,
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
  };

  // Xóa sản phẩm khỏi danh sách
  const handleRemoveProduct = (index: number) => {
    const updatedList = (formData.list_product || []).filter((_, i) => i !== index);
    const totalRemoved = formData.list_product?.[index]?.total_product || 0;
    setFormData((prev) => ({
      ...prev,
      list_product: updatedList,
      total: (prev.total || 0) - totalRemoved,
    }));
  };

  // Gửi dữ liệu dự án
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.code ||
      !formData.time ||
      !formData.supervisor ||
      !formData.progress
    ) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn lưu dự án này?')) {
      return;
    }

    try {
      const submissionData: Partial<Project> = {
        ...formData,
        time: formData.time || '',
        list_product: formData.list_product?.map((item) => ({
          product: typeof item.product === 'string' ? item.product : item.product._id, // Chỉ gửi product._id
          quantity: item.quantity,
          total_product: item.total_product,
        })),
      };
      const response = await createProject(submissionData);
      if (response.success) {
        dispatch({ type: 'ADD_PROJECT', payload: response.data });
        onClose();
      } else {
        throw new Error(response.message || 'Thêm dự án thất bại');
      }
    } catch (e) {
      setError(`Lỗi khi thêm dự án: ${(e as Error).message}`);
    }
  };

  // Hàm tiện ích để lấy thông tin sản phẩm
  const getProductInfo = (product: string | Product): { name: string; code: string } => {
    if (typeof product === 'string') {
      const found = products.find((p) => p._id === product);
      return { name: found?.name || 'N/A', code: found?.code || 'N/A' };
    }
    return { name: product.name, code: product.code };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg resize overflow-auto min-w-[400px] min-h-[500px] max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm dự án mới</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên dự án *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Mã dự án *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.code || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, code: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Thời gian (dd/MM/yyyy) *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.time || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, time: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Người quản lý *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.supervisor || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, supervisor: e.target.value }))
            }
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.progress || 'Chưa hoàn thành'}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, progress: e.target.value }))
            }
          >
            <option value="Chưa hoàn thành">Chưa hoàn thành</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm dừng">Tạm dừng</option>
            <option value="Hủy">Hủy</option>
          </select>
          <textarea
            placeholder="Ghi chú"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            value={formData.note || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
          />
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">
              Thêm sản phẩm
            </h3>
            <div className="flex gap-4 mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-50 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
                    {suggestions.map((prod) => (
                      <div
                        key={prod._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
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
                className="w-1/4 bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-600 transition"
              >
                Thêm
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              {formData.list_product?.map((item, index) => {
                const { name, code } = getProductInfo(item.product);
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span className='text-sm'>
                      {name} ({code}) - x{item.quantity} -{' '}
                      {item.total_product.toLocaleString()} VNĐ
                    </span>
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-600 font-bold"
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Tổng giá: {formData.total?.toLocaleString() || 0} VNĐ
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}