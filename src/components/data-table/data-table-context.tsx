import type { SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type {
  DataTableApiParams,
  DataTableFilterDef,
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

import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useUpdateEffect } from '@/hooks/use-update-effect'
import {
  fromSortingState,
  getDataTableManagedKeys,
  mergeDataTableSearch,
  resolveDataTableDefaults,
  resolveDataTableState,
  serializeDataTableState,
  toSortingState,
} from './data-table-query'

export interface DataTableProviderProps<TData> {
  children: ReactNode
  queryKey: readonly unknown[]
  queryFn: DataTableQueryFn<TData>
  allowedSortBy?: readonly string[]
  defaultSortBy?: string
  defaultOrder?: DataTableSortOrder
  defaultPage?: number
  defaultPerPage?: number
  perPageOptions?: number[]
  filterDefs?: DataTableFilterDef[]
  enableSearch?: boolean
  searchPlaceholder?: string
  searchDebounceMs?: number
  syncWithQueryParams?: boolean
  staleTime?: number
}

export interface DataTableFilterBinding {
  value: string
  setValue: (value: string) => void
  def?: DataTableFilterDef
}

export interface DataTableContextValue<TData> {
  perPageOptions: number[]
  allowedSortBy: readonly string[]
  filterDefs: DataTableFilterDef[]
  enableSearch: boolean
  searchPlaceholder: string
  syncWithQueryParams: boolean
  page: number
  perPage: number
  searchInput: string
  search: string
  sortBy?: string
  order?: DataTableSortOrder
  filters: Record<string, string>
  sorting: SortingState
  apiParams: DataTableApiParams
  isFiltered: boolean
  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
  setSearchInput: (value: string) => void
  clearSearch: () => void
  setSorting: (sortBy?: string, order?: DataTableSortOrder) => void
  setSortingState: (sorting: SortingState) => void
  setFilter: (key: string, value: string) => void
  getFilter: (key: string) => string
  reset: () => void
  items: TData[]
  meta: DataTablePaginationMeta
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

const DataTableContext = createContext<DataTableContextValue<never> | null>(
  null,
)

function getDefaultFilters(filterDefs: DataTableFilterDef[]) {
  const filters: Record<string, string> = {}
  for (const def of filterDefs) filters[def.key] = def.defaultValue ?? ''
  return filters
}

export function DataTableProvider<TData>({
  children,
  queryKey,
  queryFn,
  allowedSortBy = [],
  defaultSortBy,
  defaultOrder,
  defaultPage,
  defaultPerPage,
  perPageOptions,
  filterDefs = [],
  enableSearch = true,
  searchPlaceholder = 'Search...',
  searchDebounceMs = 500,
  syncWithQueryParams = true,
  staleTime = 30_000,
}: DataTableProviderProps<TData>) {
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
      filterDefs,
    }),
    [
      allowedSortBy,
      defaultSortBy,
      defaultOrder,
      defaultPage,
      defaultPerPage,
      perPageOptions,
      filterDefs,
    ],
  )
  const configRef = useRef(config)
  configRef.current = config

  const defaults = useMemo(() => resolveDataTableDefaults(config), [config])
  const managedKeys = useMemo(
    () => getDataTableManagedKeys(filterDefs),
    [filterDefs],
  )

  const [initial] = useState(() =>
    resolveDataTableState(
      syncWithQueryParams ? routeSearch : undefined,
      config,
    ),
  )

  const [page, setPageState] = useState(initial.page)
  const [perPage, setPerPageState] = useState(initial.perPage)
  const [searchInput, setSearchInputState] = useState(initial.search)
  const [sortBy, setSortByState] = useState<string | undefined>(initial.sortBy)
  const [order, setOrderState] = useState<DataTableSortOrder | undefined>(
    initial.order,
  )
  const [filters, setFiltersState] = useState<Record<string, string>>(
    initial.filters,
  )

  const search = useDebouncedValue(searchInput, searchDebounceMs)

  useUpdateEffect(() => {
    setPageState(defaults.page)
  }, [search])

  const sorting = useMemo(() => toSortingState(sortBy, order), [sortBy, order])

  const apiParams = useMemo(
    () =>
      serializeDataTableState(
        { page, perPage, search, sortBy, order, filters },
        config,
      ),
    [page, perPage, search, sortBy, order, filters, config],
  )

  const isFiltered = useMemo(() => {
    const serialized = serializeDataTableState(
      { page: defaults.page, perPage, search, sortBy, order, filters },
      config,
    )

    return (
      serialized.search !== undefined ||
      serialized.sortBy !== undefined ||
      Object.keys(serialized).some(
        (key) =>
          key !== 'search' &&
          key !== 'sortBy' &&
          key !== 'order' &&
          key !== 'per_page',
      )
    )
  }, [defaults.page, perPage, search, sortBy, order, filters, config])

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

  const setSearchInput = useCallback((value: string) => {
    setSearchInputState(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchInputState('')
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

  const setFilter = useCallback(
    (key: string, value: string) => {
      setFiltersState((previous) => {
        if (previous[key] === value) return previous
        return { ...previous, [key]: value }
      })
      setPageState(defaults.page)
    },
    [defaults.page],
  )

  const getFilter = useCallback((key: string) => filters[key] ?? '', [filters])

  const reset = useCallback(() => {
    setSearchInputState('')
    setFiltersState(getDefaultFilters(configRef.current.filterDefs ?? []))
    setSortByState(configRef.current.defaultSortBy)
    setOrderState(
      configRef.current.defaultSortBy
        ? (configRef.current.defaultOrder ?? 'asc')
        : undefined,
    )
    setPageState(configRef.current.defaultPage ?? 1)
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
    setSearchInputState(incoming.search)
    setSortByState(incoming.sortBy)
    setOrderState(incoming.order)
    setFiltersState(incoming.filters)
  }, [routeSearch, syncWithQueryParams])

  const refetch = useCallback(() => {
    void listQuery.refetch()
  }, [listQuery])

  const value = useMemo<DataTableContextValue<TData>>(
    () => ({
      perPageOptions: defaults.perPageOptions,
      allowedSortBy,
      filterDefs,
      enableSearch,
      searchPlaceholder,
      syncWithQueryParams,
      page,
      perPage,
      searchInput,
      search,
      sortBy,
      order,
      filters,
      sorting,
      apiParams,
      isFiltered,
      setPage,
      setPerPage,
      setSearchInput,
      clearSearch,
      setSorting,
      setSortingState,
      setFilter,
      getFilter,
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
      filterDefs,
      enableSearch,
      searchPlaceholder,
      syncWithQueryParams,
      page,
      perPage,
      searchInput,
      search,
      sortBy,
      order,
      filters,
      sorting,
      apiParams,
      isFiltered,
      setPage,
      setPerPage,
      setSearchInput,
      clearSearch,
      setSorting,
      setSortingState,
      setFilter,
      getFilter,
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
    <DataTableContext.Provider value={value as DataTableContextValue<never>}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTable<TData>() {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider.')
  }

  return context as DataTableContextValue<TData>
}

export function useDataTableFilter(key: string): DataTableFilterBinding {
  const { filters, filterDefs, setFilter } = useDataTable<unknown>()
  const def = filterDefs.find((item) => item.key === key)
  const setValue = useCallback(
    (value: string) => setFilter(key, value),
    [key, setFilter],
  )
  return { value: filters[key] ?? '', setValue, def }
}
