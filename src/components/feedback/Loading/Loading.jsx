import Spinner from '../../ui/Spinner/Spinner';

const Skeleton = ({ className = '', style }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className}`.trim()}
    style={style}
    aria-hidden="true"
  />
);

const Loading = ({
  message = 'Memuat data...',
  variant = 'spinner',
  rows = 0,
}) => {
  if (variant === 'skeleton' && rows > 0) {
    return (
      <div className="space-y-3" role="status" aria-label="Memuat konten">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 py-12 text-center shadow-sm">
      <Spinner className="mb-4 text-primary" srText="Loading..." />
      <div className="text-muted">{message}</div>
    </div>
  );
};

export { Loading, Skeleton };
export default Loading;