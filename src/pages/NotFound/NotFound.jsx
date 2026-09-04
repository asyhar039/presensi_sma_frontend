import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const NotFound = () => {
  return (
    <div className="py-12 text-center">
      <div className="text-8xl font-extrabold text-primary">404</div>
      <h4 className="mb-2 text-xl font-bold">Halaman Tidak Ditemukan</h4>
      <p className="mb-4 text-muted">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-primary bg-primary px-3 py-1.5 text-base font-medium text-white no-underline transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default NotFound;