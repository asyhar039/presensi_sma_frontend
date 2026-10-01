import type {
  IAttendanceScanResult,
  IStudentAttendanceScan,
} from '@/features/student-permits/types/student-attendance.types'

export async function scanAttendanceQR(
  qrData: string,
  studentId: number,
): Promise<IAttendanceScanResult> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Parse QR data format: "session_<sessionId>_<timestamp>"
  if (!qrData.includes('session_')) {
    return {
      success: false,
      message: 'Invalid QR code format',
    }
  }

  // Mock attendance record
  const scan: IStudentAttendanceScan = {
    id: Math.floor(Math.random() * 10000),
    student_id: studentId,
    session_id: qrData.split('_')[1] || 'unknown',
    scanned_at: new Date().toISOString(),
    status: 'present',
    subject_name: 'Matematika',
    classroom_name: 'XII IPA 1',
  }

  return {
    success: true,
    message: 'Presensi berhasil dicatat',
    data: scan,
  }
}
