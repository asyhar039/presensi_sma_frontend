import type {
  ColumnDef,
  RowData,
  SortingState,
  Updater,
} from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { DataTableProviderProps } from './data-table-context'

import {
  flexRender,
  functionalUpdate,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getErrorMessage } from '@/utils/error'
import {
  DataTableEmptyState,
  DataTableErrorState,
  DataTableSkeletonRows,
  DataTableStateRow,
  resolveSkeletonRowCount,
} from './data-table-body'
import { DataTableProvider, useDataTable } from './data-table-context'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

export const dataTableFeatures = tableFeatures({ rowSortingFeature })

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableProps<TData extends RowData> = Omit<
  DataTableProviderProps<TData>,
  'children'
> & {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[]
  toolbar?: ReactNode
  footer?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  errorMessage?: string
}

function resolveToolbar(toolbar?: ReactNode) {
  if (toolbar === null) return null
  if (toolbar !== undefined) return toolbar
  return <DataTableToolbar />
}

function resolveFooter(footer?: ReactNode) {
  if (footer === null) return null
  if (footer !== undefined) return footer
  return <DataTablePagination />
}

interface DataTableShellProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[]
  toolbar?: ReactNode
  footer?: ReactNode
  emptyTitle: string
  emptyDescription: string
  errorMessage: string
}

function DataTableShell<TData extends RowData>({
  columns,
  toolbar,
  footer,
  emptyTitle,
  emptyDescription,
  errorMessage,
}: DataTableShellProps<TData>) {
  const {
    apiParams,
    sorting,
    setSortingState,
    items,
    perPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useDataTable<TData>()

  const table = useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    columns,
    data: items,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      setSortingState(functionalUpdate(updater, sorting))
    },
    manualSorting: true,
    key: JSON.stringify(apiParams),
  })

  const columnCount = table.getAllColumns().length
  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      {resolveToolbar(toolbar)}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBodyContent
            columnCount={columnCount}
            rowCount={rows.length}
            perPage={perPage}
            isLoading={isLoading}
            isError={isError}
            errorMessage={getErrorMessage(error, errorMessage)}
            onRetry={refetch}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          >
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBodyContent>
        </Table>
      </div>
      {resolveFooter(footer)}
    </div>
  )
}

interface DataTableBodyContentProps {
  children: ReactNode
  columnCount: number
  rowCount: number
  perPage: number
  isLoading: boolean
  isError: boolean
  errorMessage: string
  onRetry: () => void
  emptyTitle: string
  emptyDescription: string
}

function TableBodyContent({
  children,
  columnCount,
  rowCount,
  perPage,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  emptyTitle,
  emptyDescription,
}: DataTableBodyContentProps) {
  if (isLoading) {
    return (
      <TableBody>
        <DataTableSkeletonRows
          rowCount={resolveSkeletonRowCount(perPage)}
          columnCount={columnCount}
        />
      </TableBody>
    )
  }

  if (isError) {
    return (
      <TableBody>
        <DataTableStateRow columnCount={columnCount}>
          <DataTableErrorState message={errorMessage} onRetry={onRetry} />
        </DataTableStateRow>
      </TableBody>
    )
  }

  if (rowCount === 0) {
    return (
      <TableBody>
        <DataTableStateRow columnCount={columnCount}>
          <DataTableEmptyState
            title={emptyTitle}
            description={emptyDescription}
          />
        </DataTableStateRow>
      </TableBody>
    )
  }

  return <TableBody>{children}</TableBody>
}

export function DataTable<TData extends RowData>({
  columns,
  queryKey,
  queryFn,
  allowedSortBy,
  defaultSortBy,
  defaultOrder,
  defaultPage,
  defaultPerPage,
  perPageOptions,
  filterDefs,
  enableSearch,
  searchPlaceholder,
  searchDebounceMs,
  syncWithQueryParams,
  staleTime,
  toolbar,
  footer,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  errorMessage = 'Failed to load data. Please try again.',
}: DataTableProps<TData>) {
  return (
    <DataTableProvider
      queryKey={queryKey}
      queryFn={queryFn}
      allowedSortBy={allowedSortBy}
      defaultSortBy={defaultSortBy}
      defaultOrder={defaultOrder}
      defaultPage={defaultPage}
      defaultPerPage={defaultPerPage}
      perPageOptions={perPageOptions}
      filterDefs={filterDefs}
      enableSearch={enableSearch}
      searchPlaceholder={searchPlaceholder}
      searchDebounceMs={searchDebounceMs}
      syncWithQueryParams={syncWithQueryParams}
      staleTime={staleTime}
    >
      <DataTableShell
        columns={columns}
        toolbar={toolbar}
        footer={footer}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        errorMessage={errorMessage}
      />
    </DataTableProvider>
  )
}
