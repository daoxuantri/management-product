'use client';

import Loading from '@/components/Loading';
import { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFileExport, FaFileImport, FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchProducts, deleteProduct, createProduct } from '@/api/productApi';
import { Product } from '@/models/Product';
import * as XLSX from 'xlsx';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'code', 'specificProduct', 'origin', 'brand', 'priceDate', 'yrs_manu', 'price', 'unit', 'supplier', 'asker', 'note']);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        if (response.success) {
          console.log('Dữ liệu sản phẩm từ fetchProducts:', response.data);
          setProducts(response.data);
        } else {
          throw new Error(response.message);
        }
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
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortBy === 'priceDate') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [searchTerm, sortBy, products]);

  const handleDelete = async (id: string) => {
    const name = products.find((p) => p._id === id)?.name || 'Sản phẩm';
    if (confirm(`Xác nhận xóa "${name}"?`)) {
      try {
        const response = await deleteProduct(id);
        if (response.success) {
          showModal('Thành công', response.message);
          setProducts(products.filter((p) => p._id !== id));
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError((err as Error).message);
        showModal('Lỗi', (err as Error).message);
      }
    }
  };

  const handleExport = () => {
    const fieldMapping: { [key: string]: keyof Product } = {
      'Tên danh mục hàng hóa': 'name',
      'Ký mã hiệu': 'code',
      'Thông tin chi tiết cấu hình': 'specificProduct',
      'Xuất xứ': 'origin',
      'Nhãn hiệu': 'brand',
      'Ngày hỏi giá': 'priceDate',
      'Năm sản xuất': 'yrs_manu',
      'Giá tiền': 'price',
      'Đơn vị tính': 'unit',
      'Nhà cung cấp': 'supplier',
      'Người hỏi giá': 'asker',
      'Ghi chú': 'note',
    };

    const exportData = filteredProducts.map((product) => {
      const row: { [key: string]: any } = {};
      for (const [excelField, modelField] of Object.entries(fieldMapping)) {
        if (modelField === 'price') {
          row[excelField] = product[modelField]?.toString() || '0';
        } else {
          row[excelField] = product[modelField] || '';
        }
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products_export.xlsx');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as any[];

      const fieldMapping: { [key: string]: keyof Product } = {
        'Tên danh mục hàng hóa': 'name',
        'Ký mã hiệu': 'code',
        'Thông tin chi tiết cấu hình': 'specificProduct',
        'Xuất xứ': 'origin',
        'Nhãn hiệu': 'brand',
        'Ngày hỏi giá': 'priceDate',
        'Năm sản xuất': 'yrs_manu',
        'Giá tiền': 'price',
        'Đơn vị tính': 'unit',
        'Nhà cung cấp': 'supplier',
        'Người hỏi giá': 'asker',
        'Ghi chú': 'note',
      };

      const errors: string[] = [];
      const newProducts: Product[] = [];

      const parsePrice = (value: any): number | null => {
        if (value === undefined || value === null || value === '') return null;
        const cleanedValue = value.toString().replace(/[, VNĐ$€]/g, '').trim();
        const parsed = parseFloat(cleanedValue);
        console.log(`Parsing price: ${value} -> ${cleanedValue} -> ${parsed}`);
        return isNaN(parsed) ? null : parsed;
      };

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rawProduct: { [key: string]: any } = {};

        for (const [excelField, modelField] of Object.entries(fieldMapping)) {
          if (row[excelField] !== undefined) {
            let value = row[excelField].toString();
            if (modelField === 'priceDate' && !isNaN(parseFloat(value))) {
              const date = new Date((parseFloat(value) - 25569) * 86400 * 1000);
              if (!isNaN(date.getTime())) {
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                value = `${day}/${month}/${year}`;
              }
            }
            rawProduct[modelField] = value;
          }
        }

        const price = parsePrice(rawProduct.price);
        if (rawProduct.price && price === null) {
          errors.push(`Dòng ${i + 2}: Giá tiền không hợp lệ (${rawProduct.price})`);
          continue;
        }

        console.log(`Dòng ${i + 2} rawProduct.price:`, rawProduct.price);
        console.log(`Dòng ${i + 2} parsed price:`, price);
        console.log(`Dòng ${i + 2} rawProduct:`, JSON.stringify(rawProduct, null, 2));

        try {
          const apiProduct: Partial<Product> = {
            name: rawProduct.name || '',
            code: rawProduct.code || '',
            specificProduct: rawProduct.specificProduct || '',
            origin: rawProduct.origin || '',
            brand: rawProduct.brand || '',
            yrs_manu: rawProduct.yrs_manu || '',
            price: price ?? 0,
            unit: rawProduct.unit || '',
            priceDate: rawProduct.priceDate || '',
            supplier: rawProduct.supplier || '',
            asker: rawProduct.asker || '',
            note: rawProduct.note || '',
          };

          console.log(`Gửi API cho dòng ${i + 2}:`, JSON.stringify(apiProduct, null, 2));

          const response = await createProduct(apiProduct);
          console.log(`Response API cho dòng ${i + 2}:`, JSON.stringify(response, null, 2));
          if (response.success && response.data) {
            newProducts.push(response.data);
          } else {
            errors.push(`Dòng ${i + 2}: ${response.message || 'Tạo sản phẩm thất bại'}`);
          }
        } catch (err) {
          errors.push(`Dòng ${i + 2}: ${(err as Error).message}`);
          console.log(`Lỗi ngoại lệ cho dòng ${i + 2}:`, err);
        }
      }

      if (errors.length > 0) {
        showModal('Lỗi nhập dữ liệu', `Có lỗi khi nhập dữ liệu:\n${errors.join('\n')}`);
      } else {
        showModal('Thành công', 'Nhập dữ liệu thành công!');
      }

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
      }
    } catch (err) {
      showModal('Lỗi', `Lỗi khi xử lý file Excel: ${(err as Error).message}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  if (loading) return <Loading message="Đang tải dữ liệu..." className="bg-white" />;
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {importing && <Loading message="Đang nhập dữ liệu..." className="bg-white" />}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-700">Quản lý sản phẩm</h1>
        <Link href="/add-product" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          <FaPlus /> Thêm sản phẩm
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-lg text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sắp xếp: Mặc định</option>
          <option value="priceDate">Sắp xếp: Ngày hỏi giá</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-indigo-600">
          <FaFileImport /> Import Excel
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
        </label>
        <button
          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
          onClick={handleExport}
        >
          <FaFileExport /> Export Excel
        </button>
      </div>

      <div>
        <h3 className="font-medium text-sm mb-2">Trường hợp lệ:</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {['name', 'code', 'specificProduct', 'origin', 'brand', 'priceDate', 'yrs_manu', 'price', 'unit', 'supplier', 'asker', 'note'].map((field) => (
            <label key={field} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={(e) =>
                  setSelectedFields((prev) =>
                    e.target.checked ? [...prev, field] : prev.filter((f) => f !== field)
                  )
                }
              />
              {{
                name: 'Tên sản phẩm',
                code: 'Mã sản phẩm',
                specificProduct: 'Thông tin chi tiết cấu hình',
                origin: 'Xuất xứ',
                brand: 'Nhãn hiệu',
                priceDate: 'Ngày hỏi giá',
                yrs_manu: 'Năm sản xuất',
                price: 'Giá',
                unit: 'Đơn vị tính',
                supplier: 'Nhà cung cấp',
                asker: 'Người hỏi giá',
                note: 'Ghi chú',
              }[field]}
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-auto rounded shadow-sm border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Tên</th>
              <th className="px-4 py-2 text-left">Mã sản phẩm</th>
              <th className="px-4 py-2 text-left">Ngày hỏi giá</th>
              <th className="px-4 py-2 text-left">Giá</th>
              <th className="px-4 py-2 text-left">Nhà cung cấp</th>
              <th className="px-4 py-2 text-left">Ghi chú</th>
              <th className="px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.code}</td>
                <td className="px-4 py-2">{product.priceDate}</td>
                <td className="px-4 py-2">
                  {product.price != null ? product.price.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa có giá'}
                </td>
                <td className="px-4 py-2">{product.supplier}</td>
                <td className="px-4 py-2">{product.note}</td>
                <td className="px-4 py-2 flex items-center gap-3 text-gray-600">
                  <Link href={`/product/${product._id}`} className="hover:text-blue-600">
                    <FaEye />
                  </Link>
                  <Link href={`/edit-product/${product._id}`} className="hover:text-yellow-500">
                    <FaEdit />
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="hover:text-red-600">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {modalTitle}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">{modalMessage}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setModalOpen(false)}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}