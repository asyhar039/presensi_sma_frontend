import { NavLink } from 'react-router-dom';

const SidebarMenuItem = ({ item, onClick }) => {
  const IconComponent = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 no-underline ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <IconComponent
            className={`h-5 w-5 shrink-0 transition-colors ${
              isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarMenuItem;
