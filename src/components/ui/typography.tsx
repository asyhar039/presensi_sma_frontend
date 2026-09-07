import type { ComponentProps, ElementType, ReactNode } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/class-name'

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      lead: 'text-muted-foreground text-lg leading-relaxed',
      body: 'text-base leading-6',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-muted-foreground text-sm',
      code: 'bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>

type TypographyProps<T extends ElementType> = {
  as?: T
  className?: string
  children?: ReactNode
} & Omit<ComponentProps<T>, 'as' | 'className' | 'children'> &
  VariantProps<typeof typographyVariants>

const defaultElementMap: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  lead: 'p',
  body: 'p',
  muted: 'p',
  small: 'div',
  large: 'div',
  code: 'code',
}

function defaultElementFor(variant: TypographyVariant): ElementType {
  return defaultElementMap[variant] ?? 'p'
}

function Typography<T extends ElementType = 'p'>({
  as,
  className,
  variant,
  children,
  ...props
}: TypographyProps<T>) {
  const resolvedVariant: TypographyVariant = variant ?? 'body'
  const Component = (as ?? defaultElementFor(resolvedVariant)) as ElementType

  return (
    <Component
      data-slot="typography"
      className={cn(
        typographyVariants({ variant: resolvedVariant }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export { Typography, typographyVariants }
