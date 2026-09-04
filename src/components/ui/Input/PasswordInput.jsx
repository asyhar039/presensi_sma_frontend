import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Masukkan password',
  required = false,
  error,
  disabled = false,
  className = '',
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = props.id || (name ? `form-field-${name}` : undefined);

  const baseClass = `block w-full border bg-white py-2 pr-10 pl-3 text-base text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
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
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`${baseClass} rounded-md ${className}`.trim()}
          name={name}
          value={value}
          onChange={(e) => onChange?.(name, e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {helperText && !error ? (
        <div className="mt-1 text-xs text-slate-500">{helperText}</div>
      ) : null}
      {error ? (
        <div className="mt-1 text-sm text-danger" id={id ? `${id}-error` : undefined}>{error}</div>
      ) : null}
    </div>
  );
};

export default PasswordInput;
