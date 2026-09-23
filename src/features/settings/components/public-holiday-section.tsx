import type { IPublicHolidaySchema } from '@/features/settings/schemas/settings-schema'
import type { IPublicHoliday } from '@/features/settings/types/settings.types'

import {
  IconCalendarPlus,
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconRotateClockwise,
  IconTrash,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDeletePublicHoliday,
  usePublicHolidays,
  useSavePublicHolidays,
} from '@/features/settings/hooks/use-settings-holidays'
import { publicHolidaySchema } from '@/features/settings/schemas/settings-schema'
import { useAppForm } from '@/hooks/use-form'
import { cn } from '@/lib/class-name'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formErrorHandler } from '@/utils/error'

const WEEKDAY_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type DialogState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; date: string; originalDate: string }

function HolidayForm({
  state,
  existing,
  onDone,
}: {
  state: DialogState
  existing: IPublicHoliday[]
  onDone: () => void
}) {
  const saveMutation = useSavePublicHolidays()
  const initial: IPublicHolidaySchema =
    state.mode === 'edit'
      ? {
          name:
            existing.find((item) => item.date === state.originalDate)?.name ??
            '',
          date: state.date,
        }
      : { name: '', date: state.date }

  const form = useAppForm({
    defaultValues: initial,
    validators: { onChange: publicHolidaySchema },
    onSubmit: async ({ value }) => {
      try {
        const duplicate = existing.some(
          (item) =>
            item.date === value.date &&
            (state.mode === 'create' || item.date !== state.originalDate),
        )
        if (duplicate) {
          form.setFieldMeta('date', (previous) => ({
            ...previous,
            errorMap: {
              ...previous?.errorMap,
              onServer: 'Another holiday already uses this date.',
            },
          }))
          return
        }
        const next = [
          ...existing.filter((item) =>
            state.mode === 'edit'
              ? item.date !== state.originalDate && item.date !== value.date
              : item.date !== value.date,
          ),
          { name: value.name.trim(), date: value.date },
        ]
        await saveMutation.mutateAsync(next)
        onDone()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save public holiday.')
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        <FieldGroup>
          <form.AppField name="name">
            {(field) => (
              <field.FormField<string>
                label="Holiday name"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    placeholder="e.g. Hari Kemerdekaan"
                    maxLength={120}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="date">
            {(field) => (
              <field.FormField<string>
                label="Date"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    type="date"
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.ButtonSubmit
            label={state.mode === 'edit' ? 'Save changes' : 'Add holiday'}
          />
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}

function HolidayCalendar({
  holidaysByDate,
  onPick,
}: {
  holidaysByDate: Map<string, IPublicHoliday>
  onPick: (date: string, existing: IPublicHoliday | undefined) => void
}) {
  const [month, setMonth] = useState(() => dayjs())

  const cells = useMemo(() => {
    const startOfMonth = month.startOf('month')
    const leading = (startOfMonth.day() + 6) % 7
    const daysInMonth = month.daysInMonth()
    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) =>
        startOfMonth.add(index, 'day'),
      ),
    ]
  }, [month])

  const monthHolidays = useMemo(
    () =>
      [...holidaysByDate.values()]
        .filter((holiday) => dayjs(holiday.date).isSame(month, 'month'))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [holidaysByDate, month],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle>{month.format('MMMM YYYY')}</CardTitle>
            <CardDescription>
              {monthHolidays.length === 0
                ? 'No holidays this month.'
                : `${monthHolidays.length} holiday${monthHolidays.length > 1 ? 's' : ''} this month.`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous month"
              onClick={() =>
                setMonth((previous) => previous.subtract(1, 'month'))
              }
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMonth(dayjs())}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next month"
              onClick={() => setMonth((previous) => previous.add(1, 'month'))}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAY_HEADER.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) {
              return (
                <div key={`empty-${index}`} className="min-h-16 sm:min-h-20" />
              )
            }
            const key = date.format('YYYY-MM-DD')
            const holiday = holidaysByDate.get(key)
            const isToday = date.isSame(dayjs(), 'day')
            const isWeekend = date.day() === 0 || date.day() === 6
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPick(key, holiday)}
                aria-label={`${key}${holiday ? `, ${holiday.name}` : ''}`}
                className={cn(
                  'flex min-h-16 flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors sm:min-h-20 sm:p-2',
                  holiday
                    ? 'border-primary/40 bg-primary/5 hover:bg-primary/10'
                    : 'border-border bg-card hover:bg-muted/60',
                  isToday && 'ring-1 ring-primary',
                )}
              >
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full text-xs',
                    isToday
                      ? 'bg-primary font-semibold text-primary-foreground'
                      : isWeekend
                        ? 'font-medium text-destructive'
                        : 'text-muted-foreground',
                  )}
                >
                  {date.date()}
                </span>
                {holiday && (
                  <span className="line-clamp-2 w-full text-[11px] leading-tight font-medium">
                    {holiday.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function PublicHolidaySection() {
  const holidaysQuery = usePublicHolidays()
  const deleteMutation = useDeletePublicHoliday()
  const showConfirmation = useConfirmationStore((state) => state.show)
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const holidays = useMemo(
    () =>
      [...(holidaysQuery.data ?? [])].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    [holidaysQuery.data],
  )

  const holidaysByDate = useMemo(
    () => new Map(holidays.map((holiday) => [holiday.date, holiday])),
    [holidays],
  )

  const handleDelete = (holiday: IPublicHoliday) => {
    showConfirmation({
      title: 'Delete public holiday?',
      description: `"${holiday.name}" on ${dayjs(holiday.date).format('DD MMMM YYYY')} will be removed.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        try {
          loading(true)
          await deleteMutation.mutateAsync(holiday.date)
        } finally {
          loading(false)
          close()
        }
      },
    })
  }

  if (holidaysQuery.isPending) {
    return (
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-130 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  if (holidaysQuery.isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCalendarPlus />
          </EmptyMedia>
          <EmptyTitle>Failed to load holidays</EmptyTitle>
          <EmptyDescription>
            We could not load the public holidays. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => holidaysQuery.refetch()}>
          <IconRotateClockwise className="size-4" />
          Retry
        </Button>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          onClick={() =>
            setDialog({
              mode: 'create',
              date: dayjs().format('YYYY-MM-DD'),
            })
          }
        >
          <IconCalendarPlus className="size-4" />
          Add holiday
        </Button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_340px]">
        <HolidayCalendar
          holidaysByDate={holidaysByDate}
          onPick={(date, existing) =>
            setDialog(
              existing
                ? { mode: 'edit', date, originalDate: existing.date }
                : { mode: 'create', date },
            )
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All holidays</CardTitle>
            <CardDescription>
              {holidays.length === 0
                ? 'No public holidays yet.'
                : `${holidays.length} holiday${holidays.length > 1 ? 's' : ''} scheduled.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {holidays.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pick a date on the calendar or use the button above to add the
                first holiday.
              </p>
            ) : (
              holidays.map((holiday) => (
                <div
                  key={holiday.date}
                  className="flex items-center gap-2 rounded-lg border border-border p-2.5"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">
                      {holiday.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dayjs(holiday.date).format('DD MMMM YYYY')}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="hidden shrink-0 xl:inline-flex"
                  >
                    {dayjs(holiday.date).format('YYYY')}
                  </Badge>
                  <div className="flex shrink-0 items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${holiday.name}`}
                      onClick={() =>
                        setDialog({
                          mode: 'edit',
                          date: holiday.date,
                          originalDate: holiday.date,
                        })
                      }
                    >
                      <IconPencil className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${holiday.name}`}
                      onClick={() => handleDelete(holiday)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <ResponsiveDialog
        title={
          dialog?.mode === 'edit' ? 'Edit public holiday' : 'Add public holiday'
        }
        description={
          dialog?.mode === 'edit'
            ? 'Update the name or date of this public holiday.'
            : 'Pick a date on the calendar or enter the details below.'
        }
        isOpen={dialog !== null}
        onIsOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        {dialog && (
          <HolidayForm
            key={`${dialog.mode}-${dialog.mode === 'edit' ? dialog.originalDate : dialog.date}`}
            state={dialog}
            existing={holidays}
            onDone={() => setDialog(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  )
}
