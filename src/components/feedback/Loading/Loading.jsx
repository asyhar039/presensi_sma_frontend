import { Spinner } from '../../ui/Spinner/Spinner';

export function Loading({ message = 'Memuat data...' }) {
  return (
    <div className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 py-12 text-center shadow-sm">
      <Spinner className="mb-4 text-primary" srText="Loading..." />
      <div className="text-muted">{message}</div>
    </div>
  );
}