export type RoomSortBy = 'id' | 'name' | 'created_at'

export type RoomOrder = 'asc' | 'desc'

export interface IRoom {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface IRoomParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  order?: string
}

export interface IRoomPayload {
  name: string
}

export interface IRoomPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IRoomListResult {
  items: IRoom[]
  meta: IRoomPaginationMeta
}
