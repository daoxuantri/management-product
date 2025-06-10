import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { ProjectProductProvider } from '@/lib/projectProductContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Quản lý danh mục hàng hóa',
  description: 'Ứng dụng quản lý danh mục hàng hóa chuyên nghiệp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ProjectProductProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 transition-all duration-300">
              {children}
            </main>
          </div>
        </ProjectProductProvider>
      </body>
    </html>
  );
}