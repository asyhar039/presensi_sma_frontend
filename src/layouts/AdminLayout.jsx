import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer/Footer';
import OfflineBanner from '../components/ui/OfflineBanner/OfflineBanner';

const AdminLayout = () => {
  return (
    <div className="flex min-h-dvh overflow-x-hidden bg-slate-50">
      <OfflineBanner />
      <Sidebar />
      <div className="flex-1 w-full lg:pl-[280px]">
        <div className="p-4 lg:p-8 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
          <Header />
          <div className="mt-6">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;