import type { ReactNode } from 'react'

import { IconDatabaseOff, IconReload } from '@tabler/icons-react'

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
import { TableCell, TableRow } from '@/components/ui/table'
import {
  DATA_TABLE_DEFAULT_PER_PAGE,
  DATA_TABLE_SKELETON_MAX_ROWS,
} from './data-table-query'

export function resolveSkeletonRowCount(perPage: number): number {
  if (!Number.isFinite(perPage)) return DATA_TABLE_DEFAULT_PER_PAGE
  return Math.min(
    Math.max(Math.floor(perPage), 1),
    DATA_TABLE_SKELETON_MAX_ROWS,
  )
}

interface DataTableSkeletonRowsProps {
  rowCount: number
  columnCount: number
}

export function DataTableSkeletonRows({
  rowCount,
  columnCount,
}: DataTableSkeletonRowsProps) {
  const safeColumns = Math.max(columnCount, 1)

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: safeColumns }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

interface DataTableStateRowProps {
  columnCount: number
  children: ReactNode
}

export function DataTableStateRow({
  columnCount,
  children,
}: DataTableStateRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={Math.max(columnCount, 1)} className="py-0">
        <Empty className="border-0">{children}</Empty>
      </TableCell>
    </TableRow>
  )
}

interface DataTableErrorStateProps {
  message: string
  onRetry?: () => void
}

export function DataTableErrorState({
  message,
  onRetry,
}: DataTableErrorStateProps) {
  return (
    <>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconDatabaseOff />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={onRetry}>
            <IconReload />
            <span>Try again</span>
          </Button>
        </EmptyContent>
      )}
    </>
  )
}

interface DataTableEmptyStateProps {
  title: string
  description: string
}

export function DataTableEmptyState({
  title,
  description,
}: DataTableEmptyStateProps) {
  return (
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconDatabaseOff />
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  )
}
