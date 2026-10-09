import type { PublicHolidayDialogState } from '@/features/settings/components/public-holiday/public-holiday-dialog'
import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import { IconCalendarPlus } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { PublicHolidayCalendar } from '@/features/settings/components/public-holiday/public-holiday-calendar'
import { PublicHolidayDialog } from '@/features/settings/components/public-holiday/public-holiday-dialog'
import {
  buildHolidaysByDate,
  formatDisplayDate,
  sortHolidaysByDate,
  toMonthParam,
  toTodayKey,
} from '@/features/settings/components/public-holiday/public-holiday-helpers'
import { PublicHolidayList } from '@/features/settings/components/public-holiday/public-holiday-list'
import { PublicHolidayErrorState } from '@/features/settings/components/public-holiday/public-holiday-state'
import { useDeletePublicHoliday } from '@/features/settings/hooks/use-delete-public-holiday'
import { usePublicHolidays } from '@/features/settings/hooks/use-public-holidays'
import { useConfirmationStore } from '@/stores/confirmation-store'

export function PublicHolidaySection() {
  const [month, setMonth] = useState(() => dayjs())
  const [dialog, setDialog] = useState<PublicHolidayDialogState | null>(null)

  const monthParam = toMonthParam(month)
  const holidaysQuery = usePublicHolidays(monthParam)
  const deleteMutation = useDeletePublicHoliday()
  const showConfirmation = useConfirmationStore((state) => state.show)

  const holidays = useMemo(
    () => sortHolidaysByDate(holidaysQuery.data ?? []),
    [holidaysQuery.data],
  )

  const holidaysByDate = useMemo(
    () => buildHolidaysByDate(holidays),
    [holidays],
  )

  const hasData = holidaysQuery.data !== undefined
  const isCalendarLoading = holidaysQuery.isFetching
  const isListLoading = holidaysQuery.isPending || holidaysQuery.isFetching

  const handleAddHoliday = () => {
    setDialog({ mode: 'create', date: toTodayKey() })
  }

  const handlePickDate = (
    date: string,
    existing: IPublicHoliday | undefined,
  ) => {
    if (existing) {
      setDialog({ mode: 'edit', holiday: existing })
      return
    }
    setDialog({ mode: 'create', date })
  }

  const handleEdit = (holiday: IPublicHoliday) => {
    setDialog({ mode: 'edit', holiday })
  }

  const handleDelete = (holiday: IPublicHoliday) => {
    showConfirmation({
      title: 'Delete public holiday?',
      description: `"${holiday.name}" on ${formatDisplayDate(holiday.date)} will be removed.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        try {
          loading(true)
          await deleteMutation.mutateAsync(holiday.id)
        } finally {
          loading(false)
          close()
        }
      },
    })
  }

  const handleCloseDialog = () => {
    setDialog(null)
  }

  const handleRetry = () => {
    holidaysQuery.refetch()
  }

  if (holidaysQuery.isError && !hasData) {
    return <PublicHolidayErrorState onRetry={handleRetry} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button onClick={handleAddHoliday} className="w-full sm:w-auto">
          <IconCalendarPlus className="size-4" />
          Add holiday
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_420px]">
        <PublicHolidayCalendar
          month={month}
          holidaysByDate={holidaysByDate}
          monthHolidayCount={holidays.length}
          isLoading={isCalendarLoading}
          onMonthChange={setMonth}
          onPickDate={handlePickDate}
        />
        <PublicHolidayList
          holidays={holidays}
          isLoading={isListLoading && !hasData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <PublicHolidayDialog
        dialog={dialog}
        existing={holidays}
        onClose={handleCloseDialog}
        onDone={handleCloseDialog}
      />
    </div>
  )
}
