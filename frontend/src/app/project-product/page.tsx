'use client';

import { useState, useMemo } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  code: string;
  inquiryDate: string;
  price?: number;
  supplier?: string;
  note?: string;
}

export default function ProjectProduct() {
  const [searchTerm, setSearchTerm] = useState("");

  const sampleProducts: Product[] = [
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

  const filteredProducts = useMemo(() => {
    let result = [...sampleProducts];
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [searchTerm]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Danh sách sản phẩm cung cấp</h1>
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
            className="w-full pl-10 pr-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="border rounded">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Tên sản phẩm</th>
              <th className="p-3 text-left">Mã sản phẩm</th>
              <th className="p-3 text-left">Ngày hỏi giá</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Nhà cung cấp</th>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.code}</td>
                <td className="p-3">{product.inquiryDate}</td>
                <td className="p-3">{product.price?.toLocaleString('vi-VN')} VNĐ</td>
                <td className="p-3">{product.supplier}</td>
                <td className="p-3">{product.note}</td>
                <td className="p-3">
                  <Link href={`/product/${product.id}`} className="text-blue-500">
                    <FaEye />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}