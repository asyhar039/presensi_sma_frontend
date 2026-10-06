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
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { useAcademicYearStore } from '@/features/academic-years/components/academic-year-store'
import { useAcademicYearDetail } from '@/features/academic-years/hooks/use-academic-year-detail'
import { useCreateAcademicYear } from '@/features/academic-years/hooks/use-create-academic-year'
import { useUpdateAcademicYear } from '@/features/academic-years/hooks/use-update-academic-year'
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

const DATE_FIELDS = [
  { name: 'odd_start_date', label: 'Odd Start Date' },
  { name: 'odd_end_date', label: 'Odd End Date' },
  { name: 'even_start_date', label: 'Even Start Date' },
  { name: 'even_end_date', label: 'Even End Date' },
] as const

function AcademicYearForm({ initial }: { initial: IAcademicYear | null }) {
  const closeDialog = useAcademicYearStore((state) => state.closeDialog)
  const createMutation = useCreateAcademicYear()
  const updateMutation = useUpdateAcademicYear(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      odd_start_date: toDateInput(initial?.odd_start_date),
      odd_end_date: toDateInput(initial?.odd_end_date),
      even_start_date: toDateInput(initial?.even_start_date),
      even_end_date: toDateInput(initial?.even_end_date),
      is_active: initial?.is_active ?? true,
    } as IAcademicYearSchema,
    validators: { onChange: academicYearSchema },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          odd_start_date: toISOStringPayload(value.odd_start_date),
          odd_end_date: toISOStringPayload(value.odd_end_date),
          even_start_date: toISOStringPayload(value.even_start_date),
          even_end_date: toISOStringPayload(value.even_end_date),
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
            {DATE_FIELDS.map((item) => (
              <form.AppField key={item.name} name={item.name}>
                {(field) => (
                  <field.FormField<string>
                    label={item.label}
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
            ))}
          </div>

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
      <DetailRow
        label="Odd Start"
        value={formatDate(data.odd_start_date, DATE_FORMAT.DATE)}
      />
      <DetailRow
        label="Odd End"
        value={formatDate(data.odd_end_date, DATE_FORMAT.DATE)}
      />
      <DetailRow
        label="Even Start"
        value={formatDate(data.even_start_date, DATE_FORMAT.DATE)}
      />
      <DetailRow
        label="Even End"
        value={formatDate(data.even_end_date, DATE_FORMAT.DATE)}
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
      'Fill in the odd/even periods and status for the new academic year.',
  },
  edit: {
    title: 'Edit academic year',
    description: 'Update the periods or status of this academic year.',
  },
  view: {
    title: 'Academic year detail',
    description: 'Periods and status of this academic year.',
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
