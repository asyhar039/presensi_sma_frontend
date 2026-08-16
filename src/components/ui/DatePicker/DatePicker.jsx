import { Input } from '../Input/Input';

export function DatePicker({
  mode = 'date',
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  min,
  max,
  className = '',
  ...props
}) {
  return (
    <Input
      type={mode === 'month' ? 'month' : 'date'}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      disabled={disabled}
      min={min}
      max={max}
      className={className}
      {...props}
    />
  );
}