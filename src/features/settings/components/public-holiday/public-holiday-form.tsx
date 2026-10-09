import type { PublicHolidayDialogState } from '@/features/settings/components/public-holiday/public-holiday-dialog'
import type { IPublicHolidaySchema } from '@/features/settings/schemas/public-holiday.schema'
import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  findDuplicateDate,
  getSubmitLabel,
} from '@/features/settings/components/public-holiday/public-holiday-helpers'
import { useCreatePublicHoliday } from '@/features/settings/hooks/use-create-public-holiday'
import { useUpdatePublicHoliday } from '@/features/settings/hooks/use-update-public-holiday'
import { publicHolidaySchema } from '@/features/settings/schemas/public-holiday.schema'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler, setFormErrors } from '@/utils/error'

export interface IPublicHolidayFormProps {
  dialog: PublicHolidayDialogState
  existing: IPublicHoliday[]
  onDone: () => void
}

function resolveInitialValues(
  dialog: PublicHolidayDialogState,
): IPublicHolidaySchema {
  if (dialog.mode === 'edit') {
    return { name: dialog.holiday.name, date: dialog.holiday.date }
  }
  return { name: '', date: dialog.date }
}

function resolveExcludeId(
  dialog: PublicHolidayDialogState,
): number | undefined {
  if (dialog.mode === 'edit') {
    return dialog.holiday.id
  }
  return undefined
}

export function PublicHolidayForm({
  dialog,
  existing,
  onDone,
}: IPublicHolidayFormProps) {
  const createMutation = useCreatePublicHoliday()
  const updateMutation = useUpdatePublicHoliday()

  const form = useAppForm({
    defaultValues: resolveInitialValues(dialog),
    validators: { onChange: publicHolidaySchema },
    onSubmit: async ({ value }) => {
      try {
        const excludeId = resolveExcludeId(dialog)
        const isDuplicate = findDuplicateDate(existing, value.date, excludeId)
        if (isDuplicate) {
          setFormErrors(form, {
            date: ['Another holiday already uses this date.'],
          })
          return
        }
        if (dialog.mode === 'edit') {
          await updateMutation.mutateAsync({
            id: dialog.holiday.id,
            payload: { name: value.name.trim(), date: value.date },
          })
        }
        if (dialog.mode === 'create') {
          await createMutation.mutateAsync({
            name: value.name.trim(),
            date: value.date,
          })
        }
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
          <form.ButtonSubmit label={getSubmitLabel(dialog.mode)} />
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
