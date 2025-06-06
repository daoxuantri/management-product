// app/product/[id]/page.tsx
'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { FaEdit, FaSave, FaTimes, FaTrash, FaEye, FaArrowLeft } from "react-icons/fa"; // Added FaArrowLeft
import { format, isValid, parse } from "date-fns";

interface Props {
  params: { id: string };
}

interface Product {
  id: number;
  code: string;
  name?: string;
  specificProduct?: string;
  unit?: string;
  price?: number;
  priceDate?: string;
  origin?: string;
  brand?: string;
  supplier: string;
  asker: string;
  note?: string;
}

export default function ProductDetail({ params }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPriceDate, setTempPriceDate] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sample data
  const products: Product[] = [
    {
      id: 1,
      code: "SP001",
      name: "Sản phẩm A",
      specificProduct: "OPPO Reno10 Pro Plus 5G chính là phiên bản điện thoại mới nhất trong dòng OPPO Reno và rất được mong đợi. Đây là chiếc điện thoại thông minh có hỗ trợ 5G với những thông số gây ấn tượng mạnh. Cụ thể, Reno10 Pro+ tạo được điểm chú ý đầu tiên từ ngay trong thiết kế của sản phẩm. Những tính năng tuyệt vời được trang bị trên chiếc điện thoại này bao gồm bộ xử lý mạnh mẽ, màn hình lớn sống động và hệ thống 3 camera với độ phân giải rất đáng để mong đợi.",
      unit: "Cái",
      price: 100000,
      priceDate: "2025-06-01",
      origin: "Việt Nam",
      brand: "Thương hiệu A",
      supplier: "Nhà cung cấp A",
      asker: "Người hỏi A",
      note: "Ghi chú A",
    },
    {
      id: 2,
      code: "SP002",
      name: "Sản phẩm B",
      specificProduct: "Chi tiết B",
      unit: "Cái",
      price: 150000,
      priceDate: "2025-06-02",
      origin: "Trung Quốc",
      brand: "Thương hiệu B",
      supplier: "Nhà cung cấp B",
      asker: "Người hỏi B",
      note: "Ghi chú B",
    },
  ];

  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  const [formData, setFormData] = useState({
    code: product.code,
    name: product.name || "",
    specificProduct: product.specificProduct || "",
    unit: product.unit || "",
    price: product.price?.toString() || "",
    priceDate: formatDate(product.priceDate),
    origin: product.origin || "",
    brand: product.brand || "",
    supplier: product.supplier,
    asker: product.asker,
    note: product.note || "",
  });

  function formatDate(date?: string): string {
    if (!date) return "";
    try {
      const parsedDate = parse(date, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd/MM/yy");
      }
      return date;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  }

  function formatPrice(price?: string): string {
    if (!price) return "N/A";
    const num = parseInt(price);
    if (isNaN(num)) return "N/A";
    return num.toLocaleString("vi-VN") + " VNĐ";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTempPriceDate(value ? format(parse(value, "yyyy-MM-dd", new Date()), "dd/MM/yy") : "");
    setFormData((prev) => ({ ...prev, priceDate: value ? format(parse(value, "yyyy-MM-dd", new Date()), "dd/MM/yy") : "" }));
    setErrors((prev) => ({ ...prev, priceDate: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.code.trim()) newErrors.code = "Nhập mã";
    if (!formData.supplier.trim()) newErrors.supplier = "Nhập NCC";
    if (!formData.asker.trim()) newErrors.asker = "Nhập người hỏi";
    if (formData.price && isNaN(parseInt(formData.price))) newErrors.price = "Số không hợp lệ";
    if (formData.priceDate) {
      try {
        parse(formData.priceDate, "dd/MM/yy", new Date());
      } catch {
        newErrors.priceDate = "Ngày không hợp lệ";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (validateForm()) {
        console.log("Lưu chỉnh sửa:", formData);
        setIsEditing(false);
        setTempPriceDate("");
      }
    } else {
      setIsEditing(true);
      setTempPriceDate(formData.priceDate);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempPriceDate("");
    setFormData({
      code: product.code,
      name: product.name || "",
      specificProduct: product.specificProduct || "",
      unit: product.unit || "",
      price: product.price?.toString() || "",
      priceDate: formatDate(product.priceDate),
      origin: product.origin || "",
      brand: product.brand || "",
      supplier: product.supplier,
      asker: product.asker,
      note: product.note || "",
    });
    setErrors({});
  };

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${formData.name || "N/A"}"?`)) {
      console.log(`Xóa sản phẩm ID: ${product.id}`);
      router.push("/");
    }
  };

  // New handler for Back button
  const handleBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="max-w-1xl space-y-1 p-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-600 transition"
          title="Quay lại"
        >
          <FaArrowLeft size={14} /> Quay lại
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Chi tiết sản phẩm</h1>
        <div className="flex gap-1">
          <button
            className="p-2 text-blue-600 hover:text-blue-800 transition"
            onClick={handleEditToggle}
            title={isEditing ? "Lưu" : "Chỉnh sửa"}
          >
            {isEditing ? <FaSave size={16} /> : <FaEdit size={16} />}
          </button>
          {isEditing && (
            <button
              className="p-2 text-gray-600 hover:text-gray-800 transition"
              onClick={handleCancel}
              title="Hủy"
            >
              <FaTimes size={16} />
            </button>
          )}
          <button
            className="p-2 text-red-600 hover:text-red-800 transition"
            onClick={handleDelete}
            title="Xóa"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      <form ref={formRef} className="space-y-2">
        <div className="text-sm font-semibold text-teal-600">Thông tin sản phẩm</div>
        {renderInfoCard("Mã sản phẩm", "code", formData.code, isEditing, handleChange, errors.code)}
        {renderInfoCard("Tên sản phẩm", "name", formData.name, isEditing, handleChange, errors.name)}
        {renderInfoCard("Chi tiết sản phẩm", "specificProduct", formData.specificProduct, isEditing, handleChange, errors.specificProduct, true)}
        {renderCombinedInfoCard(
          "Đơn vị",
          "unit",
          formData.unit,
          "Giá",
          "price",
          formData.price,
          isEditing,
          handleChange,
          handleChange,
          errors.unit,
          errors.price,
          false,
          true
        )}
        {renderInfoCard("Ngày hỏi giá", "priceDate", formData.priceDate, isEditing, handleChange, errors.priceDate, false, false, true, handleDateChange)}
        {renderCombinedInfoCard(
          "Xuất xứ",
          "origin",
          formData.origin,
          "Thương hiệu",
          "brand",
          formData.brand,
          isEditing,
          handleChange,
          handleChange,
          errors.origin,
          errors.brand
        )}
        {renderInfoCard("Nhà cung cấp", "supplier", formData.supplier, isEditing, handleChange, errors.supplier)}
        {renderInfoCard("Người hỏi giá", "asker", formData.asker, isEditing, handleChange, errors.asker)}
        {renderInfoCard("Ghi chú", "note", formData.note, isEditing, handleChange, errors.note, true)}
      </form>
    </div>
  );

  function renderInfoCard(
    label: string,
    name: string,
    value: string,
    isEditing: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    error?: string,
    isMultiline: boolean = false,
    isPrice: boolean = false,
    isDate: boolean = false,
    onDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) {
    const displayValue = isEditing ? value : value || "N/A";
    const formattedValue = isEditing ? displayValue : isPrice ? formatPrice(value) : isDate ? formatDate(value) : displayValue;

    return (
      <div className="bg-white border rounded-lg shadow-sm p-2 flex items-start gap-2">
        <FaEye className="text-teal-600 mt-0.5" size={16} />
        <div className="flex-1">
          {isEditing ? (
            isDate ? (
              <div className="mt-0.5">
                <input
                  type="date"
                  name={name}
                  value={tempPriceDate ? format(parse(tempPriceDate, "dd/MM/yy", new Date()), "yyyy-MM-dd") : ""}
                  onChange={onDateChange}
                  className={`w-full border rounded p-1.5 text-xs ${error ? "border-red-600" : "border-gray-300"}`}
                  placeholder="DD/MM/YY"
                />
                {error && <p className="text-red-600 text-[11px] mt-0.5">{error}</p>}
              </div>
            ) : isMultiline ? (
              <div className="mt-0.5">
                <textarea
                  name={name}
                  value={value}
                  onChange={onChange}
                  className={`w-full border rounded p-1.5 text-xs ${error ? "border-red-600" : "border-gray-300"}`}
                  rows={1}
                  placeholder={label}
                />
                {error && <p className="text-red-600 text-[11px] mt-0.5">{error}</p>}
              </div>
            ) : (
              <div className="mt-0.5">
                <input
                  type={isPrice ? "number" : "text"}
                  name={name}
                  value={value}
                  onChange={onChange}
                  className={`w-full border rounded p-1.5 text-xs ${error ? "border-red-600" : "border-gray-300"}`}
                  placeholder={label}
                />
                {error && <p className="text-red-600 text-[11px] mt-0.5">{error}</p>}
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 mt-0.5">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">{label}:</label>
              <span className={`text-xs text-gray-600 font-normal ${!value ? "text-red-400" : ""}`}>
                {formattedValue}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderCombinedInfoCard(
    label1: string,
    name1: string,
    value1: string,
    label2: string,
    name2: string,
    value2: string,
    isEditing: boolean,
    onChange1: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    onChange2: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    error1?: string,
    error2?: string,
    isMultiline: boolean = false,
    isPrice: boolean = false
  ) {
    const displayValue1 = isEditing ? value1 : value1 || "N/A";
    const displayValue2 = isEditing ? value2 : value2 || "N/A";
    const formattedValue2 = isEditing ? displayValue2 : isPrice ? formatPrice(value2) : displayValue2;

    return (
      <div className="bg-white border rounded-lg shadow-sm p-2 flex items-start gap-2">
        <FaEye className="text-teal-600 mt-0.5" size={16} />
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div>
            {isEditing ? (
              <>
                <label className="text-sm font-semibold text-gray-900">{label1}</label>
                <div className="mt-0.5">
                  <input
                    type="text"
                    name={name1}
                    value={value1}
                    onChange={onChange1}
                    className={`w-full border rounded p-1.5 text-xs ${error1 ? "border-red-600" : "border-gray-300"}`}
                    placeholder={label1}
                  />
                  {error1 && <p className="text-red-600 text-[11px] mt-0.5">{error1}</p>}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">{label1}:</label>
                <span className={`text-xs text-gray-600 font-normal ${!value1 ? "text-red-400" : ""}`}>{displayValue1}</span>
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <>
                <label className="text-sm font-semibold text-gray-900">{label2}</label>
                <div className="mt-0.5">
                  <input
                    type={isPrice ? "number" : "text"}
                    name={name2}
                    value={value2}
                    onChange={onChange2}
                    className={`w-full border rounded p-1.5 text-xs ${error2 ? "border-red-600" : "border-gray-300"}`}
                    placeholder={label2}
                  />
                  {error2 && <p className="text-red-600 text-[11px] mt-0.5">{error2}</p>}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">{label2}:</label>
                <span className={`text-xs text-gray-600 font-normal ${!value2 ? "text-red-400" : ""}`}>{formattedValue2}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}