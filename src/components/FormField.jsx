export function FormField({ label, name, value, onChange, type = 'text', placeholder, autoComplete }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        className="form-control form-control-lg"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
}
