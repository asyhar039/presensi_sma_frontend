import type {
  IScheduleSlot,
  WeekDay,
} from '@/features/settings/types/schedule-clock.types'

export type { IScheduleSlot, WeekDay }

export interface IScheduleSubject {
  id: number
  name: string
}

export interface IScheduleTeacher {
  id: number
  name: string
  email: string
  subjects?: IScheduleSubject[]
}

export interface IClassSchedule {
  id: number
  classroom_id: number
  day: string
  period: number
  start_time: string
  end_time: string
  teacher: IScheduleTeacher | null
  created_at: string
  updated_at: string
}

export interface ICreateClassSchedulePayload {
  classroom_id: number
  day: string
  period: number
  start_time: string
  end_time: string
  teacher_id?: number | null
}

export interface IUpdateClassSchedulePayload {
  classroom_id?: number
  day?: string
  period?: number
  start_time?: string
  end_time?: string
  teacher_id?: number | null
}

export interface IDraftRange {
  start: string
  end: string
}

export interface ISelectedSlot {
  day: WeekDay
  classroomId: number
  draft: IDraftRange
  entry: IClassSchedule | null
}

export interface ITeacherScheduleSubject {
  id: number
  name: string
}

export interface ITeacherSchedule {
  id: number
  classroom: { id: number; name: string }
  day: string
  start_time: string
  end_time: string
  subjects: ITeacherScheduleSubject[]
}

export type ITeacherScheduleWeek = Record<WeekDay, ITeacherSchedule[]>
