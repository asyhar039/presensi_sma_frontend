export function Button({
  variant = 'primary',
  size = 'sm',
  icon,
  children,
  className = '',
  ...props
}) {
  return (
    <button type="button" className={`btn btn-${size} btn-${variant} ${className}`.trim()} {...props}>
      {icon ? <i className={`fas fa-${icon} me-1`}></i> : null}
      {children}
    </button>
  );
}
