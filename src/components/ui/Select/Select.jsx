import RenderIcon from '../../../utils/iconMap';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Pilih --',
  required = false,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const id = props.id || (name ? `form-field-${name}` : undefined);
  const baseClass = `block w-full appearance-none border bg-white py-1.5 pr-10 pl-3 text-base text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
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
      <div className="relative">
        <select
          id={id}
          className={`${baseClass} rounded-md ${className}`.trim()}
          name={name}
          value={value}
          onChange={(e) => onChange?.(name, e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <RenderIcon name="chevron-down" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-secondary" />
      </div>
      {error ? (
        <div className="mt-1 text-sm text-danger" id={id ? `${id}-error` : undefined}>{error}</div>
      ) : null}
    </div>
  );
};

export default Select;