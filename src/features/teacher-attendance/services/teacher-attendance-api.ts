import type {
  IAttendanceLog,
  IAttendanceSession,
  IQRCode,
  ITeacherPermitRecord,
} from '@/features/teacher-attendance/types/teacher-attendance.types'

// Mock data for QR Code
const MOCK_QR_CODE: IQRCode = {
  id: 'qr_001',
  code: 'https://api.example.com/attend/abc123xyz456',
  created_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 3600000).toISOString(),
}

// Mock attendance logs
const MOCK_ATTENDANCE_LOGS: IAttendanceLog[] = [
  {
    id: 1,
    student_id: 101,
    student_name: 'Ahmad Fauzi',
    student_nis: '2024001',
    status: 'present',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    subject_name: 'Matematika',
  },
  {
    id: 2,
    student_id: 102,
    student_name: 'Siti Rahma',
    student_nis: '2024002',
    status: 'present',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    subject_name: 'Matematika',
  },
  {
    id: 3,
    student_id: 103,
    student_name: 'Budi Santoso',
    student_nis: '2024003',
    status: 'permission',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    subject_name: 'Matematika',
  },
  {
    id: 4,
    student_id: 104,
    student_name: 'Dewi Lestari',
    student_nis: '2024004',
    status: 'sick',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    subject_name: 'Matematika',
  },
]

// Mock permit records for approval
const MOCK_PERMIT_RECORDS: ITeacherPermitRecord[] = [
  {
    id: 1,
    student_id: 101,
    student_name: 'Ahmad Fauzi',
    student_nis: '2024001',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'sick',
    date: '2026-09-25',
    duration: '1 Hari',
    reason: 'Demam tinggi dan beristirahat di rumah sesuai anjuran dokter.',
    document_url: 'https://example.com/doc1.pdf',
    status: 'pending',
    created_at: '2026-09-25T08:00:00Z',
  },
  {
    id: 2,
    student_id: 102,
    student_name: 'Siti Rahma',
    student_nis: '2024002',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'leave_school',
    date: '2026-09-25',
    duration: '2 Jam',
    reason: 'Menghadiri acara keluarga yang mendesak.',
    document_url: null,
    status: 'pending',
    created_at: '2026-09-25T09:30:00Z',
  },
  {
    id: 3,
    student_id: 103,
    student_name: 'Budi Santoso',
    student_nis: '2024003',
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'leave_in',
    date: '2026-09-25',
    duration: '1 Jam',
    reason: 'Terlambat datang karena ban bocor di perjalanan.',
    document_url: null,
    status: 'pending',
    created_at: '2026-09-25T07:15:00Z',
  },
]

export async function generateQRCode(_sessionId: string): Promise<IQRCode> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const createdAt = new Date()

  return {
    ...MOCK_QR_CODE,
    id: _sessionId,
    code: `https://api.example.com/attend/${_sessionId}`,
    created_at: createdAt.toISOString(),
    expires_at: new Date(createdAt.getTime() + 3600000).toISOString(),
  }
}

export async function closeAttendanceSession(
  sessionId: string,
): Promise<IAttendanceSession> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    id: sessionId,
    teacher_id: 1,
    classroom_id: 1,
    subject_id: 1,
    qr_code: MOCK_QR_CODE,
    status: 'closed',
    started_at: new Date(Date.now() - 1800000).toISOString(),
    ended_at: new Date().toISOString(),
    total_present: 28,
    total_permission: 2,
    total_sick: 1,
    total_absent: 3,
  }
}

export async function getAttendanceLogs(
  _sessionId: string,
): Promise<IAttendanceLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_ATTENDANCE_LOGS
}

export async function getPendingPermits(
  _classroomId: number,
): Promise<ITeacherPermitRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return MOCK_PERMIT_RECORDS.filter((p) => p.status === 'pending')
}

export async function approvePermit(
  permitId: number,
): Promise<ITeacherPermitRecord> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const permit = MOCK_PERMIT_RECORDS.find((p) => p.id === permitId)
  if (!permit) throw new Error('Permit not found')
  return {
    ...permit,
    status: 'approved',
  }
}

export async function rejectPermit(
  permitId: number,
): Promise<ITeacherPermitRecord> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const permit = MOCK_PERMIT_RECORDS.find((p) => p.id === permitId)
  if (!permit) throw new Error('Permit not found')
  return {
    ...permit,
    status: 'rejected',
  }
}
