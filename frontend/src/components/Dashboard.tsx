'use client'
import Loading from '@/components/Loading'
import { useState, useEffect, useMemo } from 'react'
import { FaSearch, FaFileExport, FaFileImport, FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchProducts, deleteProduct } from '@/api/productApi'
import { Product } from '@/models/Product'

export default function Dashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'code', 'priceDate', 'price', 'supplier', 'note'])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts()
        if (response.success) setProducts(response.data)
        else throw new Error(response.message)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (sortBy === 'priceDate') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [searchTerm, sortBy, products])

  const handleDelete = async (id: string) => {
    const name = products.find(p => p._id === id)?.name || 'Sản phẩm'
    if (confirm(`Xác nhận xóa "${name}"?`)) {
      try {
        const response = await deleteProduct(id)
        if (response.success) {
          alert(response.message)
          setProducts(products.filter(p => p._id !== id))
        } else {
          throw new Error(response.message)
        }
      } catch (err) {
        setError((err as Error).message)
      }
    }
  }

  const handleExport = () => {
    console.log('Export:', selectedFields)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Import:', e.target.files?.[0])
  }

  if (loading) return <Loading message="Đang tải dữ liệu..." className="bg-white" />
  if (error) return <div className="text-red-500 text-sm">{error}</div>

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Tiêu đề + Thêm mới */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-700">Quản lý sản phẩm</h1>
        <Link href="/add-product" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
          <FaPlus /> Thêm sản phẩm
        </Link>
      </div>

      {/* Thanh tìm kiếm + Sort */}
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

      {/* Import/Export */}
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

      {/* Chọn trường xuất */}
      <div>
        <h3 className="font-medium text-sm mb-2">Trường xuất file:</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          {['name', 'code', 'priceDate', 'price', 'supplier', 'note'].map((field) => (
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
                priceDate: 'Ngày hỏi giá',
                price: 'Giá',
                supplier: 'Nhà cung cấp',
                note: 'Ghi chú',
              }[field]}
            </label>
          ))}
        </div>
      </div>

      {/* Bảng dữ liệu */}
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
                <td className="px-4 py-2">{product.price.toLocaleString('vi-VN')} VNĐ</td>
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
    </div>
  )
}
