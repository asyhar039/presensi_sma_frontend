import { useTranslation } from 'react-i18next'

import { ScheduleClockSection } from '@/features/settings/components/schedule-clock-section'

export function ScheduleClockView() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {t('settings.scheduleClockDesc')}
      </p>
      <ScheduleClockSection />
    </div>
  )
}
