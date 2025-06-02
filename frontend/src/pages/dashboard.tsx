import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import Header from '../components/Header';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage: FC = () => {
  const { products } = useSelector((state: RootState) => state.home);

  // Xử lý dữ liệu cho biểu đồ
  const brands = Array.from(
    new Set(products?.map((p) => p.brand || 'Unknown') || [])
  );
  const brandCounts = brands.map(
    (brand) => products?.filter((p) => p.brand === brand).length || 0
  );

  // Danh sách màu động để hỗ trợ nhiều nhãn hiệu
  const colors = [
    'rgba(59, 130, 246, 0.6)', // Blue
    'rgba(234, 179, 8, 0.6)', // Yellow
    'rgba(239, 68, 68, 0.6)', // Red
    'rgba(16, 185, 129, 0.6)', // Green
    'rgba(139, 92, 246, 0.6)', // Purple
    'rgba(236, 72, 153, 0.6)', // Pink
  ];
  const backgroundColors = brands.map((_, index) => colors[index % colors.length]);
  const borderColors = brands.map((_, index) =>
    colors[index % colors.length].replace('0.6', '1')
  );

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: brands,
    datasets: [
      {
        label: 'Số lượng sản phẩm',
        data: brandCounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượng',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Nhãn hiệu',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Danh mục khác</h2>
        <p className="text-red-600 font-semibold mb-4">
          Tổng cộng: {products?.length || 0} sản phẩm
        </p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Thống kê theo nhãn hiệu</h3>
          {brands.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Không có dữ liệu để hiển thị biểu đồ</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;