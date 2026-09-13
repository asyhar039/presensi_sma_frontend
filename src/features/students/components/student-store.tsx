import type { IStudent } from '@/features/students/types/student.types'

import zustandContext from '@/components/composite/zustand-context'

export type StudentDialogMode = 'create' | 'edit' | 'view' | 'password'

interface StudentState {
  selected: IStudent | null
  mode: StudentDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: IStudent) => void
  openView: (item: IStudent) => void
  openPassword: (item: IStudent) => void
  closeDialog: () => void
}

export const [StudentProvider, useStudentStore] = zustandContext<StudentState>(
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
  'useStudentStore must be used within a StudentProvider',
)
