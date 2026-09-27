import type { IPermitRecord } from '@/features/permits/types/permit.types'

import { IconExternalLink, IconFileText } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Typography } from '@/components/ui/typography'
import { DATE_FORMAT } from '@/constants/app'
import {
  PermitStatusBadge,
  PermitTypeBadge,
} from '@/features/permits/components/permit-badges'
import { formatDate } from '@/utils/datetime'

interface PermitDetailDialogProps {
  permit: IPermitRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermitDetailDialog({
  permit,
  open,
  onOpenChange,
}: PermitDetailDialogProps) {
  if (!permit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detail Perizinan Siswa</span>
            <PermitStatusBadge status={permit.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <Typography as="p" variant="muted" className="text-xs">
              Siswa
            </Typography>
            <Typography as="h4" className="font-semibold text-base">
              {permit.student?.user?.name}
            </Typography>
            <Typography as="p" variant="muted" className="text-xs">
              NIS: {permit.student?.user?.identity_number} • Kelas:{' '}
              {permit.classroom_name}
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography
                as="span"
                variant="muted"
                className="text-xs text-muted-foreground block"
              >
                Jenis Izin
              </Typography>
              <div className="mt-1">
                <PermitTypeBadge type={permit.type} />
              </div>
            </div>
            <div>
              <Typography
                as="span"
                variant="muted"
                className="text-xs text-muted-foreground block"
              >
                Tanggal & Durasi
              </Typography>
              <Typography as="p" className="text-sm font-medium mt-1">
                {formatDate(permit.date, DATE_FORMAT.DATE)}{' '}
                {permit.duration ? `(${permit.duration})` : ''}
              </Typography>
            </div>
          </div>

          <div>
            <Typography
              as="span"
              variant="muted"
              className="text-xs text-muted-foreground block"
            >
              Alasan / Keterangan
            </Typography>
            <div className="mt-1 rounded-md border p-3 bg-background text-sm">
              {permit.reason}
            </div>
          </div>

          <div>
            <Typography
              as="span"
              variant="muted"
              className="text-xs text-muted-foreground block"
            >
              Dokumen Pendukung
            </Typography>
            <div className="mt-1">
              {permit.document_url ? (
                <a href={permit.document_url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <IconFileText className="h-4 w-4" />
                    <span>Buka Dokumen</span>
                    <IconExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </a>
              ) : (
                <Typography as="p" variant="muted" className="text-xs italic">
                  Tidak ada dokumen pendukung dilampirkan.
                </Typography>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
