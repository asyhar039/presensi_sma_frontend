import { useNavigate, useRouterState } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Route } from '@/routes/_auth/login'

import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { BackButton } from '@/features/auth/components/back-button'
import { Login } from '@/features/auth/components/login'
import { getAuthErrorMessage } from '@/features/auth/lib/error-codes'
import { useOnce } from '@/hooks/use-once'

export function LoginView() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const redirectTo = useRouterState({
    select: (state) => state.location.state.redirectTo,
  })

  useOnce(() => {
    const errorCode = search.error_code
    if (errorCode) {
      toast.error(getAuthErrorMessage(errorCode))
      void navigate({
        replace: true,
        state: {
          redirectTo,
        },
      })
    }
  })

  return (
    <main className="flex min-h-svh w-full flex-col lg:flex-row bg-background">
      <div className="relative flex h-screen flex-1 items-center justify-center">
        <div className="absolute top-0 p-6 flex items-center justify-between gap-4 w-full">
          <BackButton />
          <ThemeSwitcher />
        </div>
        <Login />
      </div>
    </main>
  )
}
