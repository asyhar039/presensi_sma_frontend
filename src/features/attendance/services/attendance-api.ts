import type {
  IAttendanceListResult,
  IAttendanceParams,
  IAttendanceRecord,
  IAttendanceSummary,
  IClassOption,
  IMonthOption,
  ISemesterOption,
  IStudentAttendanceDetail,
  IStudentAttendanceSummary,
} from '@/features/attendance/types/attendance.types'

import { apiClient } from '@/services/api-client'

type AttendanceListEnvelope = {
  message: string
  data: IAttendanceRecord[]
  meta: IAttendanceListResult['meta']
}

type StudentSummaryEnvelope = {
  message: string
  data: IStudentAttendanceSummary[]
  meta: IAttendanceListResult['meta']
}

const MONTHS: IMonthOption[] = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

const SEMESTERS: ISemesterOption[] = [
  { value: 'ganjil', label: 'Semester Ganjil' },
  { value: 'genap', label: 'Semester Genap' },
]

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  )
}

export async function getAttendanceRecords(
  params: IAttendanceParams,
): Promise<IAttendanceListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<AttendanceListEnvelope>(
    '/attendance/records',
    {
      params: cleaned,
    },
  )
  return { items: response.data.data, meta: response.data.meta }
}

export async function getAttendanceSummary(
  params: Pick<IAttendanceParams, 'classroom_id' | 'month' | 'semester'>,
): Promise<IAttendanceSummary> {
  const cleaned = cleanParams(params)
  const response = await apiClient.get<{
    message: string
    data: IAttendanceSummary
  }>('/attendance/summary', { params: cleaned })
  return response.data.data
}

export async function getStudentAttendanceSummaries(
  params: IAttendanceParams,
): Promise<{
  items: IStudentAttendanceSummary[]
  meta: IAttendanceListResult['meta']
}> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<StudentSummaryEnvelope>(
    '/attendance/student-summaries',
    { params: cleaned },
  )
  return { items: response.data.data, meta: response.data.meta }
}

export async function getStudentAttendanceDetail(
  studentId: number,
  params: Pick<IAttendanceParams, 'classroom_id' | 'month' | 'semester'>,
): Promise<IStudentAttendanceDetail> {
  const cleaned = cleanParams(params)
  const response = await apiClient.get<{
    message: string
    data: IStudentAttendanceDetail
  }>(`/attendance/student/${studentId}`, { params: cleaned })
  return response.data.data
}

export async function getClassOptions(): Promise<IClassOption[]> {
  const response = await apiClient.get<{
    message: string
    data: IClassOption[]
  }>('/classrooms')
  return response.data.data
}

export async function getTeacherClassOptions(): Promise<IClassOption[]> {
  const response = await apiClient.get<{
    message: string
    data: IClassOption[]
  }>('/attendance/teacher/classrooms')
  return response.data.data
}

export async function getMonthOptions(): Promise<IMonthOption[]> {
  return MONTHS
}

export async function getSemesterOptions(): Promise<ISemesterOption[]> {
  return SEMESTERS
}
