// /src/app/project/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchProjectDetail } from '@/api/projectApi';
import { Project, ProjectProduct } from '@/models/Project';
import Loading from '@/components/Loading';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectDetail = async () => {
      if (!id) {
        setError('Không tìm thấy ID dự án');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchProjectDetail(id as string);
        if (response.success) {
          setProject(response.data);
        } else {
          throw new Error(response.message || 'Không thể tải thông tin dự án');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetail();
  }, [id]);

  if (loading) return <Loading message="Đang tải chi tiết dự án..." size="large" className="bg-white" />;
  if (error) return <div className="text-red-500 text-center p-6">Lỗi: {error}</div>;
  if (!project) return <div className="text-gray-500 text-center p-6">Không tìm thấy dự án</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/project-product')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Chi tiết dự án: {project.name}</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Tên dự án</h3>
            <p className="text-gray-600">{project.name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Mã dự án</h3>
            <p className="text-gray-600">{project.code || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Thời gian</h3>
            <p className="text-gray-600">{project.time || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Người giám sát</h3>
            <p className="text-gray-600">{project.supervisor || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Tiến độ</h3>
            <p className={`text-white px-2 py-1 rounded inline-block ${
              project.progress === 'Hoàn thành' ? 'bg-green-500' :
              project.progress === 'Tạm dừng' ? 'bg-orange-500' :
              project.progress === 'Hủy' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
              {project.progress || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Tổng giá</h3>
            <p className="text-gray-600">{project.total?.toLocaleString() || 0} VNĐ</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700">Ghi chú</h3>
            <p className="text-gray-600">{project.note || 'Không có ghi chú'}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Danh sách sản phẩm</h3>
          {project.list_product && project.list_product.length > 0 ? (
            <div className="max-h-48 overflow-y-auto border rounded-lg p-2 bg-gray-50">
              {project.list_product.map((item: ProjectProduct, index: number) => {
                const product = typeof item.product === 'string'
                  ? { name: 'N/A', code: 'N/A' }
                  : item.product;
                return (
                  <div
                    key={item._id || index}
                    className="flex justify-between items-center text-sm py-2 border-b"
                  >
                    <span>
                      {product.name} ({product.code}) - x{item.quantity} - {item.total_product.toLocaleString()} VNĐ
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
}