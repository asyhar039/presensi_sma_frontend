import type {
  IStudentAttendanceHistoryParams,
  IStudentAttendanceRecord,
  IStudentAttendanceSummary,
} from '@/features/student-permits/types/attendance-history.types'

import { api } from '@/services/api-client'

const MOCK_ATTENDANCE: IStudentAttendanceRecord[] = [
  {
    id: 1,
    date: '2026-09-25',
    check_in_time: '06:55',
    check_out_time: '14:00',
    status: 'present',
    status_label: 'Hadir',
    remarks: 'Tepat waktu',
    document_url: null,
  },
  {
    id: 2,
    date: '2026-09-24',
    check_in_time: null,
    check_out_time: null,
    status: 'sick',
    status_label: 'Sakit',
    remarks: 'Demam tinggi',
    document_url: 'https://example.com/sick-note.pdf',
  },
  {
    id: 3,
    date: '2026-09-23',
    check_in_time: '07:15',
    check_out_time: '14:00',
    status: 'leave_in',
    status_label: 'Izin Terlambat',
    remarks: 'Ban bocor',
    document_url: null,
  },
  {
    id: 4,
    date: '2026-09-22',
    check_in_time: '07:00',
    check_out_time: '10:30',
    status: 'leave_school',
    status_label: 'Izin Keluar',
    remarks: 'Acara keluarga',
    document_url: null,
  },
  {
    id: 5,
    date: '2026-09-21',
    check_in_time: null,
    check_out_time: null,
    status: 'absent',
    status_label: 'Alpa',
    remarks: 'Tanpa keterangan',
    document_url: null,
  },
]

export async function getStudentAttendanceHistory(
  params: IStudentAttendanceHistoryParams,
): Promise<{ items: IStudentAttendanceRecord[]; total: number }> {
  try {
    const res = await api.get<{
      items: IStudentAttendanceRecord[]
      total: number
    }>('/student/attendance-history', { params })
    return res
  } catch {
    // Fallback to mock
    let filtered = [...MOCK_ATTENDANCE]
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter((item) => item.status === params.status)
    }
    return {
      items: filtered,
      total: filtered.length,
    }
  }
}

export async function getStudentAttendanceSummary(): Promise<IStudentAttendanceSummary> {
  try {
    return await api.get<IStudentAttendanceSummary>(
      '/student/attendance-summary',
    )
  } catch {
    return {
      total_present: 18,
      total_sick: 2,
      total_leave_school: 1,
      total_leave_in: 1,
      total_absent: 1,
      attendance_rate: 85,
    }
  }
}
