import type {
  IClassSchedule,
  ICreateClassSchedulePayload,
  IUpdateClassSchedulePayload,
} from '@/features/schedules/types/schedule.types'
import type {
  ApiPaginateResponse,
  DropdownSelectedParams,
} from '@/types/api.types'

import { api, apiClient } from '@/services/api-client'

export function getClassSchedules(classroomId: number, day: string) {
  return api.get<IClassSchedule[]>('/class-schedules', {
    params: { classroom_id: classroomId, day },
  } as never)
}

export function postClassSchedule(payload: ICreateClassSchedulePayload) {
  return api.post<null>('/class-schedules', payload)
}

export function putClassSchedule(
  id: number,
  payload: IUpdateClassSchedulePayload,
) {
  return api.put<null>(`/class-schedules/${id}`, payload)
}

export function deleteClassSchedule(id: number) {
  return api.delete<null>(`/class-schedules/${id}`)
}

type RawOption = { value: number | string; label: string }

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  )
}

async function paged(
  url: string,
  params: {
    search?: string
    page?: number
    page_size?: number
    extra?: Record<string, unknown>
  },
) {
  const res = await apiClient.get(url, {
    params: cleanParams({
      search: params.search,
      page: params.page,
      per_page: params.page_size,
      ...params.extra,
    }),
  })
  const env = res.data as {
    message: string
    data: RawOption[]
    meta: ApiPaginateResponse<never>['meta']
  }
  return {
    message: env.message,
    data: env.data.map((i) => ({ value: String(i.value), label: i.label })),
    meta: env.meta,
  }
}

async function selected(url: string, { active_ids }: DropdownSelectedParams) {
  if (active_ids.length === 0) return []
  const res = await apiClient.get(url, {
    params: { active_ids },
    paramsSerializer: { indexes: true },
  })
  return (res.data as { data: RawOption[] }).data.map((i) => ({
    value: String(i.value),
    label: i.label,
  }))
}

export function getClassroomDropdown(params: {
  search?: string
  page?: number
  page_size?: number
  extra?: Record<string, unknown>
}) {
  return paged('/classrooms/dropdown', { ...params, extra: params.extra })
}

export function getClassroomDropdownByYear(academicYearId: string) {
  return (params: { search?: string; page?: number; page_size?: number }) =>
    paged('/classrooms/dropdown', {
      ...params,
      extra: { academic_year_id: academicYearId },
    })
}

export function getClassroomDropdownSelected(params: DropdownSelectedParams) {
  return selected('/classrooms/dropdown/selected', params)
}

export function getTeacherScheduleDropdown(params: {
  search?: string
  page?: number
  page_size?: number
}) {
  return paged('/teachers/dropdown', params)
}

export function getTeacherScheduleDropdownSelected(
  params: DropdownSelectedParams,
) {
  return selected('/teachers/dropdown/selected', params)
}
