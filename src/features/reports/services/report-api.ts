import type {
  IAttendanceMatrixPaginationMeta,
  IAttendanceMatrixResult,
  IAttendanceReportFilterParams,
  IAttendanceReportSummary,
} from '@/features/reports/types/report.types'

import { apiClient } from '@/services/api-client'

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  )
}

export async function getAttendanceReportSummary(
  params: Pick<
    IAttendanceReportFilterParams,
    'month' | 'year' | 'classroom_id'
  >,
): Promise<IAttendanceReportSummary> {
  const cleaned = cleanParams(params)
  const response = await apiClient.get<{
    message: string
    data: IAttendanceReportSummary
  }>('/reports/attendance/summary', { params: cleaned })
  return response.data.data
}

export async function getAttendanceReportMatrix(
  params: IAttendanceReportFilterParams,
): Promise<IAttendanceMatrixResult> {
  const cleaned = cleanParams({
    format: 'compact',
    ...params,
  })
  const response = await apiClient.get<{
    message: string
    data: unknown
    meta?: IAttendanceMatrixPaginationMeta
  }>('/reports/attendance/matrix', { params: cleaned })

  const envelope = response.data
  const items = Array.isArray(envelope.data)
    ? (envelope.data as IAttendanceMatrixResult['items'])
    : []

  return {
    items,
    meta: envelope.meta,
  }
}

export async function exportAttendanceReport(params: {
  type: 'excel' | 'pdf' | 'csv' | string
  month: string | number
  year: string | number
  classroom_id?: string | number
  subject_id?: string | number
  status?: string
  date_range?: string
}): Promise<void> {
  const cleaned = cleanParams(params)
  const response = await apiClient.get('/reports/attendance/export', {
    params: cleaned,
    responseType: 'blob',
  })

  // Determine file extension and MIME type
  const extension =
    params.type === 'excel' ? 'xlsx' : params.type === 'pdf' ? 'pdf' : 'csv'

  const mimeType =
    params.type === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : params.type === 'pdf'
        ? 'application/pdf'
        : 'text/csv'

  const blob = new Blob([response.data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `attendance_report_${params.year}_${params.month}_${params.classroom_id || 'all'}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
