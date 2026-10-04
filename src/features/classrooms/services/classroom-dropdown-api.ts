import type {
  ApiPaginateResponse,
  DropdownSelectedParams,
} from '@/types/api.types'

import { apiClient } from '@/services/api-client'

export interface IClassroomDropdownOption {
  label: string
  value: string
  email?: string
}

type RawOption = { value: number | string; label: string; email?: string }

function toOption(item: RawOption): IClassroomDropdownOption {
  return { value: String(item.value), label: item.label, email: item.email }
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
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
): Promise<ApiPaginateResponse<IClassroomDropdownOption>> {
  const response = await apiClient.get(url, {
    params: cleanParams({
      search: params.search,
      page: params.page,
      per_page: params.page_size,
      ...params.extra,
    }),
  })
  const envelope = response.data as {
    message: string
    data: RawOption[]
    meta: ApiPaginateResponse<IClassroomDropdownOption>['meta']
  }
  return {
    message: envelope.message,
    data: envelope.data.map(toOption),
    meta: envelope.meta,
  }
}

async function selected(
  url: string,
  { active_ids }: DropdownSelectedParams,
): Promise<IClassroomDropdownOption[]> {
  if (active_ids.length === 0) return []
  const response = await apiClient.get(url, {
    params: { active_ids },
    paramsSerializer: { indexes: true },
  })
  const envelope = response.data as { message: string; data: RawOption[] }
  return envelope.data.map(toOption)
}

export function getTeacherDropdown(params: {
  search?: string
  page?: number
  page_size?: number
}) {
  return paged('/teachers/dropdown', {
    ...params,
    extra: { hide_has_homeroom: true },
  })
}

export function getTeacherDropdownSelected(params: DropdownSelectedParams) {
  return selected('/teachers/dropdown/selected', params)
}

export function getStudentDropdown(params: {
  search?: string
  page?: number
  page_size?: number
}) {
  return paged('/students/dropdown', {
    ...params,
    extra: { hide_has_classroom: true },
  })
}

export function getStudentDropdownSelected(params: DropdownSelectedParams) {
  return selected('/students/dropdown/selected', params)
}

export function getAcademicYearDropdown(params: {
  search?: string
  page?: number
  page_size?: number
}) {
  return paged('/academic-years/dropdown', params)
}

export function getAcademicYearDropdownSelected(
  params: DropdownSelectedParams,
) {
  return selected('/academic-years/dropdown/selected', params)
}
