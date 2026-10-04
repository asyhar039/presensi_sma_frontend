import type { IClassroom } from '@/features/classrooms/types/classroom.types'

import { toast } from 'sonner'

import { ApiCombobox } from '@/components/composite/api-combobox'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useClassroomStore } from '@/features/classrooms/components/classroom-store'
import { useCreateClassroom } from '@/features/classrooms/hooks/use-create-classroom'
import { useUpdateClassroom } from '@/features/classrooms/hooks/use-update-classroom'
import {
  type IClassroomSchema,
  classroomSchema,
} from '@/features/classrooms/schemas/classroom-schema'
import {
  getAcademicYearDropdown,
  getAcademicYearDropdownSelected,
  getTeacherDropdown,
  getTeacherDropdownSelected,
} from '@/features/classrooms/services/classroom-dropdown-api'
import { useAppForm } from '@/hooks/use-form'
import { formErrorHandler } from '@/utils/error'

type ClassroomFormProps = { initial: IClassroom | null }

export function ClassroomForm({ initial }: ClassroomFormProps) {
  const closeDialog = useClassroomStore((state) => state.closeDialog)
  const createMutation = useCreateClassroom()
  const updateMutation = useUpdateClassroom(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      name: initial?.name ?? '',
      academic_year_id: initial?.academic_year
        ? String(initial.academic_year.value)
        : '',
      homeroom_teacher_id: initial?.homeroom_teacher
        ? String(initial.homeroom_teacher.id)
        : '',
    } as IClassroomSchema,
    validators: { onChange: classroomSchema },
    onSubmit: async ({ value }) => {
      try {
        const academicYearId = Number(value.academic_year_id)
        const homeroomTeacherId = value.homeroom_teacher_id
          ? Number(value.homeroom_teacher_id)
          : null
        if (!Number.isFinite(academicYearId) || academicYearId <= 0) {
          toast.error('Please select a valid academic year.')
          return
        }
        const payload = {
          name: value.name.trim(),
          academic_year_id: academicYearId,
          homeroom_teacher_id: homeroomTeacherId,
        }
        if (initial) {
          await updateMutation.mutateAsync({
            id: initial.id,
            payload,
          })
        } else {
          await createMutation.mutateAsync(payload)
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save classroom.')
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
                label="Classroom Name"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    type="text"
                    placeholder="e.g. XII IPA 1"
                    maxLength={64}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
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
          <form.AppField name="homeroom_teacher_id">
            {(field) => (
              <field.FormField<string>
                label="Homeroom Teacher"
                description="Optional. Leave empty when not assigned yet."
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
