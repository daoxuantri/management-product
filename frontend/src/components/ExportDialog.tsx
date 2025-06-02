import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateFieldSelection, closeExportDialog } from '../types';

const ExportDialog = () => {
  const dispatch = useDispatch();
  const { fieldSelection, exportDialogOpen } = useSelector(
    (state: RootState) => state.home
  );

  if (!exportDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Chọn trường cần xuất
        </h2>
        {Object.keys(fieldSelection).map((field) => (
          <div
            key={field}
            className={`p-2 rounded-lg mb-2 ${
              fieldSelection[field] ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={fieldSelection[field]}
                onChange={() =>
                  dispatch(updateFieldSelection({ field, value: !fieldSelection[field] }))
                }
                className="mr-2"
              />
              {field}
            </label>
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => dispatch(closeExportDialog())}
          >
            Hủy
          </button>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            onClick={() => {
              dispatch(closeExportDialog());
              // Implement export logic later
              console.log('Export with fields:', fieldSelection);
            }}
          >
            Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;    