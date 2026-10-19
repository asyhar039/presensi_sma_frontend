import { useTranslation } from 'react-i18next'

import { SchoolZoneSection } from '@/features/settings/components/school-zone-section/school-zone-section'

export function SchoolZoneView() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {t('settings.schoolZonesDesc')}
      </p>
      <SchoolZoneSection />
    </div>
  )
}
