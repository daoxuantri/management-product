'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { FaSave, FaTimes, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { fetchProductById } from '@/api/productApi';
import Loading from '@/components/Loading';
import { Product } from '@/models/Product';

interface Props {
  params: { id: string };
}

export default function EditProduct({ params }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditing] = useState(true); // Always in edit mode
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    specificProduct: '',
    unit: '',
    price: '',
    priceDate: '',
    origin: '',
    brand: '',
    yrs_manu: '',
    supplier: '',
    asker: '',
    note: '',
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProductById(params.id);
        if (response.success) {
          setProduct(response.data);
          setFormData({
            code: response.data.code,
            name: response.data.name || '',
            specificProduct: response.data.specificProduct || '',
            unit: response.data.unit || '',
            price: response.data.price?.toString() || '',
            priceDate: response.data.priceDate || '', // Sử dụng chuỗi thô từ API, ví dụ: "10/6/2025"
            origin: response.data.origin || '',
            brand: response.data.brand || '',
            yrs_manu: response.data.yrs_manu || '',
            supplier: response.data.supplier,
            asker: response.data.asker || '',
            note: response.data.note || '',
          });
        } else {
          throw new Error(response.message || 'Product not found');
        }
      } catch (err) {
        setError((err as Error).message);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [params.id]);

  if (loading) return <Loading message="Đang tải sản phẩm..." size="medium" />;
  if (error || !product) notFound();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.code.trim()) newErrors.code = 'Vui lòng nhập mã sản phẩm';
    if (!formData.supplier.trim()) newErrors.supplier = 'Vui lòng nhập nhà cung cấp';
    if (formData.price && isNaN(parseInt(formData.price))) newErrors.price = 'Giá phải là số hợp lệ';
    if (!formData.priceDate.trim()) newErrors.priceDate = 'Vui lòng nhập ngày hỏi giá';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = async () => {
    if (validateForm()) {
      try {
        const updatedProduct = {
          _id: product?._id,
          name: formData.name,
          code: formData.code,
          specificProduct: formData.specificProduct,
          origin: formData.origin,
          brand: formData.brand,
          yrs_manu: formData.yrs_manu,
          price: parseInt(formData.price) || 0,
          unit: formData.unit,
          priceDate: formData.priceDate, // Giữ nguyên chuỗi "dd/M/yyyy"
          supplier: formData.supplier,
          asker: formData.asker,
          note: formData.note,
        };

        const response = await fetch(`http://localhost:4000/products/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          router.push('/');
          router.refresh();
        } else {
          throw new Error('Cập nhật thất bại');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      code: product.code,
      name: product.name || '',
      specificProduct: product.specificProduct || '',
      unit: product.unit || '',
      price: product.price?.toString() || '',
      priceDate: product.priceDate || '', // Khôi phục chuỗi "dd/M/yyyy"
      origin: product.origin || '',
      brand: product.brand || '',
      yrs_manu: product.yrs_manu || '',
      supplier: product.supplier,
      asker: product.asker || '',
      note: product.note || '',
    });
    setErrors({});
    router.push('/');
  };

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${formData.name || 'N/A'}"?`)) {
      try {
        const response = await fetch(`http://localhost:4000/products/${params.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          router.push('/');
          router.refresh();
        } else {
          throw new Error('Xóa thất bại');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" /> Quay lại
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <FaSave className="h-4 w-4" /> Lưu
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaTimes className="h-4 w-4" /> Hủy
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash className="h-4 w-4" /> Xóa
          </button>
        </div>
      </div>
      <form ref={formRef} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã sản phẩm *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Chi tiết sản phẩm</label>
            <textarea
              name="specificProduct"
              value={formData.specificProduct}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá sản phẩm</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày hỏi giá *</label>
            <input
              type="text"
              name="priceDate"
              value={formData.priceDate}
              onChange={handleChange}
              placeholder="dd/M/yyyy (ví dụ: 10/6/2025)"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.priceDate && <p className="text-red-600 text-sm mt-1">{errors.priceDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Xuất xứ</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Năm sản xuất</label>
            <input
              type="text"
              name="yrs_manu"
              value={formData.yrs_manu}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nhà cung cấp *</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.supplier && <p className="text-red-600 text-sm mt-1">{errors.supplier}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Người hỏi giá</label>
            <input
              type="text"
              name="asker"
              value={formData.asker}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
        </div>
      </form>
    </div>
  );
}