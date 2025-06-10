'use client';

import { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaBox, FaList, FaBars } from 'react-icons/fa';

const SidebarContext = createContext<{ isCollapsed: boolean; toggleCollapse: () => void }>({
  isCollapsed: false,
  toggleCollapse: () => {},
});

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen p-4 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          {!isCollapsed && (
            <h2 className="text-xl font-semibold text-white">Quản lý hàng hóa</h2>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none transition-colors"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTachometerAlt className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Thông tin chung</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/general"
                className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaUsers className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Các mục khác</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/project-product"
                className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaList className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Quản lý dự án</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/other"
                className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaBox className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">Đề xuất chỉnh sửa</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </SidebarContext.Provider>
  );
}