import SidebarMenuItem from './SidebarMenuItem';

const SidebarMenu = ({ items, onNavItemClick }) => {
  return (
    <nav className="flex flex-col gap-1.5 px-3 py-2 flex-1">
      {items.map((item) => (
        <div key={item.key}>
          {item.section ? <div className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 first:pt-2">{item.section}</div> : null}
          <SidebarMenuItem item={item} onClick={onNavItemClick} />
        </div>
      ))}
    </nav>
  );
};

export default SidebarMenu;
