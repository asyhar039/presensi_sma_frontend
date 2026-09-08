import type { DataTableSortOrder } from './data-table-types'

import { IconArrowDown, IconArrowUp, IconArrowsSort } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

export interface DataTableSortableColumn {
  toggleSorting: (desc?: boolean) => void
  getIsSorted: () => false | DataTableSortOrder
  getCanSort: () => boolean
}

export interface DataTableHeaderProps {
  column: DataTableSortableColumn
}

function SortIcon({ sorted }: { sorted: false | DataTableSortOrder }) {
  switch (sorted) {
    case 'asc':
      return <IconArrowUp className="size-3.5 text-foreground" />
    case 'desc':
      return <IconArrowDown className="size-3.5 text-foreground" />
    default:
      return <IconArrowsSort className="size-3.5 text-muted-foreground" />
  }
}

export function dataTableHeader(title: string) {
  return ({ column }: DataTableHeaderProps) => {
    const canSort = column.getCanSort()
    const sorted = column.getIsSorted()

    if (!canSort) {
      return <span>{title}</span>
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(sorted === 'asc')}
        aria-label={`Sort by ${title}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span>{title}</span>
          <SortIcon sorted={sorted} />
        </span>
      </Button>
    )
  }
}

export function dataTableHeaderActions() {
  return <span className="sr-only">Actions</span>
}
