// 'use client';

// import { useState, useMemo } from "react";
// import { FaSearch, FaFileExport, FaFileImport, FaTrash, FaEdit, FaEye, FaPlus } from "react-icons/fa";
// import Link from "next/link";

// interface Product {
//   id: number;
//   code: string;
//   name?: string;
//   specificProduct?: string;
//   unit?: string;
//   price?: number;
//   priceDate?: string;
//   origin?: string;
//   brand?: string;
//   supplier: string;
//   asker: string;
//   note?: string;
// }

// export default function Dashboard() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("default");
//   const [selectedFields, setSelectedFields] = useState<string[]>([
//     "name",
//     "code",
//     "priceDate",
//     "price",
//     "supplier",
//     "note",
//   ]);

//   const sampleProducts: Product[] = [
//     {
//       id: 1,
//       code: "SP001",
//       name: "Sản phẩm A",
//       specificProduct: "Chi tiết A",
//       unit: "Cái",
//       price: 100000,
//       priceDate: "2025-06-01",
//       origin: "Việt Nam",
//       brand: "Thương hiệu A",
//       supplier: "Nhà cung cấp A",
//       asker: "Người hỏi A",
//       note: "Ghi chú A",
//     },
//     {
//       id: 2,
//       code: "SP002",
//       name: "Sản phẩm B",
//       specificProduct: "Chi tiết B",
//       unit: "Cái",
//       price: 150000,
//       priceDate: "2025-06-02",
//       origin: "Trung Quốc",
//       brand: "Thương hiệu B",
//       supplier: "Nhà cung cấp B",
//       asker: "Người hỏi B",
//       note: "Ghi chú B",
//     },
//   ];

//   const filteredProducts = useMemo(() => {
//     let result = [...sampleProducts];
//     if (searchTerm) {
//       result = result.filter(
//         (product) =>
//           product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.code.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (sortBy === "priceDate") {
//       result.sort((a, b) => new Date(b.priceDate!).getTime() - new Date(a.priceDate!).getTime());
//     }
//     return result;
//   }, [searchTerm, sortBy]);

//   const handleDelete = (id: number) => {
//     if (confirm("Xóa sản phẩm này?")) {
//       console.log(`Xóa sản phẩm ID: ${id}`);
//     }
//   };

//   const handleExport = () => {
//     console.log("Export Excel với các trường:", selectedFields);
//   };

//   const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log("Import file:", e.target.files?.[0]);
//   };

//   return (
//     <div className="space-y-3 p-3">
//       <h1 className="text-xl font-bold">Dashboard</h1>
      
//       <div>
//         <Link
//           href="/add-product"
//           className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded text-xs"
//         >
//           <FaPlus size={14} /> Thêm sản phẩm
//         </Link>
//       </div>

//       <div className="flex flex-col gap-2">
//         <div className="relative flex-1">
//           <FaSearch className="absolute left-2 top-2.5 text-gray-400" size={14} />
//           <input
//             type="text"
//             placeholder="Tìm kiếm tên hoặc mã sản phẩm"
//             className="w-full pl-8 pr-3 py-1.5 border rounded text-xs"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <select
//           className="border p-1.5 rounded text-xs"
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//         >
//           <option value="default">Mặc định</option>
//           <option value="priceDate">Ngày hỏi giá</option>
//         </select>
//       </div>

//       <div className="flex gap-2">
//         <label className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer text-xs">
//           <FaFileImport size={14} /> Import Excel
//           <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
//         </label>
//         <button
//           className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded text-xs"
//           onClick={handleExport}
//         >
//           <FaFileExport size={14} /> Export Excel
//         </button>
//       </div>

//       <div className="space-y-1">
//         <h3 className="font-semibold text-xs">Chọn trường export:</h3>
//         <div className="flex flex-wrap gap-2">
//           {["name", "code", "priceDate", "price", "supplier", "note"].map((field) => (
//             <label key={field} className="flex items-center gap-1 text-xs">
//               <input
//                 type="checkbox"
//                 checked={selectedFields.includes(field)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setSelectedFields([...selectedFields, field]);
//                   } else {
//                     setSelectedFields(selectedFields.filter((f) => f !== field));
//                   }
//                 }}
//               />
//               {field === "name" && "Tên sản phẩm"}
//               {field === "code" && "Mã sản phẩm"}
//               {field === "priceDate" && "Ngày hỏi giá"}
//               {field === "price" && "Giá sản phẩm"}
//               {field === "supplier" && "Nhà cung cấp"}
//               {field === "note" && "Ghi chú"}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="border rounded overflow-x-auto">
//         <table className="w-full text-xs">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 text-left">Tên sản phẩm</th>
//               <th className="p-2 text-left">Mã sản phẩm</th>
//               <th className="p-2 text-left">Ngày hỏi giá</th>
//               <th className="p-2 text-left">Giá</th>
//               <th className="p-2 text-left">Nhà cung cấp</th>
//               <th className="p-2 text-left">Ghi chú</th>
//               <th className="p-2 text-left">Hành động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product) => (
//               <tr key={product.id} className="border-t">
//                 <td className="p-2">{product.name}</td>
//                 <td className="p-2">{product.code}</td>
//                 <td className="p-2">{product.priceDate}</td>
//                 <td className="p-2">{product.price?.toLocaleString('vi-VN')} VNĐ</td>
//                 <td className="p-2">{product.supplier}</td>
//                 <td className="p-2">{product.note}</td>
//                 <td className="p-3 flex gap-5">
//                   <Link href={`/product/${product.id}`} className="text-blue-500">
//                     <FaEye size={14} />
//                   </Link>
//                   {/* <Link href={`/edit-product/${product.id}`} className="text-yellow-500">
//                     <FaEdit size={14} />
//                   </Link> */}
//                   <button
//                     className="text-red-500"
//                     onClick={() => handleDelete(product.id)}
//                   >
//                     <FaTrash size={14} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// /src/components/Dashboard.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFileExport, FaFileImport, FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { fetchProducts } from '@/api/productApi';
import { Product } from '@/models/Product';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name',
    'code',
    'createdAt',
    'price',
    'supplier',
    'note',
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        setProducts(response.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortBy === 'priceDate') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [searchTerm, sortBy, products]);

  const handleDelete = (id: string) => {
    if (confirm('Xóa sản phẩm này?')) {
      console.log(`Xóa sản phẩm ID: ${id}`);
      // TODO: Gọi API DELETE /products/:id khi tích hợp
    }
  };

  const handleExport = () => {
    console.log('Export Excel với các trường:', selectedFields);
    // TODO: Thêm logic export Excel
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Import file:', e.target.files?.[0]);
    // TODO: Thêm logic import Excel
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-3 p-3">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div>
        <Link
          href="/add-product"
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded text-xs"
        >
          <FaPlus size={14} /> Thêm sản phẩm
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative flex-1">
          <FaSearch className="absolute left-2 top-2.5 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc mã sản phẩm"
            className="w-full pl-8 pr-3 py-1.5 border rounded text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border p-1.5 rounded text-xs"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Mặc định</option>
          <option value="priceDate">Ngày tạo</option>
        </select>
      </div>

      <div className="flex gap-2">
        <label className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer text-xs">
          <FaFileImport size={14} /> Import Excel
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
        </label>
        <button
          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded text-xs"
          onClick={handleExport}
        >
          <FaFileExport size={14} /> Export Excel
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-xs">Chọn trường export:</h3>
        <div className="flex flex-wrap gap-2">
          {['name', 'code', 'createdAt', 'price', 'supplier', 'note'].map((field) => (
            <label key={field} className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedFields([...selectedFields, field]);
                  } else {
                    setSelectedFields(selectedFields.filter((f) => f !== field));
                  }
                }}
              />
              {field === 'name' && 'Tên sản phẩm'}
              {field === 'code' && 'Mã sản phẩm'}
              {field === 'createdAt' && 'Ngày tạo'}
              {field === 'price' && 'Giá sản phẩm'}
              {field === 'supplier' && 'Nhà cung cấp'}
              {field === 'note' && 'Ghi chú'}
            </label>
          ))}
        </div>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Tên sản phẩm</th>
              <th className="p-2 text-left">Mã sản phẩm</th>
              <th className="p-2 text-left">Ngày tạo</th>
              <th className="p-2 text-left">Giá</th>
              <th className="p-2 text-left">Nhà cung cấp</th>
              <th className="p-2 text-left">Ghi chú</th>
              <th className="p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.code}</td>
                <td className="p-2">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="p-2">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                <td className="p-2">{product.supplier}</td>
                <td className="p-2">{product.note}</td>
                <td className="p-3 flex gap-5">
                  <Link href={`/product/${product._id}`} className="text-blue-500">
                    <FaEye size={14} />
                  </Link>
                  {/* <Link href={`/edit-product/${product._id}`} className="text-yellow-500">
                    <FaEdit size={14} />
                  </Link> */}
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}