import type {
  IClassroom,
  IClassroomDetail,
  IClassroomListResult,
  IClassroomMemberListResult,
  IClassroomMemberParams,
  IClassroomPaginationMeta,
  IClassroomParams,
  IClassroomPayload,
} from '@/features/classrooms/types/classroom.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope<T> = {
  message: string
  data: T[]
  meta: Partial<IClassroomPaginationMeta> & { limit?: number }
}

function normalizeMeta(
  meta: RawListEnvelope<unknown>['meta'],
  fallbackPerPage: number,
): IClassroomPaginationMeta {
  return {
    page: meta.page ?? 1,
    per_page: meta.per_page ?? meta.limit ?? fallbackPerPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
}

export async function getClassrooms(
  params: IClassroomParams,
): Promise<IClassroomListResult> {
  const academicYearId = Number(params.academic_year_id)
  const response = await apiClient.get<RawListEnvelope<IClassroom>>(
    '/classrooms',
    {
      params: cleanParams({
        ...params,
        academic_year_id:
          params.academic_year_id === 'all' ||
          !Number.isFinite(academicYearId) ||
          academicYearId <= 0
            ? undefined
            : academicYearId,
      }),
    },
  )
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta, params.per_page ?? 10),
  }
}

export function getClassroom(id: number) {
  return api.get<IClassroomDetail>(`/classrooms/${id}`)
}

export function postClassroom(payload: IClassroomPayload) {
  return api.post<null>('/classrooms', payload)
}

export function putClassroom(id: number, payload: Partial<IClassroomPayload>) {
  return api.put<null>(`/classrooms/${id}`, payload)
}

export function deleteClassroom(id: number) {
  return api.delete<null>(`/classrooms/${id}`)
}

export async function getClassroomMembers(
  id: number,
  params: IClassroomMemberParams,
): Promise<IClassroomMemberListResult> {
  const response = await apiClient.get<
    RawListEnvelope<IClassroomMemberListResult['items'][number]>
  >(`/classrooms/${id}/students`, { params: cleanParams({ ...params }) })
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta, params.per_page ?? 10),
  }
}

export function postClassroomMembers(id: number, studentIds: number[]) {
  return api.post<null>(`/classrooms/${id}/students`, {
    student_ids: studentIds,
  })
}

export function deleteClassroomMember(classroomId: number, studentId: number) {
  return api.delete<null>(`/classrooms/${classroomId}/students/${studentId}`)
}
