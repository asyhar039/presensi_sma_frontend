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
    <div className="mb-7 flex items-center justify-between rounded-2xl bg-card-bg px-6 py-4 shadow-sm">
      <h4 className="mb-0 text-xl font-bold text-text-main">{title}</h4>
      <div className="flex items-center gap-3">
        <Avatar name={user?.nama_lengkap} />
        <div>
          <div className="text-sm font-bold text-dark">{user?.nama_lengkap || 'User'}</div>
          <div className="text-[11px] text-muted">{user?.role?.toUpperCase() || 'USER'}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;