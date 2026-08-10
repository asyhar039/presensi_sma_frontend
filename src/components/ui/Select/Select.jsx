export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- Pilih --',
  required = false,
}) {
  return (
    <div className="mb-3">
      {label ? (
        <label className="form-label fw-semibold">
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={(e) => onChange?.(name, e.target.value)}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
