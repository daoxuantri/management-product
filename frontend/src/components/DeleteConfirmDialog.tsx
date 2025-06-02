import { useDispatch, useSelector } from 'react-redux';
import { RootState, closeDeleteDialog, deleteProduct } from '../types';

const DeleteConfirmDialog = () => {
  const dispatch = useDispatch();
  const { selectedProduct, deleteDialogOpen } = useSelector(
    (state: RootState) => state.home
  );

  if (!deleteDialogOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold">Xóa sản phẩm?</h2>
        <p>Bạn có chắc muốn xóa {selectedProduct.name || ''}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => dispatch(closeDeleteDialog())}
          >
            Hủy
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={() => {
              dispatch(deleteProduct(selectedProduct.id!));
              dispatch(closeDeleteDialog());
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;