import type { DataTablePaginationState } from './data-table-types'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DataTablePaginationProps extends DataTablePaginationState {
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  perPageOptions?: number[]
  isLoading?: boolean
}

function getPageItems(
  page: number,
  totalPages: number,
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const siblings = new Set<number>([
    1,
    2,
    page - 1,
    page,
    page + 1,
    totalPages - 1,
    totalPages,
  ])
  const pages = [...siblings]
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b)

  const items: (number | 'ellipsis')[] = []
  for (let index = 0; index < pages.length; index++) {
    if (index > 0 && pages[index] - pages[index - 1] > 1) {
      items.push('ellipsis')
    }
    items.push(pages[index])
  }

  return items
}

export function DataTablePagination({
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 30, 50],
  isLoading = false,
}: DataTablePaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  const safeTotalPages = Math.max(totalPages, 1)

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span> to{' '}
        <span className="font-medium text-foreground">{to}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span> results
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            Rows per page
          </span>
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger size="sm" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(event) => {
                  event.preventDefault()
                  if (page > 1 && !isLoading) onPageChange(page - 1)
                }}
                aria-disabled={page <= 1 || isLoading}
                className={
                  page <= 1 || isLoading
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>

            {getPageItems(page, safeTotalPages).map((item, index) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === page}
                    onClick={(event) => {
                      event.preventDefault()
                      if (!isLoading) onPageChange(item)
                    }}
                    className="hidden sm:inline-flex"
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={(event) => {
                  event.preventDefault()
                  if (page < safeTotalPages && !isLoading)
                    onPageChange(page + 1)
                }}
                aria-disabled={page >= safeTotalPages || isLoading}
                className={
                  page >= safeTotalPages || isLoading
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
