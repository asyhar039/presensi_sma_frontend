import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IPermitRecord } from '@/features/permits/types/permit.types'

import {
  IconDotsVertical,
  IconEye,
  IconFileText,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DATE_FORMAT } from '@/constants/app'
import {
  PermitStatusBadge,
  PermitTypeBadge,
} from '@/features/permits/components/permit-badges'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'

interface PermitActionsProps {
  item: IPermitRecord
  onViewDetail: (item: IPermitRecord) => void
}

function PermitActions({ item, onViewDetail }: PermitActionsProps) {
  const showConfirmation = useConfirmationStore((state) => state.show)

  const handleEdit = () => {
    toast.info('Permit update endpoint is not currently available.')
  }

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Hapus perizinan?',
      description: `Perizinan siswa "${item.student?.user?.name}" akan dihapus. (Fitur hapus belum tersedia pada backend).`,
      actionLabel: 'Tutup',
      hideAction: false,
      onAction: ({ close }) => {
        close()
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
            <IconDotsVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end" side="bottom" className="w-44">
        <DropdownMenuItem onClick={() => onViewDetail(item)}>
          <IconEye />
          <span>Lihat Detail</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <IconPencil />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <IconTrash />
          <span>Hapus</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface PermitColumnsProps {
  onViewDetail: (item: IPermitRecord) => void
}

export function usePermitColumns({
  onViewDetail,
}: PermitColumnsProps): ColumnDef<DataTableFeatures, IPermitRecord, unknown>[] {
  return useMemo<ColumnDef<DataTableFeatures, IPermitRecord, unknown>[]>(
    () => [
      {
        id: 'nis',
        accessorKey: 'student_id',
        header: dataTableHeader('NIS'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap text-muted-foreground">
            {row.original.student?.user?.identity_number}
          </span>
        ),
      },
      {
        id: 'name',
        header: dataTableHeader('Nama Siswa'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.student?.user?.name}
          </span>
        ),
      },
      {
        id: 'classroom',
        accessorKey: 'classroom_name',
        header: dataTableHeader('Kelas'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.classroom_name}
          </span>
        ),
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: dataTableHeader('Jenis Izin'),
        cell: ({ row }) => <PermitTypeBadge type={row.original.type} />,
      },
      {
        id: 'date',
        accessorKey: 'date',
        header: dataTableHeader('Tanggal / Durasi'),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="whitespace-nowrap font-medium">
              {formatDate(row.original.date, DATE_FORMAT.DATE)}
            </span>
            {row.original.duration && (
              <span className="text-xs text-muted-foreground">
                {row.original.duration}
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'reason',
        accessorKey: 'reason',
        header: dataTableHeader('Alasan Singkat'),
        cell: ({ row }) => (
          <span
            className="max-w-xs truncate block text-muted-foreground"
            title={row.original.reason}
          >
            {row.original.reason}
          </span>
        ),
      },
      {
        id: 'document',
        header: dataTableHeader('Dokumen'),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.document_url ? (
            <a
              href={row.original.document_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <IconFileText className="h-3.5 w-3.5" />
              Lihat
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Tidak ada
            </span>
          ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: dataTableHeader('Status'),
        cell: ({ row }) => <PermitStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <PermitActions item={row.original} onViewDetail={onViewDetail} />
          </div>
        ),
      },
    ],
    [onViewDetail],
  )
}
