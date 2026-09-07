import type * as React from 'react'

import { IconLoader2 } from '@tabler/icons-react'

import { cn } from '@/lib/class-name'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <IconLoader2
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
