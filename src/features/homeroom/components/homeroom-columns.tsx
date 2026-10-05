import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IHomeroomLeaveItem } from '@/features/homeroom/types/homeroom.types'

import { IconDotsVertical, IconEye } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DATE_FORMAT } from '@/constants/app'
import {
  HomeroomStatusBadge,
  HomeroomTypeBadge,
} from '@/features/homeroom/components/homeroom-badges'
import { formatDate } from '@/utils/datetime'

type HomeroomColumnsProps = {
  onViewDetail: (item: IHomeroomLeaveItem) => void
}

export function useHomeroomColumns({
  onViewDetail,
}: HomeroomColumnsProps): ColumnDef<
  DataTableFeatures,
  IHomeroomLeaveItem,
  unknown
>[] {
  return useMemo(
    () => [
      {
        id: 'student',
        header: dataTableHeader('Student'),
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium whitespace-nowrap">
              {row.original.student.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.student.identity_number}
            </span>
          </div>
        ),
      },
      {
        id: 'class',
        header: dataTableHeader('Class'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.class.name}
          </span>
        ),
      },
      {
        id: 'type',
        header: dataTableHeader('Type'),
        enableSorting: false,
        cell: ({ row }) => (
          <HomeroomTypeBadge
            value={row.original.leave_request.type.key}
            label={row.original.leave_request.type.label}
          />
        ),
      },
      {
        id: 'date',
        header: dataTableHeader('Date'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium">
            {formatDate(row.original.leave_request.date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        id: 'step',
        header: dataTableHeader('Current Step'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground capitalize">
            {row.original.leave_request.current_step?.replaceAll('_', ' ') ||
              'N/A'}
          </span>
        ),
      },
      {
        id: 'status',
        header: dataTableHeader('Status'),
        enableSorting: false,
        cell: ({ row }) => (
          <HomeroomStatusBadge
            value={row.original.leave_request.status.key}
            label={row.original.leave_request.status.label}
          />
        ),
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Open row actions"
                  >
                    <IconDotsVertical />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => onViewDetail(row.original)}>
                  <IconEye />
                  <span>View detail</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onViewDetail],
  )
}
