export type LeaveRequestType = 'sick_leave' | 'early_out' | 'late_arrival'

export interface IAcademicYear {
  id: number
  odd_start_date: string
  odd_end_date: string
  even_start_date: string
  even_end_date: string
}

export interface IHomeroomTeacher {
  id: number
  name: string
  email: string
}

export interface IStudentClass {
  id: number
  name: string
  homeroom_teacher: IHomeroomTeacher
}

export interface IStudentInformation {
  academic_year: IAcademicYear
  class: IStudentClass
}

export interface ISchoolTime {
  start_time: string
  end_time: string
}

export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type WeeklySchedule = Record<WeekdayKey, ISchoolTime | null>

export interface IPublicHoliday {
  name: string
  date: string
}

export interface IPresenceInformation {
  time: WeeklySchedule
  public_holidays: IPublicHoliday[]
  has_early_out: boolean
  has_late_arrival: boolean
}

export interface ILeaveRequestResult {
  id: number
  key: string
  type: { key: string; label: string }
  status: { key: string; label: string }
  start_date: string | null
  end_date: string | null
  range_date: (string | null)[]
  date: string | null
  time_out: string | null
  time_in: string | null
  exit_reason: string | null
  destination: string | null
  contact_person: string | null
  estimated_arrival_time: string | null
  late_reason: string | null
  notes: string | null
  attachment: string | null
  current_step: string | null
  requested_at: string | null
}
