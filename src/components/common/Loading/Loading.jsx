export function Loading({ message = 'Memuat data...' }) {
  return (
    <div className="card-custom text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted">{message}</div>
    </div>
  );
}
