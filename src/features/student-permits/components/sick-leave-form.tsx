import type {
  ILeaveRequestResult,
  IPresenceInformation,
} from '@/features/student-permits/types/permit.types'

import { IconCalendar } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverPositioner,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { AttachmentDropzone } from '@/features/student-permits/components/attachment-dropzone'
import { useSickLeaveMutation } from '@/features/student-permits/hooks/use-leave-request-mutations'
import {
  countSchoolDays,
  isSchoolDay,
  toISODate,
} from '@/features/student-permits/lib/permit-datetime'
import {
  type SickLeaveValues,
  sickLeaveSchema,
} from '@/features/student-permits/schemas/leave-request-schema'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'

type SickLeaveFormProps = {
  presence: IPresenceInformation
  onSuccess: (result: ILeaveRequestResult) => void
}

const MAX_SPAN_DAYS = 7

function nextSelectableDates(): { min: string; max: string } {
  const today = new Date()
  const min = toISODate(today)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + (MAX_SPAN_DAYS - 1))
  return { min, max: toISODate(maxDate) }
}

export function SickLeaveForm({ presence, onSuccess }: SickLeaveFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null)
  const mutation = useSickLeaveMutation()
  const { min, max } = useMemo(() => nextSelectableDates(), [])
  const holidaySet = useMemo(
    () =>
      new Set(
        presence.public_holidays.map((holiday) => holiday.date.slice(0, 10)),
      ),
    [presence],
  )

  const form = useAppForm({
    defaultValues: {
      start_date: '',
      end_date: '',
      notes: '',
    } as SickLeaveValues,
    validators: { onChange: sickLeaveSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append('start_date', value.start_date)
      formData.append('end_date', value.end_date)
      if (value.notes) formData.append('notes', value.notes)
      if (attachment) formData.append('attachment', attachment)
      try {
        const result = await mutation.mutateAsync(formData)
        onSuccess(result)
        form.reset()
        setAttachment(null)
      } catch (error) {
        formErrorHandler(error, form, 'Failed to submit sick leave request.')
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
          <div className="grid gap-4 sm:grid-cols-2">
            <form.AppField
              name="start_date"
              validators={{
                onChangeListenTo: ['end_date'],
                onChange: ({ value, fieldApi }) => {
                  if (!value) return undefined
                  if (value < min) return 'Start date cannot be in the past.'
                  const end = fieldApi.form.getFieldValue('end_date') as string
                  if (end && value > end)
                    return 'Start date must be before end date.'
                  const start = new Date(`${value}T00:00:00`)
                  const stop = end ? new Date(`${end}T00:00:00`) : start
                  const span =
                    Math.round(
                      (stop.getTime() - start.getTime()) / 86_400_000,
                    ) + 1
                  if (span > MAX_SPAN_DAYS)
                    return `Maximum range is ${MAX_SPAN_DAYS} days.`
                  return undefined
                },
              }}
            >
              {(field) => (
                <field.FormField<string>
                  required
                  label="Start Date"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      type="date"
                      min={min}
                      max={max}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField
              name="end_date"
              validators={{
                onChangeListenTo: ['start_date'],
                onChange: ({ value, fieldApi }) => {
                  if (!value) return undefined
                  const start = fieldApi.form.getFieldValue(
                    'start_date',
                  ) as string
                  if (start && value < start)
                    return 'End date must be after start date.'
                  if (start) {
                    const span =
                      Math.round(
                        (new Date(`${value}T00:00:00`).getTime() -
                          new Date(`${start}T00:00:00`).getTime()) /
                          86_400_000,
                      ) + 1
                    if (span > MAX_SPAN_DAYS)
                      return `Maximum range is ${MAX_SPAN_DAYS} days.`
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <field.FormField<string>
                  required
                  label="End Date"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      type="date"
                      min={min}
                      max={max}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>

          <form.Subscribe
            selector={(state) =>
              [state.values.start_date, state.values.end_date] as const
            }
          >
            {([start, end]) => (
              <SchoolDaySummary
                start={start}
                end={end}
                presence={presence}
                holidaySet={holidaySet}
                min={min}
              />
            )}
          </form.Subscribe>

          <form.AppField name="notes">
            {(field) => (
              <field.FormField<string | undefined>
                label="Notes"
                children={({ onChange, onBlur, ...props }) => (
                  <Textarea
                    rows={3}
                    maxLength={255}
                    placeholder="Describe your condition (max 255 characters)..."
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>

          <AttachmentDropzone file={attachment} onChange={setAttachment} />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
                setAttachment(null)
              }}
            >
              Reset
            </Button>
            <form.ButtonSubmit
              label="Submit Sick Leave"
              loadingLabel="Submitting..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}

function SchoolDaySummary({
  start,
  end,
  presence,
  holidaySet,
  min,
}: {
  start: string
  end: string
  presence: IPresenceInformation
  holidaySet: Set<string>
  min: string
}) {
  if (!start || !end) return null
  const startDate = new Date(`${start}T00:00:00`)
  const endDate = new Date(`${end}T00:00:00`)
  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate < startDate
  )
    return null

  const dates: Date[] = []
  const cursor = new Date(startDate)
  while (cursor <= endDate) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  const schoolDays = countSchoolDays(
    dates,
    presence.time,
    presence.public_holidays,
  )
  const skipped = dates.filter(
    (date) => !isSchoolDay(date, presence.time, presence.public_holidays),
  )

  return (
    <Field>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm">
        <IconCalendar className="size-4 text-muted-foreground" />
        <span>
          <strong>{schoolDays}</strong> school day{schoolDays === 1 ? '' : 's'}{' '}
          counted
        </span>
        {skipped.length > 0 && (
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                />
              }
            >
              {skipped.length} day{skipped.length === 1 ? '' : 's'} excluded
            </PopoverTrigger>
            <PopoverPositioner>
              <PopoverContent className="w-64 text-xs">
                <p className="mb-1 font-medium">Excluded dates:</p>
                <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
                  {skipped.map((date) => {
                    const key = toISODate(date)
                    const holiday = presence.public_holidays.find(
                      (h) => h.date.slice(0, 10) === key,
                    )
                    return (
                      <li key={key}>
                        {key} —{' '}
                        {holiday
                          ? holiday.name
                          : key < min
                            ? 'past date'
                            : 'day off'}
                        {holidaySet.has(key) && !holiday
                          ? 'public holiday'
                          : ''}
                      </li>
                    )
                  })}
                </ul>
              </PopoverContent>
            </PopoverPositioner>
          </Popover>
        )}
      </div>
    </Field>
  )
}
