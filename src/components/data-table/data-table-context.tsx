import type { SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type {
  DataTableApiParams,
  DataTableFilterSchema,
  DataTableFilters,
  DataTableListResult,
  DataTablePaginationMeta,
  DataTableQueryFn,
  DataTableSortOrder,
} from './data-table-types'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useUpdateEffect } from '@/hooks/use-update-effect'
import {
  fromSortingState,
  getDataTableFilterKeys,
  getDataTableManagedKeys,
  mergeDataTableSearch,
  resolveDataTableDefaults,
  resolveDataTableState,
  serializeDataTableState,
  toSortingState,
} from './data-table-query'

export interface DataTableProviderProps<
  TData,
  TFilters extends DataTableFilters = DataTableFilters,
> {
  children: ReactNode
  queryKey: readonly unknown[]
  queryFn: DataTableQueryFn<TData>
  allowedSortBy?: readonly string[]
  defaultSortBy?: string
  defaultOrder?: DataTableSortOrder
  defaultPage?: number
  defaultPerPage?: number
  perPageOptions?: number[]
  defaultFilters?: TFilters
  filterSchema?: DataTableFilterSchema<TFilters>
  enableSearch?: boolean
  searchPlaceholder?: string
  searchDebounceMs?: number
  syncWithQueryParams?: boolean
  staleTime?: number
}

export interface UseDataTableFilterOptions<TValue> {
  defaultValue?: TValue
  debounceMs?: number
}

export interface DataTableFilterBinding<TValue> {
  value: TValue
  setValue: (value: TValue) => void
  clear: () => void
  isDefault: boolean
}

export interface DataTableContextValue<
  TData,
  TFilters extends DataTableFilters = DataTableFilters,
> {
  perPageOptions: number[]
  allowedSortBy: readonly string[]
  defaultFilters: TFilters
  enableSearch: boolean
  searchPlaceholder: string
  searchDebounceMs: number
  syncWithQueryParams: boolean
  page: number
  perPage: number
  search: string
  sortBy?: string
  order?: DataTableSortOrder
  filters: TFilters
  sorting: SortingState
  apiParams: DataTableApiParams
  isFiltered: boolean
  activeFilterCount: number
  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
  setSearch: (value: string) => void
  setFilter: (key: string, value: unknown) => void
  clearSearch: () => void
  clearFilter: (key: string) => void
  clearFilters: () => void
  setSorting: (sortBy?: string, order?: DataTableSortOrder) => void
  setSortingState: (sorting: SortingState) => void
  reset: () => void
  items: TData[]
  meta: DataTablePaginationMeta
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

const DataTableContext = createContext<DataTableContextValue<
  never,
  never
> | null>(null)

const DATA_TABLE_DEFAULT_SEARCH_DEBOUNCE_MS = 500

const DATA_TABLE_SEARCH_KEY = 'search'

function areFiltersEqual<TFilters extends DataTableFilters>(
  left: TFilters,
  right: TFilters,
): boolean {
  const keys = Object.keys(right)
  if (Object.keys(left).length !== keys.length) return false
  return keys.every((key) => Object.is(left[key], right[key]))
}

export function DataTableProvider<
  TData,
  TFilters extends DataTableFilters = DataTableFilters,
>({
  children,
  queryKey,
  queryFn,
  allowedSortBy = [],
  defaultSortBy,
  defaultOrder,
  defaultPage,
  defaultPerPage,
  perPageOptions,
  defaultFilters = {} as TFilters,
  filterSchema,
  enableSearch = true,
  searchPlaceholder = 'Search...',
  searchDebounceMs = DATA_TABLE_DEFAULT_SEARCH_DEBOUNCE_MS,
  syncWithQueryParams = true,
  staleTime = 30_000,
}: DataTableProviderProps<TData, TFilters>) {
  const navigate = useNavigate()
  const routeSearch = useSearch({ strict: false }) as Record<string, unknown>

  const config = useMemo(
    () => ({
      allowedSortBy,
      defaultSortBy,
      defaultOrder,
      defaultPage,
      defaultPerPage,
      perPageOptions,
      defaultFilters,
      filterSchema,
    }),
    [
      allowedSortBy,
      defaultSortBy,
      defaultOrder,
      defaultPage,
      defaultPerPage,
      perPageOptions,
      defaultFilters,
      filterSchema,
    ],
  )
  const configRef = useRef(config)
  configRef.current = config

  const defaults = useMemo(() => resolveDataTableDefaults(config), [config])
  const filterKeys = useMemo(
    () => getDataTableFilterKeys(defaultFilters),
    [defaultFilters],
  )
  const managedKeys = useMemo(
    () => getDataTableManagedKeys(filterKeys),
    [filterKeys],
  )

  const [initial] = useState(() =>
    resolveDataTableState(
      syncWithQueryParams ? routeSearch : undefined,
      config,
    ),
  )

  const [page, setPageState] = useState(initial.page)
  const [perPage, setPerPageState] = useState(initial.perPage)
  const [search, setSearchState] = useState(initial.search)
  const [sortBy, setSortByState] = useState<string | undefined>(initial.sortBy)
  const [order, setOrderState] = useState<DataTableSortOrder | undefined>(
    initial.order,
  )
  const [filters, setFiltersState] = useState<TFilters>(initial.filters)

  const sorting = useMemo(() => toSortingState(sortBy, order), [sortBy, order])

  const apiParams = useMemo(
    () =>
      serializeDataTableState(
        { page, perPage, search, sortBy, order, filters },
        config,
      ),
    [page, perPage, search, sortBy, order, filters, config],
  )

  const { isFiltered, activeFilterCount } = useMemo(() => {
    let count = search !== '' ? 1 : 0
    for (const key of filterKeys) {
      const value = filters[key]
      const fallback = defaultFilters[key]
      if (value === undefined || value === fallback) continue
      if (value === '' && (fallback === undefined || fallback === '')) continue
      count += 1
    }
    const serialized = serializeDataTableState(
      { page: defaults.page, perPage, search, sortBy, order, filters },
      config,
    )
    return {
      isFiltered:
        serialized.search !== undefined ||
        serialized.sortBy !== undefined ||
        count > 0,
      activeFilterCount: count,
    }
  }, [
    search,
    filters,
    filterKeys,
    defaultFilters,
    defaults.page,
    perPage,
    sortBy,
    order,
    config,
  ])

  const setPage = useCallback((next: number) => {
    const normalized = Math.floor(next)
    if (!Number.isFinite(normalized)) return
    setPageState(Math.max(1, normalized))
  }, [])

  const setPerPage = useCallback(
    (next: number) => {
      if (!Number.isFinite(next)) return
      const options = defaults.perPageOptions
      if (options.length > 0 && !options.includes(next)) return
      setPerPageState(next)
      setPageState(defaults.page)
    },
    [defaults],
  )

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value)
      setPageState(defaults.page)
    },
    [defaults.page],
  )

  const setFilter = useCallback(
    (key: string, value: unknown) => {
      setFiltersState((previous) => {
        if (previous[key] === value) return previous
        return { ...previous, [key]: value }
      })
      setPageState(defaults.page)
    },
    [defaults.page],
  )

  const clearSearch = useCallback(() => {
    setSearchState('')
    setPageState(configRef.current.defaultPage ?? 1)
  }, [])

  const clearFilter = useCallback((key: string) => {
    const current = configRef.current
    const fallback = (current.defaultFilters as DataTableFilters)[key]
    setFiltersState((previous) => {
      if (previous[key] === fallback) return previous
      return { ...previous, [key]: fallback }
    })
    setPageState(current.defaultPage ?? 1)
  }, [])

  const clearFilters = useCallback(() => {
    const current = configRef.current
    setSearchState((previous) => (previous === '' ? previous : ''))
    setFiltersState((previous) =>
      areFiltersEqual(previous, current.defaultFilters)
        ? previous
        : { ...current.defaultFilters },
    )
    setPageState((previous) =>
      previous === (current.defaultPage ?? 1)
        ? previous
        : (current.defaultPage ?? 1),
    )
  }, [])

  const setSorting = useCallback(
    (nextSortBy?: string, nextOrder?: DataTableSortOrder) => {
      if (nextSortBy && !allowedSortBy.includes(nextSortBy)) return
      setSortByState(nextSortBy)
      setOrderState(nextSortBy ? (nextOrder ?? defaults.order) : undefined)
      setPageState(defaults.page)
    },
    [allowedSortBy, defaults],
  )

  const setSortingState = useCallback(
    (next: SortingState) => {
      const parsed = fromSortingState(next, allowedSortBy)
      if (next.length > 0 && !parsed.sortBy) return
      setSortByState(parsed.sortBy)
      setOrderState(
        parsed.sortBy ? (parsed.order ?? defaults.order) : undefined,
      )
      setPageState(defaults.page)
    },
    [allowedSortBy, defaults],
  )

  const reset = useCallback(() => {
    const current = configRef.current
    const currentDefaults = resolveDataTableDefaults(current)
    setSearchState((previous) => (previous === '' ? previous : ''))
    setFiltersState((previous) =>
      areFiltersEqual(previous, current.defaultFilters)
        ? previous
        : { ...current.defaultFilters },
    )
    setSortByState(current.defaultSortBy)
    setOrderState(current.defaultSortBy ? currentDefaults.order : undefined)
    setPageState(currentDefaults.page)
  }, [])

  const fullQueryKey = useMemo(
    () => [...queryKey, apiParams],
    [queryKey, apiParams],
  )

  const listQuery = useQuery({
    queryKey: fullQueryKey,
    queryFn: () => queryFn(apiParams),
    placeholderData: keepPreviousData,
    staleTime,
  })

  const items = useMemo(
    () =>
      (listQuery.data as DataTableListResult<TData> | undefined)?.items ?? [],
    [listQuery.data],
  )

  const meta: DataTablePaginationMeta = useMemo(
    () =>
      (listQuery.data as DataTableListResult<TData> | undefined)?.meta ?? {
        page,
        per_page: perPage,
        total: 0,
        total_pages: 0,
      },
    [listQuery.data, page, perPage],
  )

  const serializedKey = JSON.stringify(apiParams)
  const serializedKeyRef = useRef(serializedKey)
  serializedKeyRef.current = serializedKey
  const routeSearchRef = useRef(routeSearch)
  routeSearchRef.current = routeSearch
  const lastPushedRef = useRef<string | null>(null)

  useUpdateEffect(() => {
    if (!syncWithQueryParams) return
    const current = routeSearchRef.current
    const slice: Record<string, unknown> = {}
    for (const key of managedKeys) {
      if (current[key] !== undefined) slice[key] = current[key]
    }
    if (JSON.stringify(slice) === serializedKey) {
      lastPushedRef.current = serializedKey
      return
    }
    if (lastPushedRef.current === serializedKey) return
    lastPushedRef.current = serializedKey
    navigate({
      search: (previous: unknown) =>
        mergeDataTableSearch(previous, apiParams, managedKeys),
      replace: true,
    } as never)
  }, [serializedKey])

  useEffect(() => {
    if (!syncWithQueryParams) return
    const incoming = resolveDataTableState(
      routeSearchRef.current,
      configRef.current,
    )
    const incomingKey = JSON.stringify(
      serializeDataTableState(incoming, configRef.current),
    )
    if (incomingKey === lastPushedRef.current) return
    if (incomingKey === serializedKeyRef.current) {
      lastPushedRef.current = incomingKey
      return
    }
    lastPushedRef.current = incomingKey
    setPageState(incoming.page)
    setPerPageState(incoming.perPage)
    setSearchState(incoming.search)
    setSortByState(incoming.sortBy)
    setOrderState(incoming.order)
    setFiltersState(incoming.filters)
  }, [routeSearch, syncWithQueryParams])

  const refetch = useCallback(() => {
    void listQuery.refetch()
  }, [listQuery])

  const value = useMemo<DataTableContextValue<TData, TFilters>>(
    () => ({
      perPageOptions: defaults.perPageOptions,
      allowedSortBy,
      defaultFilters,
      enableSearch,
      searchPlaceholder,
      searchDebounceMs,
      syncWithQueryParams,
      page,
      perPage,
      search,
      sortBy,
      order,
      filters,
      sorting,
      apiParams,
      isFiltered,
      activeFilterCount,
      setPage,
      setPerPage,
      setSearch,
      setFilter,
      clearSearch,
      clearFilter,
      clearFilters,
      setSorting,
      setSortingState,
      reset,
      items,
      meta,
      isLoading: listQuery.isLoading,
      isFetching: listQuery.isFetching,
      isError: listQuery.isError,
      error: listQuery.error,
      refetch,
    }),
    [
      defaults.perPageOptions,
      allowedSortBy,
      defaultFilters,
      enableSearch,
      searchPlaceholder,
      searchDebounceMs,
      syncWithQueryParams,
      page,
      perPage,
      search,
      sortBy,
      order,
      filters,
      sorting,
      apiParams,
      isFiltered,
      activeFilterCount,
      setPage,
      setPerPage,
      setSearch,
      setFilter,
      clearSearch,
      clearFilter,
      clearFilters,
      setSorting,
      setSortingState,
      reset,
      items,
      meta,
      listQuery.isLoading,
      listQuery.isFetching,
      listQuery.isError,
      listQuery.error,
      refetch,
    ],
  )

  return (
    <DataTableContext.Provider
      value={value as DataTableContextValue<never, never>}
    >
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTable<
  TData = unknown,
  TFilters extends DataTableFilters = DataTableFilters,
>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider.')
  }

  return context as DataTableContextValue<TData, TFilters>
}

export function useDataTableFilter<TValue = string>(
  key: string,
  options?: UseDataTableFilterOptions<TValue>,
): DataTableFilterBinding<TValue> {
  const {
    defaultFilters,
    filters,
    search,
    searchDebounceMs,
    setFilter,
    setSearch,
  } = useDataTable<unknown, DataTableFilters>()

  const isSearch = key === DATA_TABLE_SEARCH_KEY
  const defaultValue = (options?.defaultValue ??
    (isSearch ? '' : defaultFilters[key])) as TValue
  const debounceMs = options?.debounceMs ?? (isSearch ? searchDebounceMs : 0)
  const committed = (
    isSearch ? search : (filters[key] ?? defaultValue)
  ) as TValue

  const [local, setLocal] = useState<TValue>(committed)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const commit = useCallback(
    (next: TValue) => {
      if (isSearch) setSearch(next as string)
      else setFilter(key, next)
    },
    [isSearch, key, setSearch, setFilter],
  )
  const commitRef = useRef(commit)
  commitRef.current = commit
  const committedRef = useRef(committed)
  committedRef.current = committed

  useEffect(() => {
    setLocal((previous) =>
      Object.is(previous, committed) ? previous : committed,
    )
  }, [committed])

  useEffect(() => () => clearTimeout(timer.current), [])

  const setValue = useCallback(
    (next: TValue) => {
      setLocal((previous) => (Object.is(previous, next) ? previous : next))
      clearTimeout(timer.current)
      timer.current = undefined
      if (Object.is(next, committedRef.current)) return
      if (!debounceMs || debounceMs <= 0) {
        commitRef.current(next)
        return
      }
      timer.current = setTimeout(() => commitRef.current(next), debounceMs)
    },
    [debounceMs],
  )

  const clear = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = undefined
    setLocal((previous) =>
      Object.is(previous, defaultValue) ? previous : defaultValue,
    )
    if (!Object.is(defaultValue, committedRef.current)) {
      commitRef.current(defaultValue)
    }
  }, [defaultValue])

  return useMemo(
    () => ({
      value: local,
      setValue,
      clear,
      isDefault: Object.is(local, defaultValue),
    }),
    [local, setValue, clear, defaultValue],
  )
}
