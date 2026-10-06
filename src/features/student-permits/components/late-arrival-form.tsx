import type {
  ILeaveRequestResult,
  IPresenceInformation,
} from '@/features/student-permits/types/permit.types'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AttachmentDropzone } from '@/features/student-permits/components/attachment-dropzone'
import { useLateArrivalMutation } from '@/features/student-permits/hooks/use-leave-request-mutations'
import { weekdayKeyOf } from '@/features/student-permits/lib/permit-datetime'
import {
  type LateArrivalValues,
  lateArrivalSchema,
} from '@/features/student-permits/schemas/leave-request-schema'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'

type LateArrivalFormProps = {
  presence: IPresenceInformation
  onSuccess: (result: ILeaveRequestResult) => void
}

export function LateArrivalForm({ presence, onSuccess }: LateArrivalFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null)
  const mutation = useLateArrivalMutation()

  const schoolStart = useMemo(() => {
    const slot = presence.time[weekdayKeyOf(new Date())]
    return slot ? slot.start_time.slice(0, 5) : null
  }, [presence])

  const form = useAppForm({
    defaultValues: {
      estimated_arrival_time: '',
      late_reason: '',
      notes: '',
    } as LateArrivalValues,
    validators: { onChange: lateArrivalSchema },
    onSubmit: async ({ value }) => {
      if (!schoolStart) {
        toast.error('Late arrival requests are only available on school days.')
        return
      }
      if (value.estimated_arrival_time <= schoolStart) {
        toast.error(
          `Estimated arrival must be after school starts (${schoolStart}).`,
        )
        return
      }
      const formData = new FormData()
      formData.append('estimated_arrival_time', value.estimated_arrival_time)
      formData.append('late_reason', value.late_reason)
      if (value.notes) formData.append('notes', value.notes)
      if (attachment) formData.append('attachment', attachment)
      try {
        const result = await mutation.mutateAsync(formData)
        onSuccess(result)
        form.reset()
        setAttachment(null)
      } catch (error) {
        formErrorHandler(error, form, 'Failed to submit late arrival request.')
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
          <Field>
            <div className="rounded-lg border bg-muted/50 px-3 py-2.5 text-sm">
              {schoolStart ? (
                <>
                  School starts at <strong>{schoolStart}</strong> today. Your
                  estimated arrival must be later than that.
                </>
              ) : (
                'No school hours today, so late arrival requests are unavailable.'
              )}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <Label className="text-sm font-medium" htmlFor="school-start">
                School Start Time
              </Label>
              <Input
                id="school-start"
                value={schoolStart ?? '-'}
                disabled
                className="bg-muted"
              />
            </Field>
            <form.AppField
              name="estimated_arrival_time"
              validators={{
                onChange: ({ value }) =>
                  value && schoolStart && value <= schoolStart
                    ? `Must be later than ${schoolStart}.`
                    : undefined,
              }}
            >
              {(field) => (
                <field.FormField<string>
                  required
                  label="Estimated Arrival"
                  children={({ onChange, onBlur, ...props }) => (
                    <Input
                      type="time"
                      min={schoolStart ?? undefined}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="late_reason">
            {(field) => (
              <field.FormField<string>
                required
                label="Reason for Being Late"
                children={({ onChange, onBlur, ...props }) => (
                  <Textarea
                    rows={3}
                    maxLength={255}
                    placeholder="Explain why you will arrive late..."
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
              label="Submit Late Arrival"
              loadingLabel="Submitting..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
