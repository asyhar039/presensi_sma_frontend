import type { IAcademicYear } from '@/features/academic-years/types/academic-year.types'

import zustandContext from '@/components/composite/zustand-context'

export type AcademicYearDialogMode = 'create' | 'edit' | 'view'

interface AcademicYearState {
  selected: IAcademicYear | null
  mode: AcademicYearDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: IAcademicYear) => void
  openView: (item: IAcademicYear) => void
  closeDialog: () => void
}

export const [AcademicYearProvider, useAcademicYearStore] =
  zustandContext<AcademicYearState>(
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
    'useAcademicYearStore must be used within an AcademicYearProvider',
  )
