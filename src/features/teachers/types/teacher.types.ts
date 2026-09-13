export const TEACHER_GENDERS = ['male', 'female'] as const

export type TeacherGender = (typeof TEACHER_GENDERS)[number]

export const TEACHER_EMPLOYMENT_STATUSES = ['pns', 'pppk', 'honorer'] as const

export type TeacherEmploymentStatus =
  (typeof TEACHER_EMPLOYMENT_STATUSES)[number]

export type TeacherSortBy = 'id' | 'name' | 'created_at'

export type TeacherOrder = 'asc' | 'desc'

export interface ITeacherUser {
  id: number
  identity_number: string
  name: string
  email: string
  phone_number: string | null
}

export interface ITeacherLabel {
  key: string
  label: string
}

export interface ITeacher {
  id: number
  user: ITeacherUser
  gender: ITeacherLabel
  address: string | null
  employment_status: ITeacherLabel
  created_at: string
  updated_at: string
}

export interface ITeacherParams {
  page?: number
  per_page?: number
  search?: string
  gender?: string
  employment_status?: string
  sortBy?: string
  order?: string
}

export interface ITeacherPayload {
  identity_number: string
  name: string
  email: string
  phone_number?: string | null
  gender: TeacherGender
  address?: string | null
  employment_status: TeacherEmploymentStatus
}

export interface ITeacherCreatePayload extends ITeacherPayload {
  password: string
  password_confirmation: string
}

export interface ITeacherPasswordPayload {
  password: string
  password_confirmation: string
}

export interface ITeacherPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ITeacherListResult {
  items: ITeacher[]
  meta: ITeacherPaginationMeta
}
