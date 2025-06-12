'use client';

import { useState, useEffect, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { updateProject, addProductToProject, deleteProductFromProject } from '@/api/projectApi';
import { fetchProducts } from '@/api/productApi';
import { Project, Product, ProjectProduct } from '@/models/Project';
import { toast } from 'react-toastify';

interface EditProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function EditProjectDialog({ project, onClose }: EditProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [formData, setFormData] = useState<Partial<Project>>(project);
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

  // Gợi ý sản phẩm
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

  // Xử lý chọn gợi ý
  const handleSelectSuggestion = (product: Product) => {
    setSearchTerm(`${product.name} (${product.code})`);
    setSuggestions([]);
  };

  // Thêm sản phẩm
  const handleAddProduct = async () => {
    if (!searchTerm || quantity <= 0 || !project._id) {
      setError('Vui lòng chọn sản phẩm, nhập số lượng hợp lệ và kiểm tra ID dự án');
      return;
    }

    const product = products.find(
      (p) => `${p.name} (${p.code})` === searchTerm
    );
    if (!product) {
      setError('Sản phẩm không tồn tại');
      return;
    }

    try {
      const response = await addProductToProject(project._id, {
        productId: product._id,
        quantity,
      });
      setFormData((prev) => ({
        ...prev,
        list_product: response.data?.list_product || prev.list_product,
        total: response.data?.total || prev.total,
      }));
      setSearchTerm('');
      setQuantity(1);
      setSuggestions([]);
      setError(null);
      toast.success('Thêm sản phẩm thành công');
    } catch (e) {
      setError(`Lỗi khi thêm sản phẩm: ${(e as Error).message}`);
      toast.error(`Lỗi khi thêm sản phẩm: ${(e as Error).message}`);
    }
  };

  // Xóa sản phẩm
  const handleRemoveProduct = async (productId: string) => {
    if (!project._id) {
      setError('Không tìm thấy ID dự án');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi dự án?')) {
      return;
    }

    try {
      const response = await deleteProductFromProject(project._id, productId);
      setFormData((prev) => ({
        ...prev,
        list_product: response.data?.list_product || prev.list_product,
        total: response.data?.total || prev.total,
      }));
      setError(null);
      toast.success('Xóa sản phẩm thành công');
    } catch (e) {
      setError(`Lỗi khi xóa sản phẩm: ${(e as Error).message}`);
      toast.error(`Lỗi khi xóa sản phẩm: ${(e as Error).message}`);
    }
  };

  // Lưu chỉnh sửa
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.code ||
      !formData.time ||
      !formData.supervisor ||
      !formData.progress
    ) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn lưu thay đổi?')) {
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
      const response = await updateProject(project._id || '', submissionData);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
      toast.success('Cập nhật dự án thành công');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      setError(`Lỗi khi cập nhật dự án: ${(e as Error).message}`);
      toast.error(`Lỗi khi cập nhật dự án: ${(e as Error).message}`);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa dự án</h2>
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Sản phẩm trong dự án
            </h3>
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
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-48 overflow-y-auto">
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
                className="w-1/4 bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition"
              >
                Thêm
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
              {formData.list_product?.map((item) => {
                const { name, code } = getProductInfo(item.product);
                const productId = typeof item.product === 'string' ? item.product : item.product._id;
                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-blue-500 text-sm py-2 border-b"
                  >
                    <span>
                      {name} ({code}) - x{item.quantity} -{' '}
                      {item.total_product.toLocaleString()} VNĐ
                    </span>
                    <button
                      onClick={() => productId && handleRemoveProduct(productId)}
                      className="text-red-500 hover:text-red-700"
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