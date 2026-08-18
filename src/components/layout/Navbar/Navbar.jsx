import { useLocation } from 'react-router-dom';
import { menuItems } from '../../../constants/menu';
import { useAuth } from '../../../hooks/useAuth';
import Avatar from '../../ui/Avatar/Avatar';

const getRouteTitle = (pathname) => {
  const key = pathname.replace('/', '');
  const menuItem = menuItems.find((item) => item.key === key);
  return menuItem?.label || 'Dashboard';
}

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const title = getRouteTitle(location.pathname);

  return (
    <div className="mb-7 ml-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card-bg px-4 py-4 shadow-sm sm:px-6 lg:ml-0">
      <h4 className="mb-0 min-w-0 truncate text-lg font-bold text-text-main sm:text-xl">{title}</h4>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user?.nama_lengkap} />
        <div className="hidden min-w-0 sm:block">
          <div className="truncate text-sm font-bold text-dark">{user?.nama_lengkap || 'User'}</div>
          <div className="text-xs text-muted">{user?.role?.toUpperCase() || 'USER'}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;