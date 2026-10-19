import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function BackButton() {
  const { t } = useTranslation()

  return (
    <Button
      aria-label={t('errors.backToHome')}
      render={<Link to="/" />}
      nativeButton={false}
      className="px-4"
      variant="ghost"
    >
      <IconArrowLeft stroke={2} />
      <span>{t('common.back')}</span>
    </Button>
  )
}
