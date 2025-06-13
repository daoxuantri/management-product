'use client';

import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { fetchProjectDetail, addProductToProject, deleteProductFromProject, deleteProject } from '@/api/projectApi';
import { fetchProductById, fetchProducts } from '@/api/productApi';
import { Project, ProjectProduct, Product } from '@/models/Project';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';
import { ProjectProductContext } from '@/lib/projectProductContext';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { dispatch } = useContext(ProjectProductContext);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({ list_product: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [productCache, setProductCache] = useState<{ [key: string]: Product }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [tempQuantities, setTempQuantities] = useState<{ [key: number]: number }>({});

  const fetchProductInfo = useCallback(async (productId: string): Promise<Product> => {
    if (productCache[productId]) return productCache[productId];
    try {
      const response = await fetchProductById(productId);
      if (response.success && response.data) {
        setProductCache((prev) => ({ ...prev, [productId]: response.data }));
        return response.data;
      }
      throw new Error('Không thể lấy thông tin sản phẩm');
    } catch (err) {
      throw err;
    }
  }, [productCache]);

  useEffect(() => {
    const loadProjectDetail = async () => {
      if (!id) {
        setError('Không tìm thấy ID dự án');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [projectResponse, productsResponse] = await Promise.all([
          fetchProjectDetail(id as string),
          fetchProducts(),
        ]);

        if (projectResponse.success && projectResponse.data) {
          setProject(projectResponse.data);
          setFormData({
            ...projectResponse.data,
            list_product: projectResponse.data.list_product?.map((item) => ({ ...item })) ?? [],
          });

          const productPromises = (projectResponse.data.list_product ?? []).map(async (item) => {
            const productId = typeof item.product === 'string' ? item.product : item.product?._id;
            if (productId && !productCache[productId]) {
              await fetchProductInfo(productId);
            }
          });
          await Promise.all(productPromises);
        } else {
          throw new Error(projectResponse.message || 'Không thể tải thông tin dự án');
        }

        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetail();
  }, [id, fetchProductInfo]);

  const handleQuantityChange = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setErrors((prev) => ({ ...prev, [`quantity-${index}`]: 'Số lượng phải lớn hơn 0' }));
      return;
    }

    const item = formData.list_product?.[index];
    if (!item) {
      setError('Không tìm thấy sản phẩm');
      return;
    }

    const productId = typeof item.product === 'string' ? item.product : item.product?._id;
    if (!productId) {
      setError('ID sản phẩm không hợp lệ');
      return;
    }

    const currentQuantity = item.quantity;
    const quantityDelta = newQuantity - currentQuantity;

    if (quantityDelta === 0) return;

    try {
      const response = await addProductToProject(id as string, {
        productId,
        quantity: quantityDelta,
      });

      if (response.success && response.data) {
        setFormData((prev) => ({
          ...prev,
          list_product: response.data?.list_product ?? [],
          total: response.data?.list_product?.reduce((sum: number, item: ProjectProduct) => sum + item.total_product, 0) || 0,
        }));
        setProject(response.data);
        setTempQuantities((prev) => ({ ...prev, [index]: newQuantity }));

        const productPromises = (response.data.list_product ?? []).map(async (item) => {
          const productId = typeof item.product === 'string' ? item.product : item.product?._id;
          if (productId && !productCache[productId]) {
            await fetchProductInfo(productId);
          }
        });
        await Promise.all(productPromises);

        dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
        toast.success('Cập nhật số lượng thành công');
        setErrors((prev) => ({ ...prev, [`quantity-${index}`]: '' }));
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error(`Lỗi: ${(err as Error).message}`);
    }
  };

  const handleTempQuantityChange = (index: number, value: number) => {
    setTempQuantities((prev) => ({ ...prev, [index]: value }));
  };

  const handleQuantityBlur = (index: number) => {
    const newQuantity = tempQuantities[index] || 1;
    handleQuantityChange(index, newQuantity);
  };

  const handleQuantityKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newQuantity = tempQuantities[index] || 1;
      handleQuantityChange(index, newQuantity);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProductId || productQuantity < 1) {
      toast.error('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ');
      return;
    }

    try {
      const response = await addProductToProject(id as string, {
        productId: selectedProductId,
        quantity: productQuantity,
      });

      if (response.success && response.data) {
        setFormData((prev) => ({
          ...prev,
          list_product: response.data?.list_product ?? [],
          total: response.data?.list_product?.reduce((sum: number, item: ProjectProduct) => sum + item.total_product, 0) || 0,
        }));
        setProject(response.data);

        if (!productCache[selectedProductId]) {
          await fetchProductInfo(selectedProductId);
        }

        dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
        toast.success('Thêm sản phẩm thành công');
        setSelectedProductId('');
        setProductQuantity(1);
      } else {
        throw new Error(response.message || 'Thêm sản phẩm thất bại');
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error(`Lỗi: ${(err as Error).message}`);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    formData.list_product?.forEach((item: ProjectProduct, index: number) => {
      if (item.quantity <= 0) {
        newErrors[`quantity-${index}`] = 'Số lượng phải lớn hơn 0';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (!validateForm()) {
        toast.error('Vui lòng kiểm tra số lượng sản phẩm');
        return;
      }
      setIsEditing(false);
      setTempQuantities({});
    } else {
      setIsEditing(true);
      const initialQuantities: { [key: number]: number } = {};
      formData.list_product?.forEach((item, index) => {
        initialQuantities[index] = item.quantity;
      });
      setTempQuantities(initialQuantities);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi dự án?')) return;

    try {
      const response = await deleteProductFromProject(id as string, productId);
      if (response.success && response.data) {
        setFormData((prev) => ({
          ...prev,
          list_product: response.data?.list_product ?? [],
          total: response.data?.list_product?.reduce((sum: number, item: ProjectProduct) => sum + item.total_product, 0) || 0,
        }));
        setProject(response.data);
        dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
        toast.success('Xóa sản phẩm thành công');
      } else {
        throw new Error(response.message || 'Xóa thất bại');
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error(`Lỗi: ${(err as Error).message}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Bạn có chắc muốn xóa dự án này?')) return;

    try {
      const response = await deleteProject(id as string);
      if (response.success) {
        dispatch({ type: 'DELETE_PROJECT', payload: { id } });
        toast.success('Xóa dự án thành công');
        router.push('/project-product');
      } else {
        throw new Error(response.message || 'Xóa thất bại');
      }
    } catch (err) {
      setError((err as Error).message);
      toast.error(`Lỗi: ${(err as Error).message}`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...project!, list_product: project?.list_product ?? [] });
    setErrors({});
    setTempQuantities({});
  };

  if (loading) return <Loading message="Đang tải chi tiết dự án..." size="large" />;
  if (error) return <div className="text-red-500 text-center p-6">Lỗi: {error}</div>;
  if (!project) return <div className="text-gray-500 text-center p-6">Không tìm thấy dự án</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/project-product')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          aria-label="Quay lại danh sách dự án"
        >
          <FaArrowLeft size={16} /> Quay lại
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleEditToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa dự án'}
          >
            {isEditing ? <FaSave size={16} /> : <FaEdit size={16} />}
            {isEditing ? 'Lưu' : 'Chỉnh sửa'}
          </button>
          {isEditing && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              aria-label="Hủy chỉnh sửa"
            >
              <FaTimes size={16} /> Hủy
            </button>
          )}
          <button
            onClick={handleDeleteProject}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            aria-label="Xóa dự án"
          >
            <FaTrash size={16} /> Xóa dự án
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{project.name || 'Không có tên'}</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Mã dự án:</span>
            <span>{project.code || 'Không có'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Thời gian:</span>
            <span className="text-green-600">{project.time || 'Không có'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Người quản lý:</span>
            <span>{project.supervisor || 'Không có'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Tiến độ:</span>
            <span
              className={`px-2 py-1 rounded text-white ${
                project.progress === 'chưa hoàn thành'
                  ? 'bg-yellow-500'
                  : project.progress === 'hoàn thành'
                    ? 'bg-green-500'
                    : project.progress === 'tạm dừng'
                      ? 'bg-orange-500'
                      : project.progress === 'hủy'
                        ? 'bg-red-500'
                        : 'bg-blue-600'
              }`}
            >
              {project.progress || 'Không có'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Tổng giá:</span>
            <span>{formData.total?.toLocaleString() || 0} VNĐ</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Ghi chú:</span>
            <span>{project.note || 'Không có'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Danh sách sản phẩm</h3>
        {formData.list_product && formData.list_product.length > 0 ? (
          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
            {formData.list_product.map((item: ProjectProduct, index: number) => {
              const productId = typeof item.product === 'string' ? item.product : item.product?._id;
              const productInfo = productId && productCache[productId];
              return (
                <div
                  key={item._id || index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {productInfo ? `${productInfo.name} (${productInfo.code})` : 'Đang tải...'} -{' '}
                      {item.total_product.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          value={tempQuantities[index] ?? item.quantity}
                          min="1"
                          onChange={(e) => handleTempQuantityChange(index, parseInt(e.target.value) || 1)}
                          onBlur={() => handleQuantityBlur(index)}
                          onKeyPress={(e) => handleQuantityKeyPress(index, e)}
                          className="w-16 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[`quantity-${index}`] && (
                          <p className="text-red-600 text-xs">{errors[`quantity-${index}`]}</p>
                        )}
                        {productId && (
                          <button
                            onClick={() => handleRemoveProduct(productId)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Xóa sản phẩm"
                          >
                            X
                          </button>
                        )}
                      </>
                    ) : (
                      <span>x{item.quantity}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">Không có sản phẩm nào</p>
        )}

        {isEditing && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Thêm sản phẩm mới</h4>
            <div className="flex gap-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                min="1"
                onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Số lượng sản phẩm"
              />
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Thêm sản phẩm"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}