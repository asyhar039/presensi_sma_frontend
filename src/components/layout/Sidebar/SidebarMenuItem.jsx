import { NavLink } from 'react-router-dom';

const SidebarMenuItem = ({ item, onClick }) => {
  const IconComponent = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
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
          <IconComponent
            className={`h-5 w-5 shrink-0 transition-colors ${
              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarMenuItem;
