'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    inquiryDate: "",
    price: "",
    supplier: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic thêm sản phẩm (gửi API hoặc lưu vào state)
    console.log("Thêm sản phẩm:", formData);
    router.push("/");
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-4">
        <div>
          <label className="block font-semibold">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Mã sản phẩm</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Ngày hỏi giá</label>
          <input
            type="date"
            name="inquiryDate"
            value={formData.inquiryDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Giá sản phẩm</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Nhà cung cấp</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Ghi chú</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}