import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSelectors';
import { useLogoutMutation } from '../features/auth/authAPI';
import { NavLink, useNavigate } from 'react-router-dom';
import { menuItems } from '../shared/constants/menu';

function getRouteTitle(pathname) {
  const key = pathname.replace('/', '');
  const menuItem = menuItems.find(item => item.key === key);
  return menuItem?.label || 'Dashboard';
}

export default function MainLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const permissions = user?.permissions || [];
  const visibleMenu = menuItems.filter((item) => permissions.includes(item.permission));
  const title = getRouteTitle(location.pathname);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="brand">
          <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
          <div className="brand-text">ABSENSI SMA</div>
        </div>
        <nav>
          {visibleMenu.map((item) => (
            <NavLink
              key={item.key}
              to={`/${item.key}`}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <i className={`fas fa-${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <button
            type="button"
            className="nav-link text-warning"
            onClick={handleLogout}
            style={{ background: 'transparent', border: 0, textAlign: 'left', cursor: 'pointer' }}
          >
            <i className="fas fa-sign-out-alt"></i><span>Keluar</span>
          </button>
        </nav>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">
            <h4>{title}</h4>
          </div>
          <div className="topbar-user">
            <div className="avatar">{user?.nama_lengkap?.charAt(0).toUpperCase() || 'A'}</div>
            <div>
              <div className="fw-bold small text-dark">{user?.nama_lengkap || 'User'}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>{user?.role?.toUpperCase() || 'USER'}</div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
