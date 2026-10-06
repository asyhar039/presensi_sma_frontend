import type {
  ILeaveRequestResult,
  IPresenceInformation,
} from '@/features/student-permits/types/permit.types'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AttachmentDropzone } from '@/features/student-permits/components/attachment-dropzone'
import { useEarlyOutMutation } from '@/features/student-permits/hooks/use-leave-request-mutations'
import {
  isTimeWithin,
  weekdayKeyOf,
} from '@/features/student-permits/lib/permit-datetime'
import {
  type EarlyOutValues,
  earlyOutSchema,
} from '@/features/student-permits/schemas/leave-request-schema'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'

type EarlyOutFormProps = {
  presence: IPresenceInformation
  onSuccess: (result: ILeaveRequestResult) => void
}

export function EarlyOutForm({ presence, onSuccess }: EarlyOutFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null)
  const mutation = useEarlyOutMutation()

  const todayWindow = useMemo(() => {
    const slot = presence.time[weekdayKeyOf(new Date())]
    return slot
      ? { start: slot.start_time.slice(0, 5), end: slot.end_time.slice(0, 5) }
      : null
  }, [presence])

  const form = useAppForm({
    defaultValues: {
      time_out: '',
      time_in: '',
      exit_reason: '',
      destination: '',
      contact_person: '',
      notes: '',
    } as EarlyOutValues,
    validators: { onChange: earlyOutSchema },
    onSubmit: async ({ value }) => {
      if (!todayWindow) {
        toast.error('Early leave is only available on school days.')
        return
      }
      if (!isTimeWithin(value.time_out, todayWindow.start, todayWindow.end)) {
        toast.error(
          `Leave time must be within school hours (${todayWindow.start}–${todayWindow.end}).`,
        )
        return
      }
      const formData = new FormData()
      formData.append('time_out', value.time_out)
      formData.append('time_in', value.time_in)
      formData.append('exit_reason', value.exit_reason)
      formData.append('destination', value.destination)
      if (value.contact_person)
        formData.append('contact_person', value.contact_person)
      if (value.notes) formData.append('notes', value.notes)
      if (attachment) formData.append('attachment', attachment)
      try {
        const result = await mutation.mutateAsync(formData)
        onSuccess(result)
        form.reset()
        setAttachment(null)
      } catch (error) {
        formErrorHandler(error, form, 'Failed to submit early leave request.')
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
          {!todayWindow ? (
            <Field>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                No school hours today, so early leave is unavailable.
              </div>
            </Field>
          ) : (
            <Field>
              <div className="rounded-lg border bg-muted/50 px-3 py-2.5 text-sm">
                Today&apos;s school hours:{' '}
                <strong>
                  {todayWindow.start} – {todayWindow.end}
                </strong>
                . Leave time must fall within this window.
              </div>
            </Field>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <form.AppField
              name="time_out"
              validators={{
                onChange: ({ value }) =>
                  value &&
                  todayWindow &&
                  !isTimeWithin(value, todayWindow.start, todayWindow.end)
                    ? `Must be between ${todayWindow.start} and ${todayWindow.end}.`
                    : undefined,
              }}
            >
              {(field) => (
                <field.FormField<string>
                  required
                  label="Leave Time"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      type="time"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="time_in">
              {(field) => (
                <field.FormField<string>
                  required
                  label="Return Time"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      type="time"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.AppField name="destination">
              {(field) => (
                <field.FormField<string>
                  required
                  label="Destination"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      maxLength={128}
                      placeholder="e.g. Clinic"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="contact_person">
              {(field) => (
                <field.FormField<string | undefined>
                  label="Contact Person"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      maxLength={64}
                      placeholder="Optional"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="exit_reason">
            {(field) => (
              <field.FormField<string>
                required
                label="Reason for Leaving"
                children={({ onChange, onBlur, ...props }) => (
                  <Textarea
                    rows={3}
                    maxLength={255}
                    placeholder="Why do you need to leave early?..."
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="notes">
            {(field) => (
              <field.FormField<string | undefined>
                label="Notes"
                children={({ onChange, onBlur, ...props }) => (
                  <Textarea
                    rows={2}
                    maxLength={255}
                    placeholder="Optional additional notes..."
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
              label="Submit Early Leave"
              loadingLabel="Submitting..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
