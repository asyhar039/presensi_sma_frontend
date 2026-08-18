import SidebarMenuItem from './SidebarMenuItem';

const SidebarMenu = ({ items, onNavItemClick }) => {
  return (
    <nav className="flex flex-col gap-1.5 px-3 py-2 flex-1">
      {items.map((item) => (
        <SidebarMenuItem key={item.key} item={item} onClick={onNavItemClick} />
      ))}
    </nav>
  );
};

export default SidebarMenu;
