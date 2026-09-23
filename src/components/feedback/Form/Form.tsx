import { useEffect, useState } from 'react'

import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import Select from '../../ui/Select/Select'

interface FormField {
  key: string
  label: string
  type?: string
  required?: boolean
  error?: string
  disabled?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface FormProps {
  fields?: FormField[]
  initialValues?: Record<string, unknown>
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  children?: React.ReactNode
}

const renderField = (
  field: FormField,
  value: unknown,
  onChange: (key: string, val: unknown) => void,
) => {
  const common = {
    key: field.key,
    label: field.label,
    name: field.key,
    value: (value as string) ?? '',
    onChange,
    required: field.required,
    error: field.error,
    disabled: field.disabled,
  }

  if (field.type === 'select') {
    return (
      <Select
        {...common}
        placeholder={field.placeholder || `-- Pilih ${field.label} --`}
        options={field.options || []}
      />
    )
  }

  return (
    <Input
      {...common}
      size="md"
      autoComplete="off"
      type={field.type || 'text'}
      placeholder={field.placeholder || ''}
    />
  )
}

const Form = ({
  fields = [],
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
  children,
}: FormProps) => {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const initialKey = JSON.stringify(initialValues ?? {})

  useEffect(() => {
    setValues(initialValues ?? {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey])

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  // If children are provided, treat this as a wrapper form (ScheduleList pattern)
  if (children) {
    return (
      <form onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key}>
            {renderField(field, values[field.key] ?? '', handleChange)}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button type="submit" variant="primary" size="md">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default Form
