import type { SortingState } from '@tanstack/react-table'
import type {
  DataTableApiParams,
  DataTableFilterSchema,
  DataTableFilters,
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

export function getDataTableFilterKeys<TFilters extends DataTableFilters>(
  defaultFilters: TFilters,
): string[] {
  return Object.keys(defaultFilters)
}

export function getDataTableManagedKeys(
  filterKeys: readonly string[] = [],
): string[] {
  return [...BASE_MANAGED_KEYS, ...filterKeys]
}

export function resolveDataTableDefaults<TFilters extends DataTableFilters>(
  config: DataTableStateConfig<TFilters>,
) {
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

export function sanitizeDataTableSearch(value: unknown): string {
  return toCleanString(value, DATA_TABLE_SEARCH_MAX_LENGTH).trim()
}

type FilterEntries = Record<string, v.GenericSchema>

function getFilterEntries(
  filterSchema: DataTableFilterSchema<DataTableFilters>,
): FilterEntries | undefined {
  const candidate = filterSchema as unknown as { entries?: FilterEntries }
  return candidate.entries
}

export function sanitizeDataTableFilters<TFilters extends DataTableFilters>(
  filters: TFilters,
  defaultFilters: TFilters,
  filterSchema?: DataTableFilterSchema<TFilters>,
): TFilters {
  if (!filterSchema) return filters
  const parsed = v.safeParse(filterSchema, filters)
  if (parsed.success) return parsed.output
  const entries = getFilterEntries(
    filterSchema as DataTableFilterSchema<DataTableFilters>,
  )
  if (!entries) return { ...defaultFilters }
  const sanitized: Record<string, unknown> = {}
  for (const key of Object.keys(defaultFilters)) {
    const entry = entries[key]
    if (!entry) {
      sanitized[key] = filters[key] ?? defaultFilters[key]
      continue
    }
    const value = v.safeParse(entry, filters[key])
    sanitized[key] = value.success ? value.output : defaultFilters[key]
  }
  return sanitized as TFilters
}

export function resolveDataTableState<TFilters extends DataTableFilters>(
  raw: Record<string, unknown> | undefined,
  config: DataTableStateConfig<TFilters>,
): DataTableQueryState<TFilters> {
  const source = raw ?? {}
  const defaults = resolveDataTableDefaults(config)

  const page = toPositiveInt(source.page) ?? defaults.page

  const perPageCandidate = toPositiveInt(source.per_page)
  const perPage =
    perPageCandidate && defaults.perPageOptions.includes(perPageCandidate)
      ? perPageCandidate
      : defaults.perPage

  const search = sanitizeDataTableSearch(source.search)

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

  const candidate = {} as Record<string, unknown>
  for (const key of Object.keys(config.defaultFilters)) {
    const value = source[key]
    candidate[key] = value === undefined ? config.defaultFilters[key] : value
  }
  const filters = sanitizeDataTableFilters(
    candidate as TFilters,
    config.defaultFilters,
    config.filterSchema,
  )

  return { page, perPage, search, sortBy, order, filters }
}

function isDefaultSort<TFilters extends DataTableFilters>(
  state: DataTableQueryState<TFilters>,
  config: DataTableStateConfig<TFilters>,
): boolean {
  if (!state.sortBy) return true
  if (!config.defaultSortBy) return false
  const defaults = resolveDataTableDefaults(config)
  return state.sortBy === config.defaultSortBy && state.order === defaults.order
}

function isDefaultFilterValue(value: unknown, defaultValue: unknown): boolean {
  if (value === undefined) return true
  if (value === defaultValue) return true
  if (value === '' && (defaultValue === undefined || defaultValue === ''))
    return true
  return false
}

export function serializeDataTableState<TFilters extends DataTableFilters>(
  state: DataTableQueryState<TFilters>,
  config: DataTableStateConfig<TFilters>,
): DataTableApiParams {
  const defaults = resolveDataTableDefaults(config)
  const params: DataTableApiParams = {}

  const cleanSearch = sanitizeDataTableSearch(state.search)
  if (state.page !== defaults.page) params.page = state.page
  if (state.perPage !== defaults.perPage) params.per_page = state.perPage
  if (cleanSearch !== '') params.search = cleanSearch

  if (state.sortBy && !isDefaultSort(state, config)) {
    params.sortBy = state.sortBy
    params.order = state.order ?? defaults.order
  }

  const sanitized = sanitizeDataTableFilters(
    state.filters,
    config.defaultFilters,
    config.filterSchema,
  )
  for (const key of Object.keys(config.defaultFilters)) {
    const value = sanitized[key]
    if (isDefaultFilterValue(value, config.defaultFilters[key])) continue
    if (typeof value === 'string' || typeof value === 'number') {
      params[key] = value
    }
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
  filterSchema?: DataTableFilterSchema<DataTableFilters>
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
  const entries: Record<string, v.GenericSchema> = {
    page: searchNumber,
    per_page: searchNumber,
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    order: v.optional(v.string()),
  }
  if (options.filterSchema) {
    const filterEntries = getFilterEntries(options.filterSchema)
    if (filterEntries) {
      for (const [key, entry] of Object.entries(filterEntries)) {
        entries[key] = v.optional(entry)
      }
    }
  }
  return v.looseObject(entries)
}
