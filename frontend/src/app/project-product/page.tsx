// /src/app/project-product/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import Loading from '@/components/Loading';

export default function ProjectPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Thêm logic tải dữ liệu nếu cần
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loading message="Đang tải danh sách dự án..." size="large" className="bg-white" />;
  if (error) return <div className="text-red-500 text-center">Lỗi: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý dự án</h1>
      <ProjectList />
    </div>
  );
}