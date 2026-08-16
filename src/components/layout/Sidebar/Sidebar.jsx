import { NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { getFilteredMenuItems } from '../../../constants/menu';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../hooks/useAuth';
import { RenderIcon } from '../../../utils/iconMap';

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

  const linkClass = ({ isActive }) =>
    `flex items-center justify-center gap-3 rounded-[10px] px-2 py-3 text-sm font-semibold text-white/80 transition-all hover:translate-x-1 hover:bg-white/20 hover:text-white lg:justify-start lg:px-4 no-underline ${
      isActive ? 'translate-x-1 bg-white/20 text-white' : ''
    }`;

  return (
    <div className="fixed z-[100] flex h-screen w-[80px] flex-col overflow-y-auto bg-[linear-gradient(135deg,#005eff_0%,#7EB4FA_100%)] p-4 text-white shadow-[4px_0_20px_rgba(0,0,0,0.15)] lg:w-[260px]">
      <div className="mb-5 flex items-center justify-center gap-3 border-b border-white/15 pb-5 lg:justify-start">
        <div className="flex size-[42px] items-center justify-center rounded-xl bg-white/20 text-xl">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="hidden text-lg font-extrabold tracking-wide lg:block">ABSENSI SMA</div>
      </div>
      <nav className="flex flex-col">
        {visibleMenu.map((item) => (
          <NavLink key={item.key} to={`/${item.key}`} className={linkClass}>
            <RenderIcon name={item.icon} className="h-5 w-5 shrink-0" />
            <span className="hidden lg:inline">{item.label}</span>
          </NavLink>
        ))}
        <hr className="my-3 border-white/20" />
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[10px] border-0 bg-transparent px-2 py-3 text-left text-sm font-semibold text-warning hover:bg-white/10 hover:text-warning lg:justify-start lg:px-4"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" /><span className="hidden lg:inline">Keluar</span>
        </button>
      </nav>
    </div>
  );
}