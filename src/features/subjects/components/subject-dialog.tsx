import type { ISubject } from '@/features/subjects/types/subject.types'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { useSubjectStore } from '@/features/subjects/components/subject-store'
import { useCreateSubject } from '@/features/subjects/hooks/use-create-subject'
import { useSubjectDetail } from '@/features/subjects/hooks/use-subject-detail'
import { useUpdateSubject } from '@/features/subjects/hooks/use-update-subject'
import {
  type ISubjectSchema,
  subjectSchema,
} from '@/features/subjects/schemas/subject-schema'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

function SubjectForm({ initial }: { initial: ISubject | null }) {
  const closeDialog = useSubjectStore((state) => state.closeDialog)
  const createMutation = useCreateSubject()
  const updateMutation = useUpdateSubject(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      name: initial?.name ?? '',
    } as ISubjectSchema,
    validators: { onChange: subjectSchema },
    onSubmit: async ({ value }) => {
      try {
        if (initial) {
          await updateMutation.mutateAsync({ name: value.name })
        } else {
          await createMutation.mutateAsync({ name: value.name })
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save subject.')
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
                label="Subject Name"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    type="text"
                    placeholder="e.g. Lab 101"
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

function SubjectDetail({ item }: { item: ISubject }) {
  const detailQuery = useSubjectDetail(item.id, true)
  const data = detailQuery.data ?? item

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getErrorMessage(detailQuery.error, 'Failed to load subject detail.'),
      )
    }
  }, [detailQuery.isError, detailQuery.error])

  if (detailQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border px-4">
      <DetailRow label="Subject Name" value={data.name} />
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
    title: 'Create subject',
    description: 'Fill in the name for the new subject.',
  },
  edit: {
    title: 'Edit subject',
    description: 'Update the name of this subject.',
  },
  view: {
    title: 'Subject detail',
    description: 'Name and timestamps of this subject.',
  },
} as const

export function SubjectDialog() {
  const selected = useSubjectStore((state) => state.selected)
  const mode = useSubjectStore((state) => state.mode)
  const isDialogOpen = useSubjectStore((state) => state.isDialogOpen)
  const closeDialog = useSubjectStore((state) => state.closeDialog)

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
        <SubjectDetail key={selected.id} item={selected} />
      ) : (
        <SubjectForm
          key={mode === 'edit' ? selected?.id : 'create'}
          initial={mode === 'edit' ? selected : null}
        />
      )}
    </ResponsiveDialog>
  )
}
