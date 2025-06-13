import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Project, Product } from '@/models/Project';
import { updateProject, addProductToProject } from '@/api/projectApi';
import { fetchProducts } from '@/api/productApi';
import { toast } from 'react-toastify';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: (updatedProject: Project) => void;
}

export default function EditProjectDialog({ isOpen, onClose, project, onUpdate }: EditProjectDialogProps) {
  const [formData, setFormData] = useState<Partial<Project>>({ ...project, list_product: project.list_product ?? [] });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...project, list_product: project.list_product ?? [] });
      const loadProducts = async () => {
        try {
          const response = await fetchProducts();
          if (response.success && response.data) {
            setProducts(response.data);
          }
        } catch (err) {
          toast.error('Không thể tải danh sách sản phẩm');
        }
      };
      loadProducts();
    }
  }, [isOpen, project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (!selectedProductId || productQuantity < 1) {
      toast.error('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response = await addProductToProject(project._id!, {
        productId: selectedProductId,
        quantity: productQuantity,
      });
      if (response.success && response.data) {
        setFormData((prev) => ({
          ...prev,
          list_product: response.data?.list_product ?? [],
          total: response.data?.total,
        }));
        onUpdate(response.data);
        toast.success('Thêm sản phẩm thành công');
        setSelectedProductId('');
        setProductQuantity(1);
      } else {
        throw new Error(response.message || 'Thêm sản phẩm thất bại');
      }
    } catch (err) {
      toast.error(`Lỗi: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateProject(project._id!, formData);
      if (response.success && response.data) {
        onUpdate(response.data);
        toast.success('Cập nhật dự án thành công');
        onClose();
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      toast.error(`Lỗi: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          aria-label="Đóng hộp thoại chỉnh sửa"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chỉnh sửa dự án</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên dự án
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Mã dự án
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Thời gian
              </label>
              <input
                id="time"
                name="time"
                type="text"
                value={formData.time || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
                Người giám sát
              </label>
              <input
                id="supervisor"
                name="supervisor"
                type="text"
                value={formData.supervisor || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                Tiến độ
              </label>
              <select
                id="progress"
                name="progress"
                value={formData.progress || ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Chưa hoàn thành">Chưa hoàn thành</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Tạm dừng">Tạm dừng</option>
                <option value="Hủy">Hủy</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Thêm sản phẩm</h3>
            <div className="flex gap-3 items-center">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                aria-label="Chọn sản phẩm"
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.code})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={productQuantity}
                onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-24 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                aria-label="Số lượng sản phẩm"
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !selectedProductId}
                aria-label="Thêm sản phẩm vào dự án"
              >
                Thêm
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
              aria-label="Hủy chỉnh sửa"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
              aria-label="Lưu thay đổi"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}