import { useDispatch, useSelector } from 'react-redux';
import { RootState, setSortOption, closeFilterDialog } from '../types';

const FilterDialog = () => {
  const dispatch = useDispatch();
  const { sortOption, filterDialogOpen } = useSelector(
    (state: RootState) => state.home
  );
  const sortOptions = ['Không sắp xếp', 'Sắp xếp theo ngày (gần nhất trước)'];

  if (!filterDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Lọc theo tiêu chí</h2>
        <select
          value={sortOption}
          onChange={(e) => dispatch(setSortOption(e.target.value))}
          className="w-full p-2 border rounded-lg bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            onClick={() => {
              dispatch(closeFilterDialog());
            }}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDialog;