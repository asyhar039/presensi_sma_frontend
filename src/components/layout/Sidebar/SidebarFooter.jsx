import { NavLink } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

const SidebarFooter = ({ onLogout, onNavItemClick }) => {
  return (
    <div className="flex flex-col gap-1.5 p-3 border-t border-slate-200/80">
      <NavLink
        to="/settings"
        onClick={onNavItemClick}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 no-underline ${
            isActive
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Settings
              className={`h-5 w-5 shrink-0 transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
              }`}
            />
            <span className="truncate">Settings</span>
          </>
        )}
      </NavLink>

      <button
        type="button"
        onClick={onLogout}
        className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <LogOut className="h-5 w-5 shrink-0 text-red-500 transition-colors group-hover:text-red-600" />
        <span className="truncate">Keluar</span>
      </button>
    </div>
  );
};

export default SidebarFooter;
