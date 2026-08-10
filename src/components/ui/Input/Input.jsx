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
}) {
  const sizeClass = size === 'lg' ? ' form-control-lg' : size === 'sm' ? ' form-control-sm' : '';
  return (
    <div className="mb-3">
      {label ? (
        <label className="form-label fw-semibold">
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <input
        className={`form-control${sizeClass}`}
        name={name}
        value={value}
        onChange={(e) => onChange?.(name, e.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}
