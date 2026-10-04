import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { ClassroomForm } from '@/features/classrooms/components/classroom-form'
import { useClassroomStore } from '@/features/classrooms/components/classroom-store'

const DIALOG_COPY = {
  create: {
    title: 'Create classroom',
    description: 'Fill in the name, academic year, and homeroom teacher.',
  },
  edit: {
    title: 'Edit classroom',
    description: 'Update the classroom details.',
  },
} as const

export function ClassroomDialog() {
  const selected = useClassroomStore((state) => state.selected)
  const mode = useClassroomStore((state) => state.mode)
  const isDialogOpen = useClassroomStore((state) => state.isDialogOpen)
  const closeDialog = useClassroomStore((state) => state.closeDialog)
  const settleDialog = useClassroomStore((state) => state.settleDialog)
  const copy = mode ? DIALOG_COPY[mode] : DIALOG_COPY.create

  return (
    <ResponsiveDialog
      title={copy.title}
      description={copy.description}
      isOpen={isDialogOpen}
      onIsOpenChange={(open) => {
        if (!open) closeDialog()
      }}
      onIsOpenChangeComplete={(open) => {
        if (!open) settleDialog()
      }}
    >
      {(mode ?? 'create') === 'edit' ? (
        <ClassroomForm key={selected?.id ?? 'edit'} initial={selected} />
      ) : (
        <ClassroomForm key="create" initial={null} />
      )}
    </ResponsiveDialog>
  )
}
