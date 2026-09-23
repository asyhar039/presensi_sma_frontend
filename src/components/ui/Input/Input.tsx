const SIZES: Record<string, string> = {
  sm: 'rounded px-2.5 py-1.5 text-sm',
  md: 'rounded-md px-3.5 py-2 text-base',
  lg: 'rounded-lg px-4 py-2.5 text-lg',
}

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  label?: string
  value?: string
  onChange?: (name: string, value: string) => void
  onBlur?: () => void
  size?: string
  error?: string
}

const Input = ({
  label,
  name,
  value,
  onChange,
  onBlur: _onBlur,
  type = 'text',
  placeholder,
  autoComplete,
  size,
  required = false,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}: InputProps) => {
  void _onBlur
  const sizeClass = (size ? SIZES[size] : '') || ''
  const inputId =
    (id as string | undefined) || (name ? `form-field-${name}` : undefined)
  const baseClass = `block w-full border bg-white text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
    error
      ? 'border-danger focus:border-danger focus:ring-danger/25'
      : 'border-[#dee2e6] focus:border-[#86b7fe] focus:ring-primary/25'
  }`

  return (
    <div className={label ? 'mb-4' : ''}>
      {label ? (
        <label className="mb-2 block font-semibold" htmlFor={inputId}>
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${baseClass} ${sizeClass} ${className}`.trim()}
        name={name}
        value={value}
        onChange={(e) => onChange?.(name || '', e.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
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

export default Input
