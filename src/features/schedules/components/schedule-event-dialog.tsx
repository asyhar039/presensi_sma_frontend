import type {
  IClassSchedule,
  ISelectedSlot,
} from '@/features/schedules/types/schedule.types'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { ApiCombobox } from '@/components/composite/api-combobox'
import { ButtonLoading } from '@/components/composite/button-loading'
import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateClassSchedule,
  useDeleteClassSchedule,
  useUpdateClassSchedule,
} from '@/features/schedules/hooks/use-class-schedules'
import {
  type IClassScheduleSchema,
  classScheduleSchema,
} from '@/features/schedules/schemas/schedule-schema'
import {
  getTeacherScheduleDropdown,
  getTeacherScheduleDropdownSelected,
} from '@/features/schedules/services/schedule-api'
import {
  WEEK_DAYS,
  WEEK_DAY_LABELS,
  type WeekDay,
} from '@/features/settings/types/schedule-clock.types'
import { useAppForm } from '@/hooks/use-form'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

type ScheduleEventDialogProps = {
  selection: ISelectedSlot | null
  onClose: () => void
}

function defaultsOf(selection: ISelectedSlot | null): IClassScheduleSchema {
  return {
    teacher_id: selection?.entry?.teacher
      ? String(selection.entry.teacher.id)
      : '',
    day: selection?.day ?? 'monday',
    period: selection?.entry?.period ?? 0,
    start_time: selection?.draft.start ?? '07:00',
    end_time: selection?.draft.end ?? '08:00',
  }
}

function toDraftPayload(value: IClassScheduleSchema, classroomId: number) {
  return {
    classroom_id: classroomId,
    day: value.day,
    period: value.period,
    start_time: value.start_time,
    end_time: value.end_time,
    teacher_id: Number(value.teacher_id),
  }
}

function useEventMutations(
  selection: ISelectedSlot | null,
  onClose: () => void,
) {
  const createMutation = useCreateClassSchedule()
  const updateMutation = useUpdateClassSchedule()
  const deleteMutation = useDeleteClassSchedule()
  const show = useConfirmationStore((state) => state.show)

  const pending = createMutation.isPending || updateMutation.isPending

  const askDelete = (entry: IClassSchedule) => {
    show({
      title: 'Delete schedule?',
      description: `${entry.start_time} – ${entry.end_time} will be removed.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        try {
          loading(true)
          await deleteMutation.mutateAsync(entry.id)
          onClose()
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete schedule.'))
        } finally {
          loading(false)
        }
      },
    })
  }

  void selection
  return { createMutation, updateMutation, deleteMutation, askDelete, pending }
}

export function ScheduleEventDialog({
  selection,
  onClose,
}: ScheduleEventDialogProps) {
  const open = selection !== null
  const { createMutation, updateMutation, deleteMutation, askDelete, pending } =
    useEventMutations(selection, onClose)

  const form = useAppForm({
    defaultValues: defaultsOf(selection),
    validators: { onChange: classScheduleSchema },
    onSubmit: async ({ value }) => {
      if (!selection) return
      try {
        if (selection.entry) {
          await updateMutation.mutateAsync({
            id: selection.entry.id,
            payload: toDraftPayload(value, selection.classroomId),
          })
        } else {
          await createMutation.mutateAsync(
            toDraftPayload(value, selection.classroomId),
          )
        }
        onClose()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save schedule.')
      }
    },
  })

  const selectionKey = selection
    ? `${selection.day}-${selection.draft.start}-${selection.draft.end}-${selection.entry?.id ?? 'new'}`
    : 'closed'
  useEffect(() => {
    if (open) form.reset(defaultsOf(selection))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectionKey])

  if (!selection) return null
  const entry = selection.entry

  return (
    <ResponsiveDialog
      title={entry ? 'Edit schedule' : 'New schedule'}
      description={`${WEEK_DAY_LABELS[selection.day]} · ${selection.draft.start} – ${selection.draft.end}`}
      isOpen={open}
      onIsOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.AppForm>
          <div className="flex flex-col gap-4">
            <form.AppField name="teacher_id">
              {(field) => (
                <field.FormField<string>
                  label="Teacher"
                  children={({ value, onChange }) => (
                    <ApiCombobox
                      queryKey="teacher-schedule-dropdown"
                      queryFn={getTeacherScheduleDropdown}
                      selectedQueryFn={getTeacherScheduleDropdownSelected}
                      placeholder="Search teacher..."
                      value={value || undefined}
                      onValueChange={(next) => onChange(next ?? '')}
                    />
                  )}
                />
              )}
            </form.AppField>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="start_time">
                {(field) => (
                  <field.FormField<string>
                    label="Start"
                    children={({ value, onChange, onBlur, ...rest }) => (
                      <Input
                        type="time"
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.value)}
                        {...rest}
                      />
                    )}
                  />
                )}
              </form.AppField>
              <form.AppField name="end_time">
                {(field) => (
                  <field.FormField<string>
                    label="End"
                    children={({ value, onChange, onBlur, ...rest }) => (
                      <Input
                        type="time"
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.value)}
                        {...rest}
                      />
                    )}
                  />
                )}
              </form.AppField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <form.AppField name="day">
                {(field) => (
                  <field.FormField<WeekDay>
                    label="Day"
                    children={({ value, onChange }) => (
                      <Select
                        value={value}
                        onValueChange={(next) => onChange(next as WeekDay)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {WEEK_DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              <span className="capitalize">
                                {WEEK_DAY_LABELS[day]}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </form.AppField>
              <form.AppField name="period">
                {(field) => (
                  <field.FormField<number>
                    label="Period"
                    children={({ value, onChange, onBlur, ...rest }) => (
                      <Input
                        type="number"
                        min={0}
                        max={30}
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => onChange(Number(e.target.value))}
                        {...rest}
                      />
                    )}
                  />
                )}
              </form.AppField>
            </div>
            <div className="flex gap-2">
              {entry && (
                <ButtonLoading
                  type="button"
                  variant="destructive"
                  loading={deleteMutation.isPending}
                  onClick={() => askDelete(entry)}
                  className="flex-1"
                >
                  Delete
                </ButtonLoading>
              )}
              <ButtonLoading type="submit" loading={pending} className="flex-1">
                {entry ? 'Save changes' : 'Create schedule'}
              </ButtonLoading>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: drag events to move them, drag top/bottom edge to resize.
              Snaps to 5 minutes.
            </p>
          </div>
        </form.AppForm>
      </form>
    </ResponsiveDialog>
  )
}
