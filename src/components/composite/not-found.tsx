import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="fixed top-8 right-8 z-10 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <h1 className="text-muted-foreground/10 dark:text-muted-foreground/30 text-9xl font-black">
        404
      </h1>
      <h2 className="text-primary dark:text-muted-foreground -mt-12 text-3xl font-extrabold">
        {t('errors.notFound')}
      </h2>
      <p className="text-muted-foreground text-center text-lg">
        {t('errors.notFoundDescription')}
      </p>
      <Button
        variant="outline"
        size="lg"
        className="mt-5 rounded-lg px-4"
        nativeButton={false}
        render={
          <Link to="/">
            <IconArrowLeft />
            <span>{t('errors.backToHome')}</span>
          </Link>
        }
      />
    </div>
  )
}
