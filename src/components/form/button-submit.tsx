import type { Button } from '@/components/ui/button'

import { shallow, useSelector } from '@tanstack/react-store'

import { ButtonLoading } from '@/components/composite/button-loading'
import { useFormContext } from '@/hooks/use-form'

export interface ButtonSubmitProps
  extends Pick<React.ComponentProps<typeof Button>, 'size' | 'variant'> {
  label?: string
  loadingLabel?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  isDisabled?: boolean
}

function ButtonSubmit({
  className,
  label,
  loadingLabel,
  type,
  size,
  variant,
  isDisabled,
}: ButtonSubmitProps) {
  const form = useFormContext()
  const [canSubmit, isSubmitting, isDirty] = useSelector(
    form.store,
    (s) => [s.canSubmit, s.isSubmitting, s.isDirty],
    {
      compare: shallow,
    },
  )

  return (
    <ButtonLoading
      loadingLabel={loadingLabel || 'Loading...'}
      loading={isSubmitting}
      type={type || 'submit'}
      size={size || 'lg'}
      variant={variant}
      className={className || 'w-full'}
      disabled={isDisabled || !canSubmit || !isDirty}
    >
      {label || 'Submit'}
    </ButtonLoading>
  )
}

export { ButtonSubmit }
