import type {
  IAttendanceRecord,
  IStudentAttendanceDetail,
} from '@/features/attendance/types/attendance.types'

import zustandContext from '@/components/composite/zustand-context'

export type AttendanceDetailMode = 'detail'

interface AttendanceState {
  selectedRecord: IAttendanceRecord | null
  selectedStudentDetail: IStudentAttendanceDetail | null
  mode: AttendanceDetailMode | null
  isDetailOpen: boolean
  openDetail: (record: IAttendanceRecord) => void
  closeDetail: () => void
  getClassroomId: () => string
  getMonth: () => string
  getSemester: () => string
}

const getDefaultClassroomId = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('classroom_id') || ''
  }
  return ''
}

const getDefaultMonth = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('month') || ''
  }
  return ''
}

const getDefaultSemester = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('semester') || ''
  }
  return ''
}

export const [AttendanceProvider, useAttendanceStore] =
  zustandContext<AttendanceState>(
    () => (set, get) => ({
      selectedRecord: null,
      selectedStudentDetail: null,
      mode: null,
      isDetailOpen: false,
      openDetail: (record: IAttendanceRecord) =>
        set({ selectedRecord: record, mode: 'detail', isDetailOpen: true }),
      closeDetail: () =>
        set({
          selectedRecord: null,
          selectedStudentDetail: null,
          mode: null,
          isDetailOpen: false,
        }),
      getClassroomId: () =>
        get().selectedRecord?.classroom_id.toString() ||
        getDefaultClassroomId(),
      getMonth: () => getDefaultMonth(),
      getSemester: () => getDefaultSemester(),
    }),
    'useAttendanceStore must be used within an AttendanceProvider',
  )
