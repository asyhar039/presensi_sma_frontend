import Alert from '../Alert/Alert';
import Button from '../../ui/Button/Button';

const ErrorState = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kesalahan saat memuat data.',
  onRetry,
  maintenance = false,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
      <Alert
        variant={maintenance ? 'warning' : 'danger'}
        title={maintenance ? 'Layanan Sedang Pemeliharaan' : title}
        icon={maintenance ? 'wrench' : 'exclamation-triangle'}
        className="mb-0"
      >
        <div className="text-sm mt-1 mb-3">{message}</div>
        {onRetry ? (
          <div className="flex items-center gap-2">
            <Button variant="outline-warning" size="sm" onClick={onRetry} icon="rotate">
              Coba Lagi
            </Button>
          </div>
        ) : null}
      </Alert>
    </div>
  );
};

export default ErrorState;