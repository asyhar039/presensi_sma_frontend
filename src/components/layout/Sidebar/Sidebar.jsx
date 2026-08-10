import { NavLink, useNavigate } from 'react-router-dom';
import { getFilteredMenuItems } from '../../../constants/menu';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../hooks/useAuth';

export function Sidebar() {
  const { permissions, logout } = useAuth();
  const navigate = useNavigate();
  const visibleMenu = getFilteredMenuItems(permissions);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
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
  );
}
