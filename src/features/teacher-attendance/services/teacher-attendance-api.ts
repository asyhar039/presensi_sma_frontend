import type {
  ITeacherAttendanceDetail,
  ITeacherAttendanceDetailParams,
  ITeacherAttendanceListResult,
  ITeacherAttendanceParams,
} from '@/features/teacher-attendance/types/teacher-attendance.types'
import type {
  ApiPaginateResponse,
  DropdownOption,
  DropdownSelectedParams,
} from '@/types/api.types'

import { apiClient } from '@/services/api-client'

type RawOption = { value: number | string; label: string }

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  )
}

function mapOption(item: RawOption): DropdownOption {
  return { value: String(item.value), label: item.label }
}

export function getTeachingClassroomDropdown(params: {
  search?: string
  page?: number
  page_size?: number
}) {
  return apiClient
    .get('/teacher/classrooms/dropdown', {
      params: cleanParams({
        search: params.search,
        page: params.page,
        per_page: params.page_size,
      }),
    })
    .then((res) => {
      const envelope = res.data as {
        message: string
        data: RawOption[]
        meta: ApiPaginateResponse<never>['meta']
      }
      return {
        message: envelope.message,
        data: (envelope.data ?? []).map(mapOption),
        meta: envelope.meta,
      }
    })
}

export function getTeachingClassroomDropdownSelected({
  active_ids,
}: DropdownSelectedParams) {
  if (active_ids.length === 0) return Promise.resolve([])
  return apiClient
    .get('/teacher/classrooms/dropdown/selected', {
      params: { active_ids },
      paramsSerializer: { indexes: true },
    })
    .then((res) =>
      ((res.data as { data: RawOption[] }).data ?? []).map(mapOption),
    )
}

export async function getTeacherStudentsHistory(
  params: ITeacherAttendanceParams,
): Promise<ITeacherAttendanceListResult> {
  const response = await apiClient.get('/teacher/students-history', {
    params: cleanParams(params as Record<string, unknown>),
  })
  const envelope = response.data as {
    message: string
    data: ITeacherAttendanceListResult['items']
    meta: ITeacherAttendanceListResult['meta']
  }
  return {
    items: envelope.data ?? [],
    meta: {
      page: envelope.meta?.page ?? params.page ?? 1,
      per_page: envelope.meta?.per_page ?? params.per_page ?? 10,
      total: envelope.meta?.total ?? 0,
      total_pages: envelope.meta?.total_pages ?? 0,
    },
  }
}

export async function getTeacherStudentHistoryDetail(
  studentId: number,
  params: ITeacherAttendanceDetailParams,
): Promise<ITeacherAttendanceDetail> {
  const response = await apiClient.get(
    `/teacher/students-history/${studentId}`,
    {
      params: cleanParams({ ...params }),
    },
  )
  return (response.data as { data: ITeacherAttendanceDetail }).data
}
