import Alert from '../Alert/Alert';

const ErrorState = ({ message = 'Terjadi kesalahan saat memuat data.' }) => {
  return (
    <div className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
      <Alert variant="warning" title="Gagal Memuat Data" icon="exclamation-triangle" className="mb-0">
        <div className="text-sm">{message}</div>
      </Alert>
    </div>
  );
};

export default ErrorState;