import { menuItems } from '../constants/menu';

export function Layout({ title, user, activeView, onNavigate, onLogout, children }) {
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="brand">
          <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
          <div className="brand-text">ABSENSI SMA</div>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-link ${activeView === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
              style={{ background: 'transparent', border: 0, textAlign: 'left' }}
            >
              <i className={`fas fa-${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
          <button type="button" className="nav-link text-warning" onClick={onLogout} style={{ background: 'transparent', border: 0, textAlign: 'left' }}>
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

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}
