'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    specificProduct: '',
    origin: '',
    brand: '',
    yrs_manu: '',
    price: '',
    unit: '',
    priceDate: '',
    supplier: '',
    asker: '',
    note: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.code.trim()) newErrors.code = 'Vui lòng nhập mã sản phẩm';
    if (!formData.supplier.trim()) newErrors.supplier = 'Vui lòng nhập nhà cung cấp';
    if (formData.price && isNaN(parseInt(formData.price))) newErrors.price = 'Giá phải là số hợp lệ';
    if (!formData.priceDate) newErrors.priceDate = 'Vui lòng nhập ngày hỏi giá';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.priceDate)) {
      newErrors.priceDate = 'Định dạng ngày không hợp lệ (yyyy-mm-dd)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://192.168.1.12:4000/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseInt(formData.price) : 0,
          priceDate: formData.priceDate,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        router.push('/');
        router.refresh();
      } else {
        throw new Error(result.message || 'Thêm sản phẩm thất bại');
      }
    } catch (err) {
      alert((err as Error).message);
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
          <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm</h1>
        </div>
        <div className="w-[120px]"></div> {/* Placeholder to balance the layout */}
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
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
              type="date"
              name="priceDate"
              value={formData.priceDate}
              onChange={handleChange}
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}