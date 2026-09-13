import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout as clearLocalSession } from '../../../features/auth/authSlice';
import { getFilteredNavigation } from '../../../config/navigation';
import { ROUTES } from '../../../constants/routes';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ navigationItems, portalLabel = 'Admin Portal', showSettings = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { permissions, role, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const visibleMenu = getFilteredNavigation(permissions, role, navigationItems);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(clearLocalSession());
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="fixed top-[calc(env(safe-area-inset-top,0px)+1rem)] left-[calc(env(safe-area-inset-left,0px)+1rem)] z-[60] flex size-10 items-center justify-center rounded-lg bg-white shadow-md border border-slate-200 text-slate-600 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        aria-controls="app-sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        aria-label="Navigasi utama"
        className={`fixed inset-y-0 left-0 z-[120] flex w-[280px] flex-col bg-white border-r border-slate-200/80 transition-transform duration-300 ease-in-out pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] lg:z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Button */}
        <button
          type="button"
          className="absolute top-[calc(env(safe-area-inset-top,0px)+1rem)] right-4 flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          onClick={closeSidebar}
        >
          <X className="h-5 w-5" />
        </button>

        <SidebarHeader portalLabel={portalLabel} />
        
        <hr className="mx-4 border-slate-200/80 border-dashed" />
        
        <div className="flex-1 overflow-y-auto py-2">
          <SidebarMenu items={visibleMenu} onNavItemClick={closeSidebar} />
        </div>

        <SidebarFooter onLogout={handleLogout} onNavItemClick={closeSidebar} showSettings={showSettings} />
      </aside>
    </>
  );
};

export default Sidebar;
