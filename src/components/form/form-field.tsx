import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { useFieldContext } from '@/hooks/use-form'

export type FormControlProps = {
  label: string
  description?: string
}

type FormFieldProps<T> = FormControlProps & {
  horizontal?: boolean
  className?: string
  children: (fieldArgs: {
    value: T
    onBlur: () => void
    onChange: (value: T) => void
    id: string
    name: string
    isInvalid?: boolean
  }) => React.ReactNode
}

function FormField<T>({
  children,
  label,
  description,
  horizontal,
  className,
}: FormFieldProps<T>) {
  const field = useFieldContext<T>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? 'horizontal' : undefined}
      className={className}
    >
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      {children({
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: field.handleChange,
        id: field.name,
        name: field.name,
        isInvalid: isInvalid || undefined,
      })}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export { FormField }
