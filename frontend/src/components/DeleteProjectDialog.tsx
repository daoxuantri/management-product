// /src/components/DeleteProjectDialog.tsx
import { useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { deleteProject } from '@/api/projectApi';
import { Project } from '@/models/Project';

interface DeleteProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function DeleteProjectDialog({ project, onClose }: DeleteProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);

  const handleDelete = async () => {
    try {
      if (!project._id) {
        alert('Không tìm thấy ID dự án');
        return;
      }
      await deleteProject(project._id);
      dispatch({ type: 'DELETE_PROJECT', payload: { projectId: project._id } });
      onClose();
    } catch (e) {
      alert('Lỗi khi xóa dự án');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa dự án</h2>
        <p className="text-gray-600">Bạn có chắc chắn muốn xóa dự án "<span className="font-medium">{project.name || 'N/A'}</span>"?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}