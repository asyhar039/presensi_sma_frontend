import type * as React from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface ButtonLoadingProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    'children' | 'nativeButton' | 'render'
  > {
  loading?: boolean
  loadingLabel?: React.ReactNode
  children?: React.ReactNode
  spinnerClassName?: string
}

function ButtonLoading({
  loading = false,
  loadingLabel,
  disabled,
  children,
  type,
  spinnerClassName,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button
      nativeButton={true}
      disabled={loading || disabled}
      type={type ?? 'button'}
      {...props}
    >
      {loading && <Spinner className={spinnerClassName} />}
      {loading ? (loadingLabel ?? children) : children}
    </Button>
  )
}

export { ButtonLoading }
