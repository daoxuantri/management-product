// /src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { ProjectProductProvider } from '@/lib/projectProductContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quản lý danh mục hàng hóa',
  description: 'Ứng dụng quản lý danh mục hàng hóa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ProjectProductProvider>
          <div className="flex min-h-screen">
            {/* Sidebar cố định */}
            <div className="fixed w-64 h-screen">
              <Sidebar />
            </div>
            {/* Main content có thể scroll */}
            <main className="flex-1 ml-64 p-6 overflow-y-auto min-h-screen">
              {children}
            </main>
          </div>
        </ProjectProductProvider>
      </body>
    </html>
  );
}