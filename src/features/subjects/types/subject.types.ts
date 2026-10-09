export type SubjectSortBy = 'id' | 'name' | 'created_at'

export type SubjectOrder = 'asc' | 'desc'

export interface ISubject {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface ISubjectParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  order?: string
}

export interface ISubjectPayload {
  name: string
}

export interface ISubjectPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ISubjectListResult {
  items: ISubject[]
  meta: ISubjectPaginationMeta
}
