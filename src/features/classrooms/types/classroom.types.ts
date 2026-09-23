export type ClassroomSortBy = 'id' | 'created_at'

export type ClassroomOrder = 'asc' | 'desc'

export interface IClassroomUser {
  id: number
  identity_number: string
  name: string
  email: string
  phone_number: string | null
}

export interface IClassroomAcademicYear {
  id: number
  start_date: string
  end_date: string
  semester: string
}

export interface IClassroomStudentUser {
  id: number
  name: string
}

export interface IClassroomStudent {
  id: number
  user: IClassroomStudentUser
}

export interface IClassroom {
  id: number
  name: string
  academic_year: IClassroomAcademicYear | null
  user: IClassroomUser | null
  students_count: number
  students?: IClassroomStudent[]
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
  homeroom_teacher_id: number | null
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
