import type { IAttendanceSession } from '@/features/attendance/types/attendance.types'

import zustandContext from '@/components/composite/zustand-context'

export type AttendanceDialogMode = 'create' | 'edit' | 'view'

interface AttendanceState {
  selected: IAttendanceSession | null
  mode: AttendanceDialogMode | null
  isDialogOpen: boolean
  activeTab: 'waiting' | 'approved' | 'all'
  setActiveTab: (tab: AttendanceState['activeTab']) => void
  openCreate: () => void
  openEdit: (item: IAttendanceSession) => void
  openView: (item: IAttendanceSession) => void
  closeDialog: () => void
}

export const [AttendanceProvider, useAttendanceStore] =
  zustandContext<AttendanceState>(
    () => (set) => ({
      selected: null,
      mode: null,
      isDialogOpen: false,
      activeTab: 'waiting',
      setActiveTab: (tab) => set({ activeTab: tab }),
      openCreate: () =>
        set({ selected: null, mode: 'create', isDialogOpen: true }),
      openEdit: (item) =>
        set({ selected: item, mode: 'edit', isDialogOpen: true }),
      openView: (item) =>
        set({ selected: item, mode: 'view', isDialogOpen: true }),
      closeDialog: () =>
        set({ selected: null, mode: null, isDialogOpen: false }),
    }),
    'useAttendanceStore must be used within an AttendanceProvider',
  )
