import type {
  ApiPaginateResponse,
  DropdownOption,
  DropdownQueryFn,
  DropdownSelectedQueryFn,
} from '@/types/api.types'

import { IconChevronDown } from '@tabler/icons-react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxPopup,
  ComboboxPositioner,
  ComboboxStatus,
  ComboboxValue,
} from '@/components/ui/combobox'
import { Spinner } from '@/components/ui/spinner'
import { useDebounceRef } from '@/hooks/use-debounce-ref'

interface ApiComboboxOption {
  label: string
  value: string
}

interface BaseApiComboboxProps<T extends DropdownOption> {
  queryKey: string
  queryFn: DropdownQueryFn<T>
  selectedQueryFn: DropdownSelectedQueryFn<T>
  placeholder?: string
  disabled?: boolean
  pageSize?: number
}

interface SingleApiComboboxProps<T extends DropdownOption>
  extends BaseApiComboboxProps<T> {
  multiple?: false
  value?: string
  onValueChange?: (value: string | undefined) => void
}

interface MultipleApiComboboxProps<T extends DropdownOption>
  extends BaseApiComboboxProps<T> {
  multiple: true
  value?: string[]
  onValueChange?: (value: string[]) => void
}

export type ApiComboboxProps<T extends ApiComboboxOption = ApiComboboxOption> =
  | SingleApiComboboxProps<T>
  | MultipleApiComboboxProps<T>

const SEARCH_MIN_LENGTH = 3
const DEFAULT_DROPDOWN_PAGE_SIZE = 20

export function ApiCombobox<T extends ApiComboboxOption = ApiComboboxOption>({
  queryKey,
  queryFn,
  selectedQueryFn,
  placeholder = 'Search...',
  disabled = false,
  pageSize = DEFAULT_DROPDOWN_PAGE_SIZE,
  multiple,
  value,
  onValueChange,
}: ApiComboboxProps<T>) {
  const {
    value: search,
    setValue: setSearch,
    onChange: onSearchChange,
  } = useDebounceRef('', 500)

  const cacheRef = useRef(new Map<string, T>())
  const missingIdsRef = useRef<string[]>([])
  const firstRenderRef = useRef(true)
  const isFetchingNextPageRef = useRef(false)

  const resolvedIds = useMemo<string[]>(() => {
    if (value === undefined || value === null) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  if (firstRenderRef.current) {
    missingIdsRef.current = resolvedIds.filter(
      (id) => !cacheRef.current.has(id),
    )
    firstRenderRef.current = false
  }

  const { data: initialData } = useQuery<T[]>({
    queryKey: [queryKey, 'selected', missingIdsRef.current],
    queryFn: () => selectedQueryFn({ active_ids: missingIdsRef.current }),
    enabled: missingIdsRef.current.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  if (initialData) {
    for (const item of initialData) {
      cacheRef.current.set(item.value, item)
    }
  }

  const selectedObjects = useMemo<T[]>(() => {
    const result: T[] = []
    for (const resolvedId of resolvedIds) {
      const item = cacheRef.current.get(resolvedId)
      if (item) {
        result.push(item)
      }
    }
    return result
  }, [resolvedIds, initialData])

  const isSearchValid =
    search.length >= SEARCH_MIN_LENGTH || search.length === 0

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isError,
  } = useInfiniteQuery<ApiPaginateResponse<T>>({
    queryKey: [queryKey, 'list', search, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      queryFn({
        search: search,
        page: pageParam as number,
        page_size: pageSize,
      }),
    initialPageParam: 1,
    enabled: isSearchValid,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page
      const total = lastPage.meta.total_pages
      return current < total ? current + 1 : undefined
    },
  })

  const items = useMemo(() => {
    const list: T[] = []
    const seen = new Set<string>()

    for (const item of selectedObjects) {
      if (!seen.has(item.value)) {
        seen.add(item.value)
        list.push(item)
      }
    }

    if (infiniteData?.pages) {
      for (const page of infiniteData.pages) {
        if (page.data) {
          for (const item of page.data) {
            if (!seen.has(item.value)) {
              seen.add(item.value)
              list.push(item)
              cacheRef.current.set(item.value, item)
            }
          }
        }
      }
    }

    return list
  }, [infiniteData?.pages, selectedObjects])

  const handleValueChange = useCallback(
    (nextValues: T | T[] | null) => {
      if (!onValueChange) return

      if (multiple) {
        const arr = Array.isArray(nextValues) ? nextValues : []
        const values: string[] = []

        for (const item of arr) {
          cacheRef.current.set(item.value, item)
          values.push(item.value)
        }

        ;(onValueChange as (v: string[]) => void)(values)
      } else {
        const item = nextValues as T | null
        if (item) {
          cacheRef.current.set(item.value, item)
        }
        ;(onValueChange as (v: string | undefined) => void)(item?.value)
      }
    },
    [onValueChange, multiple, setSearch],
  )

  const handleOpenChangeCompleted = useCallback(() => {
    setSearch('')
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)
  const positionerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 20) {
        if (
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetchingNextPageRef.current
        ) {
          isFetchingNextPageRef.current = true
          fetchNextPage().finally(() => {
            isFetchingNextPageRef.current = false
          })
        }
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  const showLoading = isFetching && !isFetchingNextPage
  const showEmpty =
    (!isFetching && items.length === 0) ||
    (search.length > 0 && search.length < SEARCH_MIN_LENGTH)
  const currentValue = multiple
    ? selectedObjects
    : (selectedObjects?.[0] ?? null)

  return (
    <Combobox
      items={items}
      value={currentValue}
      onValueChange={handleValueChange}
      onOpenChangeComplete={handleOpenChangeCompleted}
      filter={null}
      multiple={multiple}
      disabled={disabled}
      itemToStringLabel={(item: T) => item.label}
      onInputValueChange={(val: string, { reason }) => {
        if (reason === 'input-change') {
          onSearchChange(val)
          return
        }

        if (
          [
            'close-press',
            'escape-key',
            'outside-press',
            'focus-out',
            'clear-press',
          ].includes(reason)
        ) {
          setSearch('')
        }
      }}
    >
      {multiple ? (
        <ComboboxChips ref={positionerRef}>
          <ComboboxValue>
            {(items: T[]) => (
              <>
                {items.map((item) => (
                  <ComboboxChip key={item.value} aria-label={item.value}>
                    {item.label}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                ))}
                <ComboboxInput
                  placeholder={placeholder}
                  className="flex-1 h-6 border-0 bg-transparent pl-2 text-base outline-none shadow-none focus-visible:ring-0"
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
      ) : (
        <div className="relative flex flex-col gap-2">
          <ComboboxInput placeholder={placeholder} />
          <div className="absolute right-2 bottom-0 flex h-9 items-center justify-center text-muted-foreground">
            <ComboboxClear />
            <IconChevronDown className="size-4" />
          </div>
        </div>
      )}

      <ComboboxPositioner sideOffset={6} anchor={positionerRef}>
        <ComboboxPopup>
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto overscroll-contain py-1"
          >
            {showLoading && (
              <ComboboxStatus className="flex items-center justify-center py-3 gap-2">
                <Spinner />
                <span>Loading...</span>
              </ComboboxStatus>
            )}

            {showEmpty && (
              <ComboboxEmpty className="py-6 text-center text-sm text-muted-foreground">
                {search.length > 0 && search.length < SEARCH_MIN_LENGTH
                  ? `Please enter at least ${SEARCH_MIN_LENGTH} characters...`
                  : 'No results found.'}
              </ComboboxEmpty>
            )}

            <ComboboxList>
              {(item: T) => (
                <ComboboxItem key={item.value} value={item}>
                  <ComboboxItemIndicator />
                  <div className="col-start-2">{item.label}</div>
                </ComboboxItem>
              )}
            </ComboboxList>

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground" />
              </div>
            )}

            {isError && (
              <ComboboxStatus className="py-2 text-center text-sm text-destructive">
                Failed to load options.
              </ComboboxStatus>
            )}
          </div>
        </ComboboxPopup>
      </ComboboxPositioner>
    </Combobox>
  )
}
