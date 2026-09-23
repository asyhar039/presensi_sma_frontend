import type { IRoom } from '@/features/rooms/types/room.types'

import zustandContext from '@/components/composite/zustand-context'

export type RoomDialogMode = 'create' | 'edit' | 'view'

interface RoomState {
  selected: IRoom | null
  mode: RoomDialogMode | null
  isDialogOpen: boolean
  openCreate: () => void
  openEdit: (item: IRoom) => void
  openView: (item: IRoom) => void
  closeDialog: () => void
}

export const [RoomProvider, useRoomStore] = zustandContext<RoomState>(
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
  'useRoomStore must be used within a RoomProvider',
)
