import { useLocation } from 'react-router-dom';
import { menuItems } from '../../../constants/menu';
import { useAuth } from '../../../hooks/useAuth';
import { getInitials } from '../../../utils/format';

function getRouteTitle(pathname) {
  const key = pathname.replace('/', '');
  const menuItem = menuItems.find((item) => item.key === key);
  return menuItem?.label || 'Dashboard';
}

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const title = getRouteTitle(location.pathname);

  return (
    <div className="topbar">
      <div className="topbar-title">
        <h4>{title}</h4>
      </div>
      <div className="topbar-user">
        <div className="avatar">{getInitials(user?.nama_lengkap)}</div>
        <div>
          <div className="fw-bold small text-dark">{user?.nama_lengkap || 'User'}</div>
          <div className="text-muted" style={{ fontSize: 11 }}>{user?.role?.toUpperCase() || 'USER'}</div>
        </div>
      </div>
    </div>
  );
}
