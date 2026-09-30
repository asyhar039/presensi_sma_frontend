import type {
  IDutyTeacherListResult,
  IDutyTeacherParams,
  IDutyTeacherStats,
  ILeaveRequest,
} from '@/features/duty-teacher/types/duty-teacher.types'

const MOCK_LEAVE_REQUESTS: ILeaveRequest[] = [
  {
    id: 1,
    student_id: 101,
    student_name: 'Ahmad Fauzi',
    student_nis: '2024001',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    leave_type: 'school',
    reason: 'Menghadiri acara keluarga yang mendesak',
    leave_date: '2026-09-30',
    estimated_return: '2026-09-30T14:00:00Z',
    status: 'pending',
    created_at: '2026-09-30T10:00:00Z',
  },
  {
    id: 2,
    student_id: 102,
    student_name: 'Siti Rahma',
    student_nis: '2024002',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    leave_type: 'temporary',
    reason: 'Konsultasi dengan guru BK',
    leave_date: '2026-09-30',
    estimated_return: '2026-09-30T13:30:00Z',
    status: 'approved',
    scanned_out_at: '2026-09-30T12:15:00Z',
    created_at: '2026-09-30T11:30:00Z',
  },
  {
    id: 3,
    student_id: 103,
    student_name: 'Budi Santoso',
    student_nis: '2024003',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    leave_type: 'temporary',
    reason: 'Periksakan kesehatan ke UKS',
    leave_date: '2026-09-30',
    estimated_return: '2026-09-30T12:45:00Z',
    status: 'away',
    scanned_out_at: '2026-09-30T12:00:00Z',
    created_at: '2026-09-30T11:45:00Z',
  },
  {
    id: 4,
    student_id: 104,
    student_name: 'Dewi Lestari',
    student_nis: '2024004',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    leave_type: 'temporary',
    reason: 'Keperluan pribadi',
    leave_date: '2026-09-30',
    estimated_return: '2026-09-30T13:00:00Z',
    status: 'returned',
    scanned_out_at: '2026-09-30T11:50:00Z',
    scanned_in_at: '2026-09-30T13:05:00Z',
    created_at: '2026-09-30T11:20:00Z',
  },
]

export async function getLeaveRequests(
  params: IDutyTeacherParams,
): Promise<IDutyTeacherListResult> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  let filtered = [...MOCK_LEAVE_REQUESTS]

  if (params.date) {
    filtered = filtered.filter((r) => r.leave_date === params.date)
  }

  if (params.classroom_id) {
    filtered = filtered.filter(
      (r) => r.classroom_id === Number(params.classroom_id),
    )
  }

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((r) => r.status === params.status)
  }

  if (params.search) {
    const search = params.search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.student_name.toLowerCase().includes(search) ||
        r.student_nis.includes(search),
    )
  }

  const page = params.page || 1
  const perPage = params.per_page || 10
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    items: filtered.slice(start, end),
    meta: { page, per_page: perPage, total, total_pages: totalPages },
  }
}

export async function getDutyTeacherStats(): Promise<IDutyTeacherStats> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  const today = new Date().toISOString().split('T')[0]
  const todayRequests = MOCK_LEAVE_REQUESTS.filter(
    (r) => r.leave_date === today,
  )

  return {
    total_today: todayRequests.length,
    pending_validation: todayRequests.filter((r) => r.status === 'pending')
      .length,
    approved: todayRequests.filter((r) => r.status === 'approved').length,
    currently_away: todayRequests.filter((r) => r.status === 'away').length,
  }
}

export async function scanQRCode(
  studentId: number,
  scanType: 'out' | 'in',
): Promise<ILeaveRequest> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const request = MOCK_LEAVE_REQUESTS.find((r) => r.student_id === studentId)
  if (!request) throw new Error('Leave request not found')

  const updated: ILeaveRequest = { ...request }

  if (scanType === 'out') {
    updated.status = 'away'
    updated.scanned_out_at = new Date().toISOString()
  } else {
    updated.status = 'returned'
    updated.scanned_in_at = new Date().toISOString()
  }

  const index = MOCK_LEAVE_REQUESTS.findIndex((r) => r.student_id === studentId)
  if (index !== -1) {
    MOCK_LEAVE_REQUESTS[index] = updated
  }

  return updated
}

export async function approveLeaveRequest(
  leaveRequestId: number,
): Promise<ILeaveRequest> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  const request = MOCK_LEAVE_REQUESTS.find((r) => r.id === leaveRequestId)
  if (!request) throw new Error('Leave request not found')

  const updated: ILeaveRequest = { ...request, status: 'approved' }

  const index = MOCK_LEAVE_REQUESTS.findIndex((r) => r.id === leaveRequestId)
  if (index !== -1) {
    MOCK_LEAVE_REQUESTS[index] = updated
  }

  return updated
}

export async function rejectLeaveRequest(
  leaveRequestId: number,
): Promise<ILeaveRequest> {
  await new Promise((resolve) => setTimeout(resolve, 250))

  const request = MOCK_LEAVE_REQUESTS.find((r) => r.id === leaveRequestId)
  if (!request) throw new Error('Leave request not found')

  const updated: ILeaveRequest = { ...request, status: 'pending' }

  const index = MOCK_LEAVE_REQUESTS.findIndex((r) => r.id === leaveRequestId)
  if (index !== -1) {
    MOCK_LEAVE_REQUESTS[index] = updated
  }

  return updated
}
