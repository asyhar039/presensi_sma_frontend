export interface IPublicHoliday {
  id: number
  name: string
  date: string
  created_at: string
  updated_at: string
}

export interface ICreatePublicHolidayPayload {
  name: string
  date: string
}

export interface IUpdatePublicHolidayPayload {
  name?: string
  date?: string
}
