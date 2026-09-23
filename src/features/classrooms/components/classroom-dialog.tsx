import type { IClassroom } from '@/features/classrooms/types/classroom.types'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
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
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { academicYearsQueryOptions } from '@/features/academic-years/lib/academic-year-query-options'
import { useClassroomStore } from '@/features/classrooms/components/classroom-store'
import { useClassroomDetail } from '@/features/classrooms/hooks/use-classroom-detail'
import { useCreateClassroom } from '@/features/classrooms/hooks/use-create-classroom'
import { useUpdateClassroom } from '@/features/classrooms/hooks/use-update-classroom'
import {
  type IClassroomSchema,
  classroomSchema,
} from '@/features/classrooms/schemas/classroom-schema'
import { teachersQueryOptions } from '@/features/teachers/lib/teacher-query-options'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

const NO_TEACHER_VALUE = 'none'

function useAcademicYearOptions() {
  const query = useQuery(academicYearsQueryOptions({ page: 1, per_page: 50 }))
  const options = (query.data?.items ?? []).map((item) => ({
    label: `${formatAcademicLabel(item)} (${item.semester})`,
    value: String(item.id),
  }))
  return { ...query, options }
}

function useTeacherOptions() {
  const query = useQuery(teachersQueryOptions({ page: 1, per_page: 50 }))
  const options = (query.data?.items ?? []).map((item) => ({
    label: `${item.user.name} (${item.user.identity_number})`,
    value: String(item.user.id),
  }))
  return { ...query, options }
}

function ClassroomForm({ initial }: { initial: IClassroom | null }) {
  const closeDialog = useClassroomStore((state) => state.closeDialog)
  const createMutation = useCreateClassroom()
  const updateMutation = useUpdateClassroom(initial?.id ?? null)
  const academicYears = useAcademicYearOptions()
  const teachers = useTeacherOptions()

  const form = useAppForm({
    defaultValues: {
      name: initial?.name ?? '',
      academic_year_id: initial?.academic_year
        ? String(initial.academic_year.id)
        : '',
      homeroom_teacher_id: initial?.user
        ? String(initial.user.id)
        : NO_TEACHER_VALUE,
    } as IClassroomSchema,
    validators: { onChange: classroomSchema },
    onSubmit: async ({ value }) => {
      try {
        const academicYearId = Number(value.academic_year_id)
        const homeroomTeacherId =
          !value.homeroom_teacher_id ||
          value.homeroom_teacher_id === NO_TEACHER_VALUE
            ? null
            : Number(value.homeroom_teacher_id)
        if (!Number.isFinite(academicYearId) || academicYearId <= 0) {
          toast.error('Please select a valid academic year.')
          return
        }
        if (
          homeroomTeacherId !== null &&
          (!Number.isFinite(homeroomTeacherId) || homeroomTeacherId <= 0)
        ) {
          toast.error('Please select a valid homeroom teacher.')
          return
        }
        const payload = {
          name: value.name.trim(),
          academic_year_id: academicYearId,
          homeroom_teacher_id: homeroomTeacherId,
        }
        if (initial) {
          await updateMutation.mutateAsync(payload)
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
                  <Select
                    value={value}
                    onValueChange={(next) => onChange(next ?? '')}
                    disabled={academicYears.isLoading}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-label="Academic Year"
                    >
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.options.map((option) => (
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

          <form.AppField name="homeroom_teacher_id">
            {(field) => (
              <field.FormField<string>
                label="Homeroom Teacher"
                description="Optional. Leave empty when not assigned yet."
                children={({ value, onChange }) => (
                  <Select
                    value={value}
                    onValueChange={(next) => onChange(next ?? NO_TEACHER_VALUE)}
                    disabled={teachers.isLoading}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-label="Homeroom Teacher"
                    >
                      <SelectValue placeholder="Select homeroom teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_TEACHER_VALUE}>
                        No homeroom teacher
                      </SelectItem>
                      {teachers.options.map((option) => (
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ClassroomDetail({ item }: { item: IClassroom }) {
  const detailQuery = useClassroomDetail(item.id, true)
  const data = detailQuery.data ?? item

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getErrorMessage(detailQuery.error, 'Failed to load classroom detail.'),
      )
    }
  }, [detailQuery.isError, detailQuery.error])

  if (detailQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  const academicYear = data.academic_year
  const teacher = data.user
  const students = data.students ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="divide-y divide-border rounded-md border border-border px-4">
        <DetailRow label="Classroom Name" value={data.name} />
        <DetailRow
          label="Academic Year"
          value={
            academicYear
              ? `${formatAcademicLabel({
                  id: academicYear.id,
                  start_date: academicYear.start_date,
                  end_date: academicYear.end_date,
                  semester: academicYear.semester,
                  is_active: false,
                  created_at: '',
                  updated_at: '',
                })} (${academicYear.semester})`
              : '-'
          }
        />
        <DetailRow label="Homeroom Teacher" value={teacher?.name ?? '-'} />
        <DetailRow
          label="Students"
          value={String(data.students_count ?? students.length ?? 0)}
        />
        <DetailRow
          label="Created At"
          value={formatDate(data.created_at, DATE_FORMAT.DATE_TIME)}
        />
        <DetailRow
          label="Updated At"
          value={formatDate(data.updated_at, DATE_FORMAT.DATE_TIME)}
        />
      </div>
      {students.length > 0 && (
        <div className="rounded-md border border-border px-4 py-2">
          <p className="py-1 text-sm font-medium">Students</p>
          <ul className="divide-y divide-border">
            {students.map((student) => (
              <li
                key={student.id}
                className="py-1.5 text-sm text-muted-foreground"
              >
                {student.user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const DIALOG_COPY = {
  create: {
    title: 'Create classroom',
    description: 'Fill in the name, academic year, and homeroom teacher.',
  },
  edit: {
    title: 'Edit classroom',
    description: 'Update the classroom details.',
  },
  view: {
    title: 'Classroom detail',
    description: 'Classroom info, homeroom teacher, and students.',
  },
} as const

export function ClassroomDialog() {
  const selected = useClassroomStore((state) => state.selected)
  const mode = useClassroomStore((state) => state.mode)
  const isDialogOpen = useClassroomStore((state) => state.isDialogOpen)
  const closeDialog = useClassroomStore((state) => state.closeDialog)

  if (!mode) return null
  const copy = DIALOG_COPY[mode]

  return (
    <ResponsiveDialog
      title={copy.title}
      description={copy.description}
      isOpen={isDialogOpen}
      onIsOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      {mode === 'view' && selected ? (
        <ClassroomDetail key={selected.id} item={selected} />
      ) : (
        <ClassroomForm
          key={mode === 'edit' ? selected?.id : 'create'}
          initial={mode === 'edit' ? selected : null}
        />
      )}
    </ResponsiveDialog>
  )
}
