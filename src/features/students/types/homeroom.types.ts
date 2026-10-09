import type {
  IStudent,
  IStudentListResult,
  IStudentParams,
} from '@/features/students/types/student.types'

export interface IHomeroomClass {
  id: number
  name: string
}

export interface IHomeroom {
  has_homeroom: boolean
  class: IHomeroomClass | null
}

export type IHomeroomStudent = IStudent

export type IHomeroomStudentParams = Omit<IStudentParams, 'teacher_id'>

export type IHomeroomStudentListResult = IStudentListResult
