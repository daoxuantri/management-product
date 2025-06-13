import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Project } from '@/models/Project';
import { deleteProject } from '@/api/projectApi';
import { toast } from 'react-toastify';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onDelete: () => void;
}

export default function DeleteProjectDialog({ isOpen, onClose, project, onDelete }: DeleteProjectDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteProject(project._id!);
      if (response.success) {
        onDelete();
        toast.success('Xóa dự án thành công');
        onClose();
      } else {
        throw new Error(response.message || 'Xóa thất bại');
      }
    } catch (err) {
      toast.error(`Lỗi: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          aria-label="Đóng hộp thoại xóa"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Xóa dự án</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc muốn xóa dự án <strong>{project.name || 'Không có tên'}</strong>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
            aria-label="Hủy xóa"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            disabled={loading}
            aria-label="Xác nhận xóa dự án"
          >
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}