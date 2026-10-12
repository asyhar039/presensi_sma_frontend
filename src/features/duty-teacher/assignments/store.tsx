import type { IDutyAssignment } from '@/features/duty-teacher/assignments/types'

import zustandContext from '@/components/composite/zustand-context'

export type DutyAssignmentDialogMode = 'create' | 'edit' | 'detail'

interface DutyAssignmentState {
  selected: IDutyAssignment | null
  mode: DutyAssignmentDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: IDutyAssignment) => void
  openDetail: (item: IDutyAssignment) => void
  closeDialog: () => void
  settleDialog: () => void
}

export const [DutyAssignmentProvider, useDutyAssignmentStore] =
  zustandContext<DutyAssignmentState>(
    () => (set) => ({
      selected: null,
      mode: null,
      isDialogOpen: false,
      openCreate: () =>
        set({ selected: null, mode: 'create', isDialogOpen: true }),
      openEdit: (item) =>
        set({ selected: item, mode: 'edit', isDialogOpen: true }),
      openDetail: (item) =>
        set({ selected: item, mode: 'detail', isDialogOpen: true }),
      closeDialog: () => set({ isDialogOpen: false }),
      settleDialog: () => set({ selected: null, mode: null }),
    }),
    'useDutyAssignmentStore must be used within a DutyAssignmentProvider',
  )
