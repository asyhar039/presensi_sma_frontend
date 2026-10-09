import { Logo } from '@/components/composite/logo'
import { Typography } from '@/components/ui/typography'
import { LoginForm } from '@/features/auth/components/login-form'

export function Login() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8 border p-10 rounded-xl shadow-xl bg-card">
      <div className="flex flex-col items-center text-center gap-2">
        <Logo />
        <Typography variant="h1" className="text-3xl lg:text-4xl">
          Welcome back!
        </Typography>
        <Typography variant="body" as="p" className="text-muted-foreground">
          Sign in to your Attendance Apps account to continue.
        </Typography>
      </div>
      <LoginForm />
    </div>
  )
}
