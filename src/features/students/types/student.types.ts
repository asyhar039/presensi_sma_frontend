export const STUDENT_GENDERS = ['male', 'female'] as const

export type StudentGender = (typeof STUDENT_GENDERS)[number]

export const STUDENT_STATUSES = [
  'active',
  'inactive',
  'graduated',
  'dropped_out',
] as const

export type StudentStatus = (typeof STUDENT_STATUSES)[number]

export type StudentSortBy = 'id' | 'name' | 'created_at'

export type StudentOrder = 'asc' | 'desc'

export interface IStudentUser {
  id: number
  identity_number: string
  name: string
  email: string
  phone_number: string | null
}

export interface IStudentLabel {
  key: string
  label: string
}

export interface IStudent {
  id: number
  user: IStudentUser
  gender: IStudentLabel
  address: string | null
  status: IStudentLabel
  created_at: string
  updated_at: string
}

export interface IStudentParams {
  page?: number
  per_page?: number
  search?: string
  gender?: string
  status?: string
  sortBy?: string
  order?: string
}

export interface IStudentPayload {
  identity_number: string
  name: string
  email: string
  phone_number?: string | null
  gender: StudentGender
  address?: string | null
  status: StudentStatus
}

export interface IStudentCreatePayload extends IStudentPayload {
  password: string
  password_confirmation: string
}

export interface IStudentPasswordPayload {
  password: string
  password_confirmation: string
}

export interface IStudentPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IStudentListResult {
  items: IStudent[]
  meta: IStudentPaginationMeta
}
