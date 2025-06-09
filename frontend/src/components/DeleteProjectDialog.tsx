// /src/components/DeleteProjectDialog.tsx
import { useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';

interface Project {
  id: number;
  name: string;
  projectCode: string;
  startDate: string;
  endDate: string;
  supervisor: string;
  status: string;
}

interface DeleteProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function DeleteProjectDialog({ project, onClose }: DeleteProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_PROJECT',
      payload: { projectId: project.id, projectName: project.name, deliveryDate: project.startDate },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa dự án <strong>{project.name}</strong>?</p>
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