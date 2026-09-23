import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  value?: string
  onChange?: (name: string, value: string) => void
  error?: string
  helperText?: string
}

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
  id,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputId =
    (id as string | undefined) || (name ? `form-field-${name}` : undefined)

  const baseClass = `block w-full border bg-white py-2 pr-10 pl-3 text-base text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
    error
      ? 'border-danger focus:border-danger focus:ring-danger/25'
      : 'border-[#dee2e6] focus:border-[#86b7fe] focus:ring-primary/25'
  }`

  return (
    <div className="mb-4">
      {label ? (
        <label className="mb-2 block font-semibold" htmlFor={inputId}>
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`${baseClass} rounded-md ${className}`.trim()}
          name={name}
          value={value}
          onChange={(e) => onChange?.(name || '', e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={
            showPassword ? 'Sembunyikan password' : 'Tampilkan password'
          }
          tabIndex={-1}
        >
          {showPassword ? (
            <IconEyeOff className="h-5 w-5" />
          ) : (
            <IconEye className="h-5 w-5" />
          )}
        </button>
      </div>
      {helperText && !error ? (
        <div className="mt-1 text-xs text-slate-500">{helperText}</div>
      ) : null}
      {error ? (
        <div
          className="mt-1 text-sm text-danger"
          id={inputId ? `${inputId}-error` : undefined}
        >
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default PasswordInput
