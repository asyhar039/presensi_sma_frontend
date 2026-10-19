import { Link, createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { useAuth } from '@/context/auth-context'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="flex h-full min-h-svh w-full flex-col items-center justify-center gap-6 p-6">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <Typography as="h1" variant="h1">
        {t('landing.welcome')}
      </Typography>
      <Typography as="p" variant="lead" className="text-center max-w-lg">
        {t('landing.description')}
      </Typography>
      {user ? (
        <Button
          className="px-4"
          render={<Link to="/dashboard" />}
          nativeButton={false}
        >
          {t('landing.goToDashboard')}
        </Button>
      ) : (
        <Button
          className="px-4"
          render={<Link to="/login" />}
          nativeButton={false}
        >
          {t('landing.signIn')}
        </Button>
      )}
    </div>
  )
}
