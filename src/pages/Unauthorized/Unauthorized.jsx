import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Unauthorized() {
  return (
    <div className="text-center py-5">
      <div className="display-1 fw-bold text-danger">403</div>
      <h4 className="fw-bold mb-2">Akses Ditolak</h4>
      <p className="text-muted mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link to={ROUTES.DASHBOARD} className="btn btn-primary">Kembali ke Dashboard</Link>
    </div>
  );
}
