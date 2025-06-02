import { ProductPriceModel } from '../models/ProductPriceModel';
import { useDispatch } from 'react-redux';
import { openDeleteDialog, selectProduct } from '../types';

interface ProductListItemProps {
  product: ProductPriceModel;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const dispatch = useDispatch();

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    try {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-start hover:bg-gray-50 cursor-pointer">
      <div
        className="flex-1"
        onClick={() => dispatch(selectProduct(product))}
      >
        <h3 className="font-bold text-base">{product.name || ''}</h3>
        <p className="text-gray-600 text-sm">Mã sản phẩm: {product.code || ''}</p>
      </div>
      <div className="text-right">
        <p className="text-red-600 font-semibold text-sm">
          {formatDate(product.priceDate)}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            className="text-blue-700 hover:text-blue-900"
            onClick={() => console.log('Edit', product.id)} // Placeholder for edit
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => dispatch(openDeleteDialog(product))}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;