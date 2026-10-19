import { IconArrowLeft, IconLock } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
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
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="fixed top-8 right-8 z-10 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <h1 className="text-9xl font-black text-muted-foreground/10 dark:text-muted-foreground/30">
        403
      </h1>
      <h2 className="-mt-12 text-3xl font-extrabold text-primary dark:text-muted-foreground">
        {t('errors.forbidden')}
      </h2>
      <p className="text-center text-lg text-muted-foreground">
        {t('errors.forbiddenDescription')}
      </p>
      <Button
        variant="outline"
        size="lg"
        className="mt-5 rounded-lg px-4"
        nativeButton={false}
        render={
          <Link to="/dashboard">
            <IconArrowLeft />
            <span>{t('errors.backToDashboard')}</span>
          </Link>
        }
      />
    </div>
  )
}

export function ForbiddenInline() {
  const { t } = useTranslation()

  return (
    <Empty className="border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconLock />
        </EmptyMedia>
        <EmptyTitle>{t('errors.forbidden')}</EmptyTitle>
        <EmptyDescription>{t('errors.forbiddenDescription')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
