// /src/components/ProjectCard.tsx
import { useState, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  status: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đang thực hiện':
        return 'bg-green-500';
      case 'hoàn thành':
        return 'bg-gray-500';
      case 'tạm dừng':
        return 'bg-orange-500';
      case 'hủy':
        return 'bg-red-500';
      default:
        return 'bg-blue-700';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white shadow-sm">
      <div className="flex justify-between">
        <Link href={`/project/${project.id}`}>
          <h3 className="text-lg font-bold text-black">{project.name || 'Không có tên'}</h3>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-red-700 text-white p-2 rounded hover:bg-red-800"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Mã dự án:</span>
          <span>{project.projectCode || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Ngày bắt đầu:</span>
          <span className="text-green-600 font-medium">{project.startDate || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Ngày kết thúc:</span>
          <span className="text-red-600 font-medium">{project.endDate || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Người quản lý:</span>
          <span>{project.supervisor || 'Không có'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Trạng thái:</span>
          <span className={`text-white px-2 py-1 rounded ${getStatusColor(project.status)}`}>
            {project.status || 'Không có'}
          </span>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditProjectDialog
          project={project}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteProjectDialog
          project={project}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}