// /src/components/AddProjectDialog.tsx
import { useState, useContext } from 'react';
import { ProjectProductContext } from '@/lib/projectProductContext';
import { createProject } from '@/api/projectApi';

interface AddProjectDialogProps {
  onClose: () => void;
}

export default function AddProjectDialog({ onClose }: AddProjectDialogProps) {
  const { dispatch } = useContext(ProjectProductContext);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    status: '',
  });

  const statusOptions = ['Đang thực hiện', 'Hoàn thành', 'Tạm dừng', 'Hủy'];

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.startDate || !formData.endDate || !formData.supervisor || !formData.status) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const response = await createProject({
        name: formData.name,
        code: formData.code,
        startDate: formData.startDate,
        endDate: formData.endDate,
        supervisor: formData.supervisor,
        status: formData.status,
        list_product: [],
        total: 0,
        note: '',
      });
      dispatch({ type: 'ADD_PROJECT', payload: response.data });
      onClose();
    } catch (e) {
      alert('Lỗi khi thêm dự án');
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
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ngày bắt đầu (dd/M/yyyy)"
            className="w-full p-2 border rounded"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ngày kết thúc (dd/M/yyyy)"
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