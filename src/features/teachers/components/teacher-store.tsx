import type { ITeacher } from '@/features/teachers/types/teacher.types'

import zustandContext from '@/components/composite/zustand-context'

export type TeacherDialogMode = 'create' | 'edit' | 'view' | 'password'

interface TeacherState {
  selected: ITeacher | null
  mode: TeacherDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: ITeacher) => void
  openView: (item: ITeacher) => void
  openPassword: (item: ITeacher) => void
  closeDialog: () => void
}

export const [TeacherProvider, useTeacherStore] = zustandContext<TeacherState>(
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
    openPassword: (item) =>
      set({ selected: item, mode: 'password', isDialogOpen: true }),
    closeDialog: () => set({ selected: null, mode: null, isDialogOpen: false }),
  }),
  'useTeacherStore must be used within a TeacherProvider',
)
