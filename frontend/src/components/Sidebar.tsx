// /src/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaBox, FaList } from 'react-icons/fa';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white h-screen p-4 transition-all ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex justify-between items-center mb-6">
        {!isCollapsed && <h2 className="text-2xl font-bold">Quản lý danh mục hàng hóa</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white">
          {isCollapsed ? '>>' : '<<'}
        </button>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaTachometerAlt className="mr-2" />
              {!isCollapsed && 'Thông tin chung'}
            </Link>
          </li>
          <li>
            <Link href="/general" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-2" />
              {!isCollapsed && 'Các mục khác'}
            </Link>
          </li>
          <li>
            <Link href="/project-product" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaList className="mr-2" />
              {!isCollapsed && 'Quản lý dự án & sản phẩm'}
            </Link>
          </li>
          <li>
            <Link href="/other" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaBox className="mr-2" />
              {!isCollapsed && '(Đề xuất các chỉnh sửa khác)'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}