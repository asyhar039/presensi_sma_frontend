import type { SortingState } from '@tanstack/react-table'
import type {
  DataTableApiParams,
  DataTableFilterDef,
  DataTableQueryState,
  DataTableSortOrder,
  DataTableStateConfig,
} from './data-table-types'

import * as v from 'valibot'

export const DATA_TABLE_DEFAULT_PAGE = 1
export const DATA_TABLE_DEFAULT_PER_PAGE = 10
export const DATA_TABLE_DEFAULT_ORDER: DataTableSortOrder = 'asc'
export const DATA_TABLE_DEFAULT_PER_PAGE_OPTIONS = [10, 20, 30, 50]
export const DATA_TABLE_SEARCH_MAX_LENGTH = 100
export const DATA_TABLE_SKELETON_MAX_ROWS = 50

const BASE_MANAGED_KEYS = ['page', 'per_page', 'search', 'sortBy', 'order']

export function getDataTableManagedKeys(
  filterDefs: DataTableFilterDef[] = [],
): string[] {
  return [...BASE_MANAGED_KEYS, ...filterDefs.map((def) => def.key)]
}

export function resolveDataTableDefaults(config: DataTableStateConfig) {
  return {
    page: config.defaultPage ?? DATA_TABLE_DEFAULT_PAGE,
    perPage: config.defaultPerPage ?? DATA_TABLE_DEFAULT_PER_PAGE,
    perPageOptions:
      config.perPageOptions ?? DATA_TABLE_DEFAULT_PER_PAGE_OPTIONS,
    order: config.defaultOrder ?? DATA_TABLE_DEFAULT_ORDER,
  }
}

function toPositiveInt(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return undefined
  const normalized = Math.floor(parsed)
  return normalized > 0 ? normalized : undefined
}

function toCleanString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return String(value).slice(0, maxLength)
}

function resolveFilterValue(raw: unknown, def: DataTableFilterDef): string {
  const fallback = def.defaultValue ?? ''
  const candidate = toCleanString(raw ?? fallback, DATA_TABLE_SEARCH_MAX_LENGTH)
  if (candidate === '') return fallback === '' ? '' : fallback
  if (def.allowedValues && !def.allowedValues.includes(candidate)) {
    return fallback
  }
  if (def.validate && !def.validate(candidate)) return fallback
  return candidate
}

export function resolveDataTableState(
  raw: Record<string, unknown> | undefined,
  config: DataTableStateConfig,
): DataTableQueryState {
  const source = raw ?? {}
  const defaults = resolveDataTableDefaults(config)
  const filterDefs = config.filterDefs ?? []

  const page = toPositiveInt(source.page) ?? defaults.page

  const perPageCandidate = toPositiveInt(source.per_page)
  const perPage =
    perPageCandidate && defaults.perPageOptions.includes(perPageCandidate)
      ? perPageCandidate
      : defaults.perPage

  const search = toCleanString(
    source.search,
    DATA_TABLE_SEARCH_MAX_LENGTH,
  ).trim()

  const allowedSortBy = config.allowedSortBy ?? []
  const rawSortBy = toCleanString(source.sortBy, DATA_TABLE_SEARCH_MAX_LENGTH)
  const sortBy =
    rawSortBy !== '' && allowedSortBy.includes(rawSortBy)
      ? rawSortBy
      : config.defaultSortBy

  const rawOrder = toCleanString(source.order, DATA_TABLE_SEARCH_MAX_LENGTH)
  const order: DataTableSortOrder | undefined = sortBy
    ? rawOrder === 'asc' || rawOrder === 'desc'
      ? rawOrder
      : defaults.order
    : undefined

  const filters: Record<string, string> = {}
  for (const def of filterDefs) {
    filters[def.key] = resolveFilterValue(source[def.key], def)
  }

  return { page, perPage, search, sortBy, order, filters }
}

function isDefaultSort(
  state: DataTableQueryState,
  config: DataTableStateConfig,
): boolean {
  if (!state.sortBy) return true
  if (!config.defaultSortBy) return false
  const defaults = resolveDataTableDefaults(config)
  return state.sortBy === config.defaultSortBy && state.order === defaults.order
}

export function serializeDataTableState(
  state: DataTableQueryState,
  config: DataTableStateConfig,
): DataTableApiParams {
  const defaults = resolveDataTableDefaults(config)
  const filterDefs = config.filterDefs ?? []
  const params: DataTableApiParams = {}

  if (state.page !== defaults.page) params.page = state.page
  if (state.perPage !== defaults.perPage) params.per_page = state.perPage
  if (state.search !== '') params.search = state.search

  if (state.sortBy && !isDefaultSort(state, config)) {
    params.sortBy = state.sortBy
    params.order = state.order ?? defaults.order
  }

  for (const def of filterDefs) {
    const value = state.filters[def.key] ?? ''
    const fallback = def.defaultValue ?? ''
    if (value !== '' && value !== fallback) params[def.key] = value
  }

  return params
}

export function mergeDataTableSearch(
  previous: unknown,
  next: DataTableApiParams,
  managedKeys: readonly string[],
): Record<string, unknown> {
  const base = { ...((previous as Record<string, unknown>) ?? {}) }
  for (const key of managedKeys) delete base[key]
  return { ...base, ...next }
}

export function toSortingState(
  sortBy?: string,
  order?: DataTableSortOrder,
): SortingState {
  if (!sortBy) return []
  return [{ id: sortBy, desc: order === 'desc' }]
}

export function fromSortingState(
  sorting: SortingState,
  allowedSortBy: readonly string[] = [],
): { sortBy?: string; order?: DataTableSortOrder } {
  const first = sorting[0]
  if (!first || !allowedSortBy.includes(first.id)) return {}
  return { sortBy: first.id, order: first.desc ? 'desc' : 'asc' }
}

export interface DataTableSearchSchemaOptions {
  filterKeys?: readonly string[]
}

const searchNumber = v.optional(
  v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => Number(value)),
  ),
)

export function createDataTableSearchSchema(
  options: DataTableSearchSchemaOptions = {},
) {
  const entries: Record<string, ReturnType<typeof v.optional>> = {
    page: searchNumber,
    per_page: searchNumber,
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    order: v.optional(v.string()),
  }
  for (const key of options.filterKeys ?? []) {
    entries[key] = v.optional(v.union([v.string(), v.number()]))
  }
  return v.looseObject(entries)
}

export type DataTableSearchInput = Record<string, unknown>
