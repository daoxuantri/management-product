'use client';

import { useState } from "react";
import { FaUsers, FaKey, FaHistory } from "react-icons/fa";

interface UserSection {
  title: string;
  items: { title: string; routeName: string }[];
}

export default function UserManagement() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const sections: UserSection[] = [
    {
      title: "📁 Danh sách quản lý người dùng (đang phát triển)",
      items: [
        { title: "Quản lý người dùng", routeName: "" },
        { title: "Phân quyền người dùng", routeName: "" },
        { title: "Lịch sử thay đổi dữ liệu", routeName: "" },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
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
                      // Thêm logic điều hướng nếu có route
                      console.log(`Navigate to ${item.routeName}`);
                    }
                  }}
                >
                  <span className="mr-2">
                    {item.title === "Quản lý người dùng" && <FaUsers />}
                    {item.title === "Phân quyền người dùng" && <FaKey />}
                    {item.title === "Lịch sử thay đổi dữ liệu" && <FaHistory />}
                  </span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}