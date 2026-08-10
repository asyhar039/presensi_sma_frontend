import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Footer } from '../components/layout/Footer/Footer';

export default function AdminLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="p-3">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
