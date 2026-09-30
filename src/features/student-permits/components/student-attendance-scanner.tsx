import { IconQrcode, IconX } from '@tabler/icons-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useStudentAttendanceScanner } from '@/features/student-permits/hooks/use-student-attendance-scanner'

interface StudentAttendanceScannerProps {
  studentId: number
  studentName: string
  classroomName: string
  isOpen: boolean
  onClose: () => void
}

export function StudentAttendanceScanner({
  studentId,
  studentName,
  classroomName,
  isOpen,
  onClose,
}: StudentAttendanceScannerProps) {
  const {
    isLoading,
    error,
    success,
    scannedAttendance,
    cameraActive,
    videoRef,
    canvasRef,
    scannerError,
    startScanning,
    stopScanning,
    resetState,
    handleQRScan,
  } = useStudentAttendanceScanner(studentId)

  const [manualInput, setManualInput] = useState('')

  const handleToggleCamera = async () => {
    if (cameraActive) {
      stopScanning()
    } else {
      await startScanning()
    }
  }

  const handleManualScan = async () => {
    if (!manualInput.trim()) return
    // Call the scanner handler with manual input
    await handleQRScan(manualInput)
    setManualInput('')
  }

  const handleClose = () => {
    stopScanning()
    resetState()
    setManualInput('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scan QR Code Absensi</DialogTitle>
          <DialogDescription>
            Pindai QR code yang ditampilkan guru untuk mencatat kehadiran Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nama Siswa</p>
              <p className="font-semibold">{studentName}</p>
              <p className="text-sm text-muted-foreground">Kelas</p>
              <p className="font-semibold">{classroomName}</p>
            </div>
          </div>

          {/* Error Messages */}
          {(error || scannerError) && (
            <div className="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
              <p className="text-sm">{error || scannerError}</p>
            </div>
          )}

          {/* Success Message */}
          {success && scannedAttendance && (
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <div className="space-y-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  ✓ Presensi Berhasil Dicatat
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mata Pelajaran:
                    </span>
                    <span className="font-medium">
                      {scannedAttendance.subject_name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="bg-green-600">
                      {scannedAttendance.status === 'present'
                        ? 'Hadir'
                        : scannedAttendance.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Waktu:</span>
                    <span className="font-medium">
                      {new Date(
                        scannedAttendance.scanned_at,
                      ).toLocaleTimeString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Camera Section */}
          {!success && (
            <div className="space-y-4">
              {/* Camera Feed */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Kamera</p>
                <div className="relative w-full bg-black rounded-lg overflow-hidden">
                  {/* biome-ignore lint/a11y/useMediaCaption: Live camera preview for QR scanning has no audio or dialogue to caption. */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-80 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              {/* Camera Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={handleToggleCamera}
                  variant={cameraActive ? 'destructive' : 'default'}
                  className="flex-1"
                >
                  <IconQrcode className="mr-2 h-4 w-4" />
                  {cameraActive ? 'Hentikan Kamera' : 'Mulai Kamera'}
                </Button>
              </div>

              {/* Manual Input */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Input Manual
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Atau masukkan kode QR secara manual..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleManualScan}
                    disabled={isLoading || !manualInput.trim()}
                  >
                    {isLoading ? 'Memproses...' : 'Pindai'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button onClick={handleClose} variant="outline" className="w-full">
            <IconX className="mr-2 h-4 w-4" />
            {success ? 'Selesai' : 'Batal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
