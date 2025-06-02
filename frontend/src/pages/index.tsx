import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSearchQuery, openFilterDialog } from '../types';
import ProductListItem from '../components/ProductListItem';
import ExportDialog from '../components/ExportDialog';
import FilterDialog from '../components/FilterDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Header from '../components/Header';
import { ProductPriceModel } from '../models/ProductPriceModel';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, searchQuery, sortOption } = useSelector(
    (state: RootState) => state.home
  );

  const getFilteredProducts = (products: ProductPriceModel[]) => {
    let filtered = products.filter(
      (product) =>
        !searchQuery ||
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === 'Sắp xếp theo ngày (gần nhất trước)') {
      filtered.sort((a, b) => {
        const dateA = a.priceDate ? new Date(a.priceDate) : new Date(0);
        const dateB = b.priceDate ? new Date(b.priceDate) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts(products);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="bg-blue-700 p-4 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc mã..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="flex-1 p-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border-none focus:outline-none"
          />
          <button
            className="bg-white p-2 rounded-full"
            onClick={() => dispatch(openFilterDialog())}
          >
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1m-17 4h14m-7 4h7m-14 4h14"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-red-600 font-semibold">
          Tổng cộng: {filteredProducts.length} sản phẩm
        </p>
        <div className="mt-4">
          {filteredProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
        <button
          className="w-full bg-blue-700 text-white py-3 rounded-lg mt-4 hover:bg-blue-800"
          onClick={() => dispatch(openExportDialog())}
        >
          Xuất Excel
        </button>
      </div>
      <ExportDialog />
      <FilterDialog />
      <DeleteConfirmDialog />
    </div>
  );
};

export default HomePage;