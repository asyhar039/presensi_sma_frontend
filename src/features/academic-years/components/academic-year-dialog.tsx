import type { IAcademicYear } from '@/features/academic-years/types/academic-year.types'

import dayjs from 'dayjs'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { formatSemester } from '@/features/academic-years/components/academic-year-columns'
import { useAcademicYearStore } from '@/features/academic-years/components/academic-year-store'
import { useAcademicYearDetail } from '@/features/academic-years/hooks/use-academic-year-detail'
import { useCreateAcademicYear } from '@/features/academic-years/hooks/use-create-academic-year'
import { useUpdateAcademicYear } from '@/features/academic-years/hooks/use-update-academic-year'
import { ACADEMIC_YEAR_SEMESTER_FORM_OPTIONS } from '@/features/academic-years/lib/academic-year-table'
import {
  type IAcademicYearSchema,
  academicYearSchema,
} from '@/features/academic-years/schemas/academic-year-schema'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

function toDateInput(value?: string): string {
  if (!value) return ''
  const parsed = dayjs.utc(value)
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : ''
}

function toISOStringPayload(value: string): string {
  return new Date(`${value}T00:00:00Z`).toISOString()
}

function AcademicYearForm({ initial }: { initial: IAcademicYear | null }) {
  const closeDialog = useAcademicYearStore((state) => state.closeDialog)
  const createMutation = useCreateAcademicYear()
  const updateMutation = useUpdateAcademicYear(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      start_date: toDateInput(initial?.start_date),
      end_date: toDateInput(initial?.end_date),
      semester: (initial?.semester === 'even'
        ? 'even'
        : 'odd') as IAcademicYearSchema['semester'],
      is_active: initial?.is_active ?? true,
    } as IAcademicYearSchema,
    validators: { onChange: academicYearSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          start_date: toISOStringPayload(value.start_date),
          end_date: toISOStringPayload(value.end_date),
          semester: value.semester,
          is_active: value.is_active,
        }
        if (initial) {
          await updateMutation.mutateAsync(payload)
        } else {
          await createMutation.mutateAsync(payload)
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save academic year.')
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="start_date">
              {(field) => (
                <field.FormField<string>
                  label="Start Date"
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
            <form.AppField name="end_date">
              {(field) => (
                <field.FormField<string>
                  label="End Date"
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
          </div>

          <form.AppField name="semester">
            {(field) => (
              <field.FormField<string>
                label="Semester"
                children={({ value, onChange }) => (
                  <Select
                    items={ACADEMIC_YEAR_SEMESTER_FORM_OPTIONS}
                    value={value}
                    onValueChange={(next) =>
                      onChange(next as IAcademicYearSchema['semester'])
                    }
                  >
                    <SelectTrigger className="w-full" aria-label="Semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACADEMIC_YEAR_SEMESTER_FORM_OPTIONS.map((option) => (
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

          <form.AppField name="is_active">
            {(field) => (
              <div className="flex items-center gap-2.5 rounded-md border border-input px-3 py-2.5">
                <Checkbox
                  id="academic-year-is-active"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <Label
                  htmlFor="academic-year-is-active"
                  className="cursor-pointer"
                >
                  Mark as active academic year
                </Label>
              </div>
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

function AcademicYearDetail({ item }: { item: IAcademicYear }) {
  const detailQuery = useAcademicYearDetail(item.id, true)
  const data = detailQuery.data ?? item

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getErrorMessage(
          detailQuery.error,
          'Failed to load academic year detail.',
        ),
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

  return (
    <div className="divide-y divide-border rounded-md border border-border px-4">
      <DetailRow label="Semester" value={formatSemester(data.semester)} />
      <DetailRow
        label="Start Date"
        value={formatDate(data.start_date, DATE_FORMAT.DATE)}
      />
      <DetailRow
        label="End Date"
        value={formatDate(data.end_date, DATE_FORMAT.DATE)}
      />
      <DetailRow
        label="Status"
        value={data.is_active ? 'Active' : 'Inactive'}
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
  )
}

const DIALOG_COPY = {
  create: {
    title: 'Create academic year',
    description:
      'Fill in the period, semester, and status for the new academic year.',
  },
  edit: {
    title: 'Edit academic year',
    description:
      'Update the period, semester, or status of this academic year.',
  },
  view: {
    title: 'Academic year detail',
    description: 'Period, semester, and status of this academic year.',
  },
} as const

export function AcademicYearDialog() {
  const selected = useAcademicYearStore((state) => state.selected)
  const mode = useAcademicYearStore((state) => state.mode)
  const isDialogOpen = useAcademicYearStore((state) => state.isDialogOpen)
  const closeDialog = useAcademicYearStore((state) => state.closeDialog)

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
        <AcademicYearDetail key={selected.id} item={selected} />
      ) : (
        <AcademicYearForm
          key={mode === 'edit' ? selected?.id : 'create'}
          initial={mode === 'edit' ? selected : null}
        />
      )}
    </ResponsiveDialog>
  )
}
