import { RenderIcon } from '../../../utils/iconMap'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  value?: string
  onChange?: (name: string, value: string) => void
  onBlur?: () => void
  options?: SelectOption[]
  error?: string
  placeholder?: string
}

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur: _onBlur,
  options = [],
  placeholder = '-- Pilih --',
  required = false,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}: SelectProps) => {
  void _onBlur
  const selectId =
    (id as string | undefined) || (name ? `form-field-${name}` : undefined)
  const baseClass = `block w-full appearance-none border bg-white py-2 pr-10 pl-3 text-base text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 disabled:bg-input-bg ${
    error
      ? 'border-danger focus:border-danger focus:ring-danger/25'
      : 'border-[#dee2e6] focus:border-[#86b7fe] focus:ring-primary/25'
  }`

  return (
    <div className="mb-4">
      {label ? (
        <label className="mb-2 block font-semibold" htmlFor={selectId}>
          {label}
          {required ? ' *' : ''}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          className={`${baseClass} rounded-md ${className}`.trim()}
          name={name}
          value={value}
          onChange={(e) => onChange?.(name || '', e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && selectId ? `${selectId}-error` : undefined}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt: SelectOption) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <RenderIcon
          name="chevron-down"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 h-5 w-5 text-secondary"
        />
      </div>
      {error ? (
        <div
          className="mt-1 text-sm text-danger"
          id={selectId ? `${selectId}-error` : undefined}
        >
          {error}
        </div>
      ) : null}
    </div>
  )
}

export default Select
