import { IconArrowLeft, IconLock } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="fixed top-8 right-8 z-10">
        <ThemeSwitcher />
      </div>
      <h1 className="text-9xl font-black text-muted-foreground/10 dark:text-muted-foreground/30">
        403
      </h1>
      <h2 className="-mt-12 text-3xl font-extrabold text-primary dark:text-muted-foreground">
        Access Forbidden
      </h2>
      <p className="text-center text-lg text-muted-foreground">
        You don&apos;t have permission to access this page.
      </p>
      <Button
        variant="outline"
        size="lg"
        className="mt-5 rounded-lg px-4"
        nativeButton={false}
        render={
          <Link to="/dashboard">
            <IconArrowLeft />
            <span>Back to dashboard</span>
          </Link>
        }
      />
    </div>
  )
}

export function ForbiddenInline() {
  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconLock />
        </EmptyMedia>
        <EmptyTitle>Access Forbidden</EmptyTitle>
        <EmptyDescription>
          You don't have permission to view this content. Please contact an
          administrator if you believe this is a mistake.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
