import { useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { deleteProject } from '../api/projectApi';

interface DeleteProjectDialogProps {
  project: any;
  onClose: () => void;
}

export default function DeleteProjectDialog({ project, onClose }: DeleteProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);

  const handleDelete = async () => {
    try {
      await deleteProject(project._id);
      dispatch({ type: 'DELETE_PROJECT', payload: { projectId: project._id } });
      onClose();
    } catch (e) {
      alert('Lỗi khi xóa dự án');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa dự án</h2>
        <p>Bạn có chắc chắn muốn xóa dự án "{project.name || 'N/A'}"?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}