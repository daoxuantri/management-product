// /src/components/EditProjectDialog.tsx
import { useState, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { updateProject } from '@/api/projectApi';
import { Project } from '@/models/Project';

interface EditProjectDialogProps {
  project: Project;
  onClose: () => void;
}

export default function EditProjectDialog({ project, onClose }: EditProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [formData, setFormData] = useState<Partial<Project>>(project);

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.time || !formData.supervisor || !formData.progress) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const response = await updateProject(project._id || '', {
        ...formData,
        time: formData.time || '', // Đảm bảo time luôn là string
      } as Project);
      dispatch({ type: 'UPDATE_PROJECT', payload: response.data });
      onClose();
    } catch (e) {
      alert('Lỗi khi cập nhật dự án');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chỉnh sửa dự án</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên dự án *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Mã dự án *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.code || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Thời gian (dd/MM/yyyy) *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.time || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Người quản lý *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.supervisor || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.progress || 'Chưa hoàn thành'}
            onChange={(e) => setFormData(prev => ({ ...prev, progress: e.target.value }))}
          >
            <option value="Chưa hoàn thành">Chưa hoàn thành</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Tạm dừng">Tạm dừng</option>
            <option value="Hủy">Hủy</option>
          </select>
          <textarea
            placeholder="Ghi chú"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            value={formData.note || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}