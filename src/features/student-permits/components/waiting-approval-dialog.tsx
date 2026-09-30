import {
  IconClock,
  IconFileText,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Typography } from '@/components/ui/typography'

interface WaitingApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose?: () => void
}

export function WaitingApprovalDialog({
  open,
  onOpenChange,
  onClose,
}: WaitingApprovalDialogProps) {
  const handleClose = () => {
    onOpenChange(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 text-center">
        {/* Custom Close Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* Center Illustration Icon */}
        <div className="flex justify-center my-2">
          <div className="relative">
            <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-950/40">
              <IconFileText className="h-10 w-10" />
            </div>
            <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              <IconClock className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <DialogHeader className="text-center sm:text-center mt-2">
          <DialogTitle className="text-xl font-bold">
            Menunggu Persetujuan Guru Mapel
          </DialogTitle>
        </DialogHeader>

        {/* Description Body */}
        <Typography
          variant="muted"
          className="text-sm px-2 mt-2 leading-relaxed"
        >
          Pengajuan{' '}
          <span className="font-semibold text-foreground">Izin Keluar</span>{' '}
          Anda telah terkirim dan sedang menunggu persetujuan dari guru mata
          pelajaran. QR Code akan diterbitkan setelah disetujui.
        </Typography>

        {/* Info Banner */}
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-blue-50/80 p-3 text-left text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
          <IconInfoCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
          <span>
            Mohon tunggu, Anda akan mendapatkan notifikasi jika pengajuan telah
            disetujui.
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleClose}
            className="w-32 bg-primary hover:bg-primary/90"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
