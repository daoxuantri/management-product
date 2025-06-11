// /src/components/ProjectCard.tsx
import { useState, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { Project } from '@/models/Project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getProgressColor = (progress: string | undefined) => {
    const safeProgress = progress || '';
    switch (safeProgress.toLowerCase()) {
      case 'chưa hoàn thành': return 'bg-yellow-500';
      case 'hoàn thành': return 'bg-gray-500';
      case 'tạm dừng': return 'bg-orange-500';
      case 'hủy': return 'bg-red-500';
      default: return 'bg-blue-700';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <Link href={`/project/${project._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name || 'Không có tên'}</h3>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-700 text-white p-2 rounded-full hover:bg-red-800"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Mã dự án:</span>
          <span className="font-medium">{project.code || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Thời gian:</span>
          <span className="font-medium text-green-600">{project.time || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Người quản lý:</span>
          <span className="font-medium">{project.supervisor || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Tiến độ:</span>
          <span className={`px-2 py-1 rounded text-white ${getProgressColor(project.progress)}`}>
            {project.progress || 'Không có'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Tổng giá:</span>
          <span className="font-medium text-gray-800">{project.total?.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditProjectDialog project={project} onClose={() => setIsEditDialogOpen(false)} />
      )}
      {isDeleteDialogOpen && (
        <DeleteProjectDialog project={project} onClose={() => setIsDeleteDialogOpen(false)} />
      )}
    </div>
  );
}