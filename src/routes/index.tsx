import { Link, createFileRoute } from '@tanstack/react-router'

import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { useAuth } from '@/context/auth-context'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  return (
    <div className="flex h-full min-h-svh w-full flex-col items-center justify-center gap-6 p-6">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <Typography as="h1" variant="h1">
        Welcome to the Attendance Apps
      </Typography>
      <Typography as="p" variant="lead" className="text-center">
        This is a simple attendance application that allows you to manage your
        attendance easily and efficiently.
      </Typography>
      {user ? (
        <Button
          className="px-4"
          render={<Link to="/dashboard" />}
          nativeButton={false}
        >
          Go to Dashboard
        </Button>
      ) : (
        <Button
          className="px-4"
          render={<Link to="/login" />}
          nativeButton={false}
        >
          Sign in
        </Button>
      )}
    </div>
  )
}
