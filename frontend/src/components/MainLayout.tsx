import SidebarComponent from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <SidebarComponent />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MainLayout;