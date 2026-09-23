import type { IRoom } from '@/features/rooms/types/room.types'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { useRoomStore } from '@/features/rooms/components/room-store'
import { useCreateRoom } from '@/features/rooms/hooks/use-create-room'
import { useRoomDetail } from '@/features/rooms/hooks/use-room-detail'
import { useUpdateRoom } from '@/features/rooms/hooks/use-update-room'
import {
  type IRoomSchema,
  roomSchema,
} from '@/features/rooms/schemas/room-schema'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

function RoomForm({ initial }: { initial: IRoom | null }) {
  const closeDialog = useRoomStore((state) => state.closeDialog)
  const createMutation = useCreateRoom()
  const updateMutation = useUpdateRoom(initial?.id ?? null)

  const form = useAppForm({
    defaultValues: {
      name: initial?.name ?? '',
    } as IRoomSchema,
    validators: { onChange: roomSchema },
    onSubmit: async ({ value }) => {
      try {
        if (initial) {
          await updateMutation.mutateAsync({ name: value.name })
        } else {
          await createMutation.mutateAsync({ name: value.name })
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save room.')
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
                label="Room Name"
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

function RoomDetail({ item }: { item: IRoom }) {
  const detailQuery = useRoomDetail(item.id, true)
  const data = detailQuery.data ?? item

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getErrorMessage(detailQuery.error, 'Failed to load room detail.'),
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
      <DetailRow label="Room Name" value={data.name} />
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
    title: 'Create room',
    description: 'Fill in the name for the new room.',
  },
  edit: {
    title: 'Edit room',
    description: 'Update the name of this room.',
  },
  view: {
    title: 'Room detail',
    description: 'Name and timestamps of this room.',
  },
} as const

export function RoomDialog() {
  const selected = useRoomStore((state) => state.selected)
  const mode = useRoomStore((state) => state.mode)
  const isDialogOpen = useRoomStore((state) => state.isDialogOpen)
  const closeDialog = useRoomStore((state) => state.closeDialog)

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
        <RoomDetail key={selected.id} item={selected} />
      ) : (
        <RoomForm
          key={mode === 'edit' ? selected?.id : 'create'}
          initial={mode === 'edit' ? selected : null}
        />
      )}
    </ResponsiveDialog>
  )
}
