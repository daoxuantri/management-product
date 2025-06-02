/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Thêm basePath nếu bạn đặt app trong src
  // basePath: '/src',  // Thường không cần nếu bạn di chuyển app ra root
};

module.exports = nextConfig; // Dòng này sẽ không còn báo lỗi sau khi cài @types/node