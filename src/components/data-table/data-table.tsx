import type {
  ColumnDef,
  RowData,
  SortingState,
  Updater,
} from '@tanstack/react-table'

import { IconDatabaseOff, IconReload } from '@tabler/icons-react'
import {
  flexRender,
  functionalUpdate,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dataTableFeatures = tableFeatures({ rowSortingFeature })

export type DataTableFeatures = typeof dataTableFeatures

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[]
  data: TData[]
  keys?: readonly unknown[]
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  toolbar?: React.ReactNode
  footer?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  skeletonRowCount?: number
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  keys,
  sorting = [],
  onSortingChange,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data. Please try again.',
  onRetry,
  toolbar,
  footer,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  skeletonRowCount = 8,
}: DataTableProps<TData>) {
  const table = useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    columns,
    data,
    state: { sorting },
    onSortingChange: (updater: Updater<SortingState>) => {
      onSortingChange?.(functionalUpdate(updater, sorting))
    },
    manualSorting: true,
    key: keys ? JSON.stringify(keys) : undefined,
  })

  const columnCount = table.getAllColumns().length
  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col gap-4">
      {toolbar}
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
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: Math.max(columnCount, 1) }).map(
                    (__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-0">
                  <Empty className="border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconDatabaseOff />
                      </EmptyMedia>
                      <EmptyTitle>Something went wrong</EmptyTitle>
                      <EmptyDescription>{errorMessage}</EmptyDescription>
                    </EmptyHeader>
                    {onRetry && (
                      <EmptyContent>
                        <Button variant="outline" size="sm" onClick={onRetry}>
                          <IconReload />
                          <span>Try again</span>
                        </Button>
                      </EmptyContent>
                    )}
                  </Empty>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-0">
                  <Empty className="border-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconDatabaseOff />
                      </EmptyMedia>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  )
}
