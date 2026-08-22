import RenderIcon from '../../../utils/iconMap';
import Button from '../../ui/Button/Button';

const EmptyState = ({
  title,
  message = 'Belum ada data',
  icon = 'info-circle',
  action,
  className = '',
  variant = 'default',
  onRetry,
}) => {
  if (variant === 'maintenance') {
    return (
      <div
        className={`rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm text-center`}
        role="status"
        aria-label="Layanan sedang pemeliharaan"
      >
        <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <RenderIcon name="wrench" className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-main">Layanan Sedang Pemeliharaan</h3>
        <p className="mb-4 text-muted max-w-sm mx-auto">
          {message}
        </p>
        {onRetry ? (
          <Button variant="outline-warning" size="sm" onClick={onRetry}>
            Coba Lagi
          </Button>
        ) : null}
      </div>
    );
  }

  if (variant === 'error') {
    return (
      <div
        className={`rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm text-center`}
        role="status"
        aria-live="polite"
      >
        <RenderIcon
          name="exclamation-triangle"
          className="h-8 w-8 mx-auto text-danger mb-4"
          aria-label="Error"
        />
        {title ? (
          <h3 className="mb-3 text-lg font-semibold text-text-main">{title}</h3>
        ) : null}
        {message ? <p className="text-muted">{message}</p> : null}
        {onRetry ? (
          <Button variant="outline-warning" size="sm" onClick={onRetry} className="mt-3">
            Coba Lagi
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-card-border bg-card-bg p-6 text-center ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      {icon ? (
        <RenderIcon name={icon} className="h-12 w-12 mx-auto mb-4 text-muted" />
      ) : null}
      {title ? <div className="mb-2 font-semibold text-text-main">{title}</div> : null}
      {message ? <div className="text-muted">{message}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export { EmptyState };
export default EmptyState;