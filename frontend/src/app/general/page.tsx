'use client';

import { useState } from "react";
import { FaUsers, FaKey, FaHistory, FaPlus, FaEdit, FaFileExport, FaEye } from "react-icons/fa";
import Link from "next/link";

interface GeneralSection {
  title: string;
  items: { title: string; routeName: string }[];
}

export default function GeneralManagement() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const sections: GeneralSection[] = [
    {
      title: "📁 Danh sách quản lý người dùng (đang phát triển)",
      items: [
        { title: "Quản lý người dùng", routeName: "" },
        { title: "Phân quyền người dùng", routeName: "" },
        { title: "Lịch sử thay đổi dữ liệu", routeName: "" },
      ],
    },
    {
      title: "📦 Quản lý nhập - xuất sản phẩm",
      items: [
        { title: "Thêm sản phẩm", routeName: "/add-product" },
        { title: "Xóa / Sửa sản phẩm", routeName: "/edit-product" },
        { title: "Xuất Excel", routeName: "" },
      ],
    },
    {
      title: "📊 Quản lý dự án & danh mục sản phẩm",
      items: [
        { title: "Danh sách sản phẩm cung cấp", routeName: "/project-product" },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Quản lý chung</h1>
      {sections.map((section, index) => (
        <div key={index} className="border rounded-lg">
          <button
            className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <span className="font-bold text-lg">{section.title}</span>
            <span>{expanded === index ? "▲" : "▼"}</span>
          </button>
          {expanded === index && (
            <div className="p-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (item.routeName) {
                      // Điều hướng nếu có route
                      console.log(`Navigate to ${item.routeName}`);
                    }
                  }}
                >
                  <span className="mr-2">
                    {item.title === "Quản lý người dùng" && <FaUsers />}
                    {item.title === "Phân quyền người dùng" && <FaKey />}
                    {item.title === "Lịch sử thay đổi dữ liệu" && <FaHistory />}
                    {item.title === "Thêm sản phẩm" && <FaPlus />}
                    {item.title === "Xóa / Sửa sản phẩm" && <FaEdit />}
                    {item.title === "Xuất Excel" && <FaFileExport />}
                    {item.title === "Danh sách sản phẩm cung cấp" && <FaEye />}
                  </span>
                  <span>
                    {item.routeName ? (
                      <Link href={item.routeName} className="flex items-center w-full">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}