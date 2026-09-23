import type { ScheduleViewMode } from '@/features/schedules/types/schedule.types'

import { create } from 'zustand'

type ScheduleViewState = {
  viewMode: ScheduleViewMode
  semester: string
  setViewMode: (mode: ScheduleViewMode) => void
  setSemester: (value: string) => void
}

export const useScheduleViewStore = create<ScheduleViewState>((set) => ({
  viewMode: 'mingguan',
  semester: 'all',
  setViewMode: (viewMode) => set({ viewMode }),
  setSemester: (semester) => set({ semester }),
}))
