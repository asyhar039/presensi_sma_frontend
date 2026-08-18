import { Shield } from 'lucide-react';

const SidebarHeader = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
        <Shield className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-indigo-600 leading-none">SiP</span>
        <span className="text-xs font-medium text-slate-500 mt-1">Admin Portal</span>
      </div>
    </div>
  );
};

export default SidebarHeader;
