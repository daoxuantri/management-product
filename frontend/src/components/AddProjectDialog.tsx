// /src/components/AddProjectDialog.tsx
import { useState, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';

interface AddProjectDialogProps {
  onClose: () => void;
}

export default function AddProjectDialog({ onClose }: AddProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [formData, setFormData] = useState({
    name: '',
    projectCode: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    status: '',
  });

  const statusOptions = ['Đang thực hiện', 'Hoàn thành', 'Tạm dừng', 'Hủy'];

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.projectCode ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.supervisor ||
      !formData.status
    ) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const startDate = new Date(formData.startDate).toISOString().split('T')[0];
      const endDate = new Date(formData.endDate).toISOString().split('T')[0];

      dispatch({
        type: 'ADD_PROJECT',
        payload: {
          ...formData,
          startDate,
          endDate,
        },
      });
      onClose();
    } catch (e) {
      alert('Định dạng ngày không hợp lệ (YYYY-MM-DD)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm dự án mới</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Tên dự án"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mã dự án"
            className="w-full p-2 border rounded"
            value={formData.projectCode}
            onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Người quản lý"
            className="w-full p-2 border rounded"
            value={formData.supervisor}
            onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
          />
          <select
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="">Chọn trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}