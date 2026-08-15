const SIZES = {
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-3 py-1.5 text-base',
  lg: 'rounded-lg px-4 py-2 text-lg',
};

export function Input({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  size,
  required = false,
  error,
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClass = SIZES[size] || '';
  const id = props.id || (name ? `form-field-${name}` : undefined);
  const baseClass = `block w-full border bg-white text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
    error
      ? 'border-danger focus:border-danger focus:ring-danger/25'
      : 'border-[#dee2e6] focus:border-[#86b7fe] focus:ring-primary/25'
  }`;

  return (
    <div className="mb-4">
      {label ? (
        <label className="mb-2 block font-semibold" htmlFor={id}>
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <input
        id={id}
        className={`${baseClass} ${sizeClass} ${className}`.trim()}
        name={name}
        value={value}
        onChange={(e) => onChange?.(name, e.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && id ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-sm text-danger" id={id ? `${id}-error` : undefined}>{error}</div>
      ) : null}
    </div>
  );
}