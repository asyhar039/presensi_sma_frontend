export function ErrorMessage({ message = 'Terjadi kesalahan saat memuat data.' }) {
  return (
    <div className="card-custom">
      <div className="alert alert-warning mb-0">
        <div className="fw-bold mb-1"><i className="fas fa-exclamation-triangle me-2"></i>Gagal Memuat Data</div>
        <div className="small">{message}</div>
      </div>
    </div>
  );
}
