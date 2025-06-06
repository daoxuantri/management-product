'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function EditProduct({ params }: Props) {
  const router = useRouter();

  // Sample data
  const products = [
    {
      id: 1,
      name: "Sản phẩm A",
      code: "SP001",
      inquiryDate: "2025-06-01",
      price: 100000,
      supplier: "Nhà cung cấp A",
      note: "Ghi chú A",
    },
    {
      id: 2,
      name: "Sản phẩm B",
      code: "SP002",
      inquiryDate: "2025-06-02",
      price: 150000,
      supplier: "Nhà cung cấp B",
      note: "Ghi chú B",
    },
  ];

  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  const [formData, setFormData] = useState({
    name: product.name,
    code: product.code,
    inquiryDate: product.inquiryDate,
    price: product.price?.toString() || "",
    supplier: product.supplier || "",
    note: product.note || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic chỉnh sửa sản phẩm (gửi API hoặc cập nhật state)
    console.log("Chỉnh sửa sản phẩm:", formData);
    router.push("/");
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Chỉnh sửa sản phẩm</h1>
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
          Lưu chỉnh sửa
        </button>
      </form>
    </div>
  );
}