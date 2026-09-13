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
import { useDataTable } from './data-table-context'

export interface DataTablePaginationProps {
  page?: number
  perPage?: number
  total?: number
  totalPages?: number
  perPageOptions?: number[]
  isLoading?: boolean
  onPageChange?: (page: number) => void
  onPerPageChange?: (perPage: number) => void
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

interface PaginationSummaryProps {
  page: number
  perPage: number
  total: number
}

function PaginationSummary({ page, perPage, total }: PaginationSummaryProps) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <p className="text-center text-sm text-muted-foreground sm:text-left">
      Showing <span className="font-medium text-foreground">{from}</span> to{' '}
      <span className="font-medium text-foreground">{to}</span> of{' '}
      <span className="font-medium text-foreground">{total}</span> results
    </p>
  )
}

interface PerPageSelectProps {
  perPage: number
  perPageOptions: number[]
  isLoading: boolean
  onPerPageChange: (perPage: number) => void
}

function PerPageSelect({
  perPage,
  perPageOptions,
  isLoading,
  onPerPageChange,
}: PerPageSelectProps) {
  return (
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
  )
}

interface PageButtonsProps {
  page: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

function PageButtons({
  page,
  totalPages,
  isLoading,
  onPageChange,
}: PageButtonsProps) {
  const safeTotalPages = Math.max(totalPages, 1)
  const isFirstPage = page <= 1
  const isLastPage = page >= safeTotalPages
  const prevDisabled = isFirstPage || isLoading
  const nextDisabled = isLastPage || isLoading

  return (
    <Pagination className="mx-0 w-auto max-w-full overflow-x-auto h-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(event) => {
              event.preventDefault()
              if (!prevDisabled) onPageChange(page - 1)
            }}
            aria-disabled={prevDisabled}
            className={
              prevDisabled ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>

        {getPageItems(page, safeTotalPages).map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          return (
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
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={(event) => {
              event.preventDefault()
              if (!nextDisabled) onPageChange(page + 1)
            }}
            aria-disabled={nextDisabled}
            className={
              nextDisabled ? 'pointer-events-none opacity-50' : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function DataTablePagination(props: DataTablePaginationProps) {
  const table = useDataTable<unknown>()

  const page = props.page ?? table.meta.page ?? table.page
  const perPage = props.perPage ?? table.meta.per_page ?? table.perPage
  const total = props.total ?? table.meta.total ?? 0
  const totalPages = props.totalPages ?? table.meta.total_pages ?? 0
  const perPageOptions = props.perPageOptions ?? table.perPageOptions
  const isLoading = props.isLoading ?? table.isFetching
  const onPageChange = props.onPageChange ?? table.setPage
  const onPerPageChange = props.onPerPageChange ?? table.setPerPage

  return (
    <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <PaginationSummary page={page} perPage={perPage} total={total} />

      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <PerPageSelect
          perPage={perPage}
          perPageOptions={perPageOptions}
          isLoading={isLoading}
          onPerPageChange={onPerPageChange}
        />
        <PageButtons
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
