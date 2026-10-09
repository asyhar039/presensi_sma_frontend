import type { ISubject } from '@/features/subjects/types/subject.types'

import zustandContext from '@/components/composite/zustand-context'

export type SubjectDialogMode = 'create' | 'edit' | 'view'

interface SubjectState {
  selected: ISubject | null
  mode: SubjectDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: ISubject) => void
  openView: (item: ISubject) => void
  closeDialog: () => void
}

export const [SubjectProvider, useSubjectStore] = zustandContext<SubjectState>(
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
    closeDialog: () => set({ selected: null, mode: null, isDialogOpen: false }),
  }),
  'useSubjectStore must be used within a SubjectProvider',
)
