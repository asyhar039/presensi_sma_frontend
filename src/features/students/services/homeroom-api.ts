import type {
  IHomeroom,
  IHomeroomStudent,
  IHomeroomStudentListResult,
  IHomeroomStudentParams,
} from '@/features/students/types/homeroom.types'
import type { IStudentPaginationMeta } from '@/features/students/types/student.types'

import { api, apiClient } from '@/services/api-client'

type HomeroomListEnvelope = {
  message: string
  data: IHomeroomStudent[]
  meta: IStudentPaginationMeta
}

export function getHomeroom() {
  return api.get<IHomeroom>('/homeroom')
}

export async function getHomeroomStudents(
  params: IHomeroomStudentParams,
): Promise<IHomeroomStudentListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<HomeroomListEnvelope>(
    '/homeroom/students',
    { params: cleaned },
  )
  return { items: response.data.data, meta: response.data.meta }
}

export function getHomeroomStudent(id: number) {
  return api.get<IHomeroomStudent>(`/homeroom/students/${id}`)
}
