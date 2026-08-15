import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Unauthorized() {
  return (
    <div className="py-12 text-center">
      <div className="text-8xl font-extrabold text-danger">403</div>
      <h4 className="mb-2 text-xl font-bold">Akses Ditolak</h4>
      <p className="mb-4 text-muted">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-primary bg-primary px-3 py-1.5 text-base font-medium text-white no-underline transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}