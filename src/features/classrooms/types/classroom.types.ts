import type { IAcademicYear } from '@/features/academic-years/types/academic-year.types'
import type { ITeacher } from '@/features/teachers/types/teacher.types'

export type ClassroomSortBy = 'id' | 'created_at'

export type ClassroomOrder = 'asc' | 'desc'

export interface IClassroomAcademicYearBrief {
  label: string
  value: number
}

export interface IClassroomHomeroomBrief {
  id: number
  name: string
  email: string
}

export interface IClassroom {
  id: number
  name: string
  academic_year: IClassroomAcademicYearBrief | null
  homeroom_teacher: IClassroomHomeroomBrief | null
  students_count: number
  created_at: string
  updated_at: string
}

export interface IClassroomDetail {
  id: number
  name: string
  academic_year: IAcademicYear | null
  homeroom_teacher: ITeacher | null
  students_count: number
  created_at: string
  updated_at: string
}

export interface IClassroomMemberUser {
  id: number
  identity_number: string
  name: string
  email: string
  phone_number: string | null
  email_verified_at: string | null
  role: string
}

export interface IClassroomMemberLabel {
  key: string
  label: string
}

export interface IClassroomMember {
  id: number
  user: IClassroomMemberUser
  gender: IClassroomMemberLabel
  address: string | null
  status: IClassroomMemberLabel
  created_at: string
  updated_at: string
}

export interface IClassroomParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  order?: string
  academic_year_id?: number | string
}

export interface IClassroomPayload {
  name: string
  academic_year_id: number
  homeroom_teacher_id?: number | null
}

export interface IClassroomMemberParams {
  page?: number
  per_page?: number
}

export interface IClassroomPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IClassroomListResult {
  items: IClassroom[]
  meta: IClassroomPaginationMeta
}

export interface IClassroomMemberListResult {
  items: IClassroomMember[]
  meta: IClassroomPaginationMeta
}
