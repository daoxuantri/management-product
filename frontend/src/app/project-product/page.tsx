'use client';

import { useState, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import Loading from '@/components/Loading';

export default function ProjectProduct() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Giả lập tải dữ liệu ban đầu
    setLoading(false);
  }, []);

  if (loading) return <Loading message="Đang tải danh sách dự án..." size="large" className="bg-white" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý dự án</h1>
      <ProjectList />
    </div>
  );
}