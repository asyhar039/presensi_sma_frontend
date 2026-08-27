import { Shield } from 'lucide-react';

const SidebarHeader = () => {
  return (
    <div className="flex flex-col px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
          <span className="text-lg font-bold leading-none">SiP</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-indigo-900 leading-none">SiP</span>
      </div>
      <span className="text-xs font-medium text-slate-400 mt-1.5 ml-1">Admin Portal</span>
    </div>
  );
};

export default SidebarHeader;
