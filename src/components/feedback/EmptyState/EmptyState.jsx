export function EmptyState({ icon, title, message = 'Belum ada data', action, className = '' }) {
  return (
    <div className={`text-muted ${className}`.trim()}>
      {icon ? <i className={`fas fa-${icon} mr-1`}></i> : null}
      {title ? <div className="font-semibold">{title}</div> : null}
      {message ? <div>{message}</div> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}