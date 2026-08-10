import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <div className="display-1 fw-bold text-primary">404</div>
      <h4 className="fw-bold mb-2">Halaman Tidak Ditemukan</h4>
      <p className="text-muted mb-4">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <Link to={ROUTES.DASHBOARD} className="btn btn-primary">Kembali ke Dashboard</Link>
    </div>
  );
}
