import type { IDutyAssignment } from '@/features/duty-teacher/assignments/types'

import { toast } from 'sonner'

import { ApiCombobox } from '@/components/composite/api-combobox'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getAcademicYearDropdown,
  getAcademicYearDropdownSelected,
  getTeacherDropdown,
  getTeacherDropdownSelected,
} from '@/features/classrooms/services/classroom-dropdown-api'
import {
  useCreateDutyAssignment,
  useUpdateDutyAssignment,
} from '@/features/duty-teacher/assignments/hooks'
import {
  DUTY_DAY_OPTIONS,
  type IDutyAssignmentSchema,
  dutyAssignmentSchema,
} from '@/features/duty-teacher/assignments/schema'
import { useDutyAssignmentStore } from '@/features/duty-teacher/assignments/store'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'

type DutyAssignmentFormProps = { initial: IDutyAssignment | null }

export function DutyAssignmentForm({ initial }: DutyAssignmentFormProps) {
  const closeDialog = useDutyAssignmentStore((state) => state.closeDialog)
  const createMutation = useCreateDutyAssignment()
  const updateMutation = useUpdateDutyAssignment(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      academic_year_id: initial ? String(initial.academic_year.id) : '',
      teacher_id: initial ? String(initial.teacher.id) : '',
      day: (initial?.day.toLowerCase() ?? '') as IDutyAssignmentSchema['day'],
      start_time: initial?.start_time.slice(0, 5) ?? '',
      end_time: initial?.end_time.slice(0, 5) ?? '',
    } as IDutyAssignmentSchema,
    validators: { onChange: dutyAssignmentSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          academic_year_id: Number(value.academic_year_id),
          teacher_id: Number(value.teacher_id),
          day: value.day,
          start_time: value.start_time,
          end_time: value.end_time,
        }
        if (
          !Number.isFinite(payload.academic_year_id) ||
          !Number.isFinite(payload.teacher_id)
        ) {
          toast.error('Please select an academic year and a teacher.')
          return
        }
        if (initial) {
          await updateMutation.mutateAsync({ id: initial.id, payload })
        } else {
          await createMutation.mutateAsync(payload)
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save duty teacher.')
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
          <form.AppField name="academic_year_id">
            {(field) => (
              <field.FormField<string>
                label="Academic Year"
                children={({ value, onChange }) => (
                  <ApiCombobox
                    queryKey="academic-year-dropdown"
                    queryFn={getAcademicYearDropdown}
                    selectedQueryFn={getAcademicYearDropdownSelected}
                    placeholder="Search academic year..."
                    value={value || undefined}
                    onValueChange={(val) => onChange(val ?? '')}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="teacher_id">
            {(field) => (
              <field.FormField<string>
                label="Teacher"
                children={({ value, onChange }) => (
                  <ApiCombobox
                    queryKey="teacher-dropdown"
                    queryFn={getTeacherDropdown}
                    selectedQueryFn={getTeacherDropdownSelected}
                    placeholder="Search teacher..."
                    value={value || undefined}
                    onValueChange={(val) => onChange(val ?? '')}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="day">
            {(field) => (
              <field.FormField<string>
                label="Day"
                children={({ value, onChange }) => (
                  <Select
                    items={DUTY_DAY_OPTIONS}
                    value={value}
                    onValueChange={(next) =>
                      onChange(next as IDutyAssignmentSchema['day'])
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DUTY_DAY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </form.AppField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="start_time">
              {(field) => (
                <field.FormField<string>
                  label="Start Time"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="time"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="end_time">
              {(field) => (
                <field.FormField<string>
                  label="End Time"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="time"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <form.ButtonSubmit
              label={initial ? 'Save changes' : 'Create'}
              loadingLabel="Saving..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
