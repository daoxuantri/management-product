import { useDispatch } from 'react-redux';
import { openExportDialog } from '../types';

const Header = () => {
  const dispatch = useDispatch();

  return (
    <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Quản lý sản phẩm</h1>
      <button
        className="p-2 hover:bg-blue-800 rounded"
        onClick={() => dispatch(openExportDialog())}
        title="Xuất Excel"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </div>
  );
};

export default Header;