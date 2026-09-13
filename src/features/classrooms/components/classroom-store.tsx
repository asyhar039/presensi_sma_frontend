import type { IClassroom } from '@/features/classrooms/types/classroom.types'

import zustandContext from '@/components/composite/zustand-context'

export type ClassroomDialogMode = 'create' | 'edit' | 'view'

interface ClassroomState {
  selected: IClassroom | null
  mode: ClassroomDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: IClassroom) => void
  openView: (item: IClassroom) => void
  closeDialog: () => void
}

export const [ClassroomProvider, useClassroomStore] =
  zustandContext<ClassroomState>(
    () => (set) => ({
      selected: null,
      mode: null,
      isDialogOpen: false,
      openCreate: () =>
        set({ selected: null, mode: 'create', isDialogOpen: true }),
      openEdit: (item) =>
        set({ selected: item, mode: 'edit', isDialogOpen: true }),
      openView: (item) =>
        set({ selected: item, mode: 'view', isDialogOpen: true }),
      closeDialog: () =>
        set({ selected: null, mode: null, isDialogOpen: false }),
    }),
    'useClassroomStore must be used within a ClassroomProvider',
  )
