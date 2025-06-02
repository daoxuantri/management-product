import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleSidebar } from '../types';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FiBox, FiUser } from 'react-icons/fi';
import { IoIosArrowDropright, IoIosArrowDropleft } from 'react-icons/io';
import Link from 'next/link';

const SidebarComponent = () => {
  const { collapsed, toggle } = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();

  return (
    <Sidebar
      collapsed={collapsed}
      breakPoint="lg"
      toggled={toggle}
      onBackdropClick={() => dispatch(toggleSidebar())}
      className="h-screen"
    >
      <Menu>
        <MenuItem
          className="lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
          icon={toggle ? <IoIosArrowDropright className="text-2xl" /> : <IoIosArrowDropleft className="text-2xl" />}
        >
          Toggle
        </MenuItem>
        <MenuItem
          icon={<MdOutlineSpaceDashboard className="text-2xl" />}
          component={<Link href="/" />}
        >
          Trang chủ
        </MenuItem>
        <MenuItem
          icon={<FiBox className="text-2xl" />}
          component={<Link href="/dashboard" />}
        >
          Danh mục khác
        </MenuItem>
        <MenuItem
          icon={<FiUser className="text-2xl" />}
          component={<Link href="/users" />}
        >
          Người dùng
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;