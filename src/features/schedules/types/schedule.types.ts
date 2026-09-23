export const SCHEDULE_DAYS = [
  'senin',
  'selasa',
  'rabu',
  'kamis',
  'jumat',
] as const

export type ScheduleDay = (typeof SCHEDULE_DAYS)[number]

export const SCHEDULE_DAY_LABELS: Record<ScheduleDay, string> = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
}

export const SCHEDULE_SEMESTERS = ['ganjil', 'genap'] as const

export type ScheduleSemester = (typeof SCHEDULE_SEMESTERS)[number]

export interface IScheduleEntry {
  id: number
  day: ScheduleDay
  period: string
  start_time: string
  end_time: string
  subject: string
  subject_name?: string
  class_name: string
  room: string
  room_name?: string
  academic_year_id?: number
  semester?: ScheduleSemester
  teacher_id?: number
  created_at?: string
  updated_at?: string
}

export interface IScheduleSummary {
  total_jp: number
  total_classes: number
  class_labels: string
  special_rooms: number
  special_room_label: string
  conflicts: number
}

export interface IScheduleParams {
  page?: number
  per_page?: number
  semester?: string
  academic_year_id?: number | string
  day?: string
  search?: string
}

export interface ISchedulePaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IScheduleListResult {
  items: IScheduleEntry[]
  meta: ISchedulePaginationMeta
}

export type ScheduleViewMode = 'mingguan' | 'harian'
