export interface ITeacherAttendanceStudent {
  id: number
  name: string
  email: string
  identity_number: string
}

export interface ITeacherAttendanceClass {
  id: number
  name: string
}

export interface ITeacherAttendanceCounts {
  total_effective_days: number
  present: number
  sick_leave: number
  permit: number
  alpha: number
  attendance_percentage: number
}

export interface ITeacherAttendanceItem {
  student: ITeacherAttendanceStudent
  class: ITeacherAttendanceClass
  attendance: ITeacherAttendanceCounts
}

export interface ITeacherAttendanceParams {
  classroom_id?: number
  order?: string
  page?: number
  per_page?: number
  search?: string
  semester?: string
  sortBy?: string
}

export interface ITeacherAttendanceListResult {
  items: ITeacherAttendanceItem[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export type ITeacherDayStatus =
  | 'present'
  | 'sick_leave'
  | 'permit'
  | 'alpha'
  | 'upcoming'

export interface ITeacherScheduleEntry {
  schedule_id: number
  day: string
  start_time: string
  end_time: string
  teacher: string
  status: ITeacherDayStatus
  permit_types: string[]
}

export interface ITeacherCalendarDay {
  date: string
  day: string
  is_holiday: boolean
  schedules: ITeacherScheduleEntry[]
}

export interface ITeacherAcademicYear {
  id: number
  label: string
  odd_start_date: string
  odd_end_date: string
  even_start_date: string
  even_end_date: string
  is_active: boolean
}

export interface ITeacherAttendanceDetail {
  academic_year: ITeacherAcademicYear
  student: ITeacherAttendanceItem
  attendance: ITeacherAttendanceCounts
  month: string
  calendar: ITeacherCalendarDay[]
}

export interface ITeacherAttendanceDetailParams {
  month: number
  year: number
}
