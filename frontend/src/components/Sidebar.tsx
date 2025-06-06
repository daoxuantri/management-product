import Link from "next/link";
import { FaTachometerAlt, FaUsers, FaBox } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Quản lý danh mục hàng hóa</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaTachometerAlt className="mr-2" /> Thông tin chung
            </Link>
          </li>
          <li>
            <Link href="/general" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-2" /> Các mục khác
            </Link>
          </li>
          <li>
            <Link href="/other" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaBox className="mr-2" /> (Đề xuất các chỉnh sửa khác)
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}