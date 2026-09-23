import type { IAttendanceSession } from '@/features/attendance/types/attendance.types'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { useAttendanceStore } from '@/features/attendance/components/attendance-store'
import { useAttendanceDetail } from '@/features/attendance/hooks/use-attendance-detail'
import { useCreateAttendance } from '@/features/attendance/hooks/use-create-attendance'
import { useUpdateAttendance } from '@/features/attendance/hooks/use-update-attendance'
import {
  type IAttendanceSessionSchema,
  attendanceSessionSchema,
} from '@/features/attendance/schemas/attendance-schema'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler } from '@/utils/error'

function SessionForm({ initial }: { initial: IAttendanceSession | null }) {
  const closeDialog = useAttendanceStore((state) => state.closeDialog)
  const createMutation = useCreateAttendance()
  const updateMutation = useUpdateAttendance(initial?.id ?? null)
  const isEdit = initial !== null

  const form = useAppForm({
    defaultValues: {
      subject: initial?.subject ?? '',
      class_name: initial?.class_name ?? '',
      room: initial?.room ?? '',
      start_time: initial?.start_time ?? '',
      end_time: initial?.end_time ?? '',
    } as IAttendanceSessionSchema,
    validators: { onChange: attendanceSessionSchema },
    onSubmit: async ({ value }) => {
      try {
        if (initial) {
          await updateMutation.mutateAsync({
            subject: value.subject,
            class_name: value.class_name,
            room: value.room,
            start_time: value.start_time,
            end_time: value.end_time,
          })
        } else {
          await createMutation.mutateAsync({
            subject: value.subject,
            class_name: value.class_name,
            room: value.room,
            start_time: value.start_time,
            end_time: value.end_time,
          })
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save session.')
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
            <form.AppField name="subject">
              {(field) => (
                <field.FormField<string>
                  label="Subject"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      placeholder="e.g. Mathematics"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="class_name">
              {(field) => (
                <field.FormField<string>
                  label="Class"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      placeholder="e.g. X IPA 1"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="room">
              {(field) => (
                <field.FormField<string>
                  label="Room"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      placeholder="e.g. R-01"
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
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
          </div>
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
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <form.ButtonSubmit
              label={isEdit ? 'Save changes' : 'Create'}
              loadingLabel="Saving..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}

function SessionDetail({ item }: { item: IAttendanceSession }) {
  const detailQuery = useAttendanceDetail(item.id, true)
  const data = detailQuery.data ?? item

  if (detailQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border px-4">
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Subject</span>
        <span className="text-sm font-medium">{data.subject}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Class</span>
        <span className="text-sm font-medium">{data.class_name}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Room</span>
        <span className="text-sm font-medium">{data.room}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Start Time</span>
        <span className="text-sm font-medium">{data.start_time}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">End Time</span>
        <span className="text-sm font-medium">{data.end_time}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Status</span>
        <span className="text-sm font-medium">{data.status}</span>
      </div>
      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-sm text-muted-foreground">Created At</span>
        <span className="text-sm font-medium">
          {formatDate(data.created_at, DATE_FORMAT.DATE_TIME)}
        </span>
      </div>
    </div>
  )
}

const DIALOG_COPY = {
  create: {
    title: 'Create session',
    description: 'Fill in the data for the new session.',
  },
  edit: {
    title: 'Edit session',
    description: 'Update the data of this session.',
  },
  view: {
    title: 'Session detail',
    description: 'Details of this attendance session.',
  },
} as const

export function AttendanceDialog() {
  const selected = useAttendanceStore((state) => state.selected)
  const mode = useAttendanceStore((state) => state.mode)
  const isDialogOpen = useAttendanceStore((state) => state.isDialogOpen)
  const closeDialog = useAttendanceStore((state) => state.closeDialog)

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
        <SessionDetail key={selected.id} item={selected} />
      ) : mode === 'edit' && selected ? (
        <SessionForm key={selected.id} initial={selected} />
      ) : (
        <SessionForm key="create" initial={null} />
      )}
    </ResponsiveDialog>
  )
}
