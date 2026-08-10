export function Card({ title, icon, children, className = 'card-custom' }) {
  return (
    <div className={className}>
      {title ? (
        <h5 className="fw-bold mb-3">
          {icon ? <i className={`fas fa-${icon} text-primary me-2`}></i> : null}
          {title}
        </h5>
      ) : null}
      {children}
    </div>
  );
}
