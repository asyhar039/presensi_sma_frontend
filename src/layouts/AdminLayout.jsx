import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-[80px] w-[calc(100%-80px)] flex-1 p-4 lg:ml-[260px] lg:w-[calc(100%-260px)] lg:p-[30px]">
        <Navbar />
        <div className="p-4">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}