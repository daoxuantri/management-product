// /src/app/add-project/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Xóa useRef vì không sử dụng
import { useRouter } from 'next/navigation';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { createProject, fetchProjects } from '@/api/projectApi';
import { Project, ProjectProduct, Product } from '@/models/Project';

export default function AddProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    code: '',
    time: '', // Khởi tạo với chuỗi rỗng
    supervisor: '',
    progress: 'Chưa hoàn thành',
    note: '',
    list_product: [], // Đảm bảo khởi tạo mảng
    total: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProjects();
        const allProducts = (response.data || []).flatMap((project: Project) =>
          (project.list_product || []).map((item) => item.product)
        );
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p._id, p])).values());
        setProducts(uniqueProducts);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  const handleAddProduct = () => {
    if (!searchTerm || quantity <= 0 || !suggestions.length) {
      alert('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }

    const product = products.find(p => p._id === suggestions[0]._id);
    if (product) {
      const newProductItem: ProjectProduct = {
        product,
        quantity,
        total_product: product.price * quantity,
        _id: `${Date.now()}-${product._id}`,
      };
      setFormData(prev => ({
        ...prev,
        list_product: [...(prev.list_product || []), newProductItem],
        total: (prev.total || 0) + newProductItem.total_product,
      }));
    }
    setSearchTerm('');
    setQuantity(1);
    setSuggestions([]);
  };

  const handleRemoveProduct = (productId: string) => {
    const updatedList = formData.list_product?.filter(item => item._id !== productId) || [];
    const totalRemoved = formData.list_product?.find(item => item._id === productId)?.total_product || 0;
    setFormData(prev => ({
      ...prev,
      list_product: updatedList,
      total: (prev.total || 0) - totalRemoved,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.time || !formData.supervisor) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const response = await createProject({
        ...formData,
        time: formData.time || '', // Đảm bảo time không undefined
      } as Project); // Ép kiểu để gửi
      if (response.success) {
        alert('Thêm dự án thành công!');
        router.push('/project-product');
      } else {
        throw new Error(response.message || 'Thêm dự án thất bại');
      }
    } catch (e) {
      alert(`Lỗi: ${(e as Error).message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/project-product')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <h1 className="text-2xl font-semibold text-gray-700">Thêm dự án mới</h1>
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tên dự án *"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Mã dự án *"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.code || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Thời gian thực hiện *"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.time || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Người giám sát *"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.supervisor || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
        />
        <select
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.progress || 'Chưa hoàn thành'}
          onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
        >
          <option value="Chưa hoàn thành">Chưa hoàn thành</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Tạm dừng">Tạm dừng</option>
          <option value="Hủy">Hủy</option>
        </select>
        <textarea
          placeholder="Ghi chú"
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          value={formData.note || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
        />

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Thêm sản phẩm</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Tìm tên hoặc mã sản phẩm..."
              className="w-2/3 max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-12 w-2/3 max-w-lg">
                {suggestions.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(`${prod.name} (${prod.code})`);
                      setSuggestions([]);
                    }}
                  >
                    {prod.name} ({prod.code})
                  </div>
                ))}
              </div>
            )}
            <input
              type="number"
              placeholder="Số lượng"
              className="w-1/3 max-w-xs p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button
              onClick={handleAddProduct}
              className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition duration-200"
            >
              <FaPlus />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
            {formData.list_product?.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm py-1">
                <span>{item.product.name} (x{item.quantity}) - {item.total_product.toLocaleString()} VNĐ</span>
                <button
                  onClick={() => handleRemoveProduct(item._id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => router.push('/project-product')}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg transition duration-200"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}