import { IconCheck, IconQrcode, IconX } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDutyTeacher } from '@/features/duty-teacher/hooks/use-duty-teacher'
import { useQRScanner } from '@/features/duty-teacher/hooks/use-qr-scanner'

const CLASSES = [
  { id: 1, name: 'X IPA 1' },
  { id: 2, name: 'X IPA 2' },
  { id: 3, name: 'XI IPA 1' },
  { id: 4, name: 'XII IPA 1' },
]

const STATUSES = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu Validasi' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'away', label: 'Sedang Keluar' },
  { value: 'returned', label: 'Sudah Kembali' },
]

export function DutyTeacherView() {
  const {
    leaveRequests,
    stats,
    isLoading,
    error,
    scanError,
    filters,
    updateFilters,
    handleScanQR,
    handleApprove,
    handleReject,
  } = useDutyTeacher()

  const [showScanner, setShowScanner] = useState(false)
  const [manualInput, setManualInput] = useState('')

  const handleQRScan = useCallback(
    (data: string) => {
      // Extract student ID from QR code data
      const match = data.match(/\d+/)
      if (match) {
        const studentId = parseInt(match[0], 10)
        handleScanQR(studentId, 'out')
        setManualInput('')
      }
    },
    [handleScanQR],
  )

  const {
    videoRef,
    canvasRef,
    isScanning: cameraScanning,
    error: scannerError,
    startScanning,
    stopScanning,
  } = useQRScanner(handleQRScan)

  const toggleCamera = async () => {
    if (cameraScanning) {
      stopScanning()
    } else {
      await startScanning()
    }
  }

  const handleManualScan = () => {
    if (!manualInput.trim()) return
    // Parse student ID from manual input
    const studentId = parseInt(manualInput.replace(/\D/g, ''), 10)
    if (studentId) {
      handleScanQR(studentId, 'out')
      setManualInput('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
      case 'approved':
        return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
      case 'away':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
      case 'returned':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Validasi'
      case 'approved':
        return 'Disetujui'
      case 'away':
        return 'Sedang Keluar'
      case 'returned':
        return 'Sudah Kembali'
      default:
        return status
    }
  }

  const getLeaveTypeLabel = (type: string) => {
    return type === 'school' ? 'Izin Keluar' : 'Sementara'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Piket Guru</h1>
        <p className="text-sm text-muted-foreground">
          Kelola pemindaian siswa yang izin keluar sekolah
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {scanError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <p className="text-sm font-medium">{scanError}</p>
        </div>
      )}

      {scannerError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <p className="text-sm font-medium">{scannerError}</p>
        </div>
      )}

      {/* QR Scanner Button */}
      <Button
        onClick={() => {
          setShowScanner(!showScanner)
          if (cameraScanning) {
            stopScanning()
          }
        }}
        size="lg"
        className="w-full"
        variant="default"
      >
        <IconQrcode className="size-5 mr-2" />
        {showScanner ? 'Tutup Scanner' : 'Scan QR Code Siswa'}
      </Button>

      {/* Camera Scanner */}
      {showScanner && (
        <Card>
          <CardHeader>
            <CardTitle>Pemindai QR Code Kamera</CardTitle>
            <CardDescription>
              Aktifkan kamera untuk memindai QR code siswa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Feed */}
            <div className="space-y-2">
              <div className="relative w-full bg-black rounded-lg overflow-hidden">
                {/* biome-ignore lint/a11y/useMediaCaption: Live camera preview for QR scanning has no audio or dialogue to caption. */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-96 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={toggleCamera}
                  variant={cameraScanning ? 'destructive' : 'default'}
                  className="flex-1"
                >
                  {cameraScanning ? 'Hentikan Kamera' : 'Mulai Kamera'}
                </Button>
                <Button
                  onClick={() => {
                    setShowScanner(false)
                    stopScanning()
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Tutup
                </Button>
              </div>
            </div>

            {/* Manual Input Fallback */}
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Input Manual
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Atau masukkan ID siswa secara manual..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleManualScan}
                  disabled={isLoading || !manualInput.trim()}
                >
                  Pindai
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Hari Ini
              </p>
              <p className="text-3xl font-bold">{stats.total_today}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Menunggu Validasi
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending_validation}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Disetujui
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sedang Keluar
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {stats.currently_away}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="attendance-date">Tanggal</label>
              <Input
                type="date"
                value={filters.date || ''}
                onChange={(e) => updateFilters({ date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="attendance-class">Kelas</label>
              <Select
                id="attendance-class"
                value={filters.classroom_id?.toString() || 'all'}
                onValueChange={(value) =>
                  updateFilters({
                    classroom_id: value === 'all' ? undefined : Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="attendance-status">Status</label>
              <Select
                id="attendance-status"
                value={String(filters.status || 'all')}
                onValueChange={(value) => {
                  if (value === 'all') {
                    updateFilters({})
                  } else {
                    updateFilters({ status: value as string })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Permintaan Izin Keluar</CardTitle>
          <CardDescription>
            Daftar siswa yang mengajukan izin keluar sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jenis Izin</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu Keluar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">Memuat data...</p>
                    </TableCell>
                  </TableRow>
                ) : leaveRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Tidak ada permintaan izin untuk ditampilkan
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.student_name}
                      </TableCell>
                      <TableCell>{request.student_nis}</TableCell>
                      <TableCell>{request.classroom_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getLeaveTypeLabel(request.leave_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {request.reason}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(request.status)}
                        >
                          {getStatusLabel(request.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.scanned_out_at ? (
                          <span className="text-sm">
                            {new Date(
                              request.scanned_out_at,
                            ).toLocaleTimeString()}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(request.id)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                                title="Setujui"
                              >
                                <IconCheck className="size-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                                title="Tolak"
                              >
                                <IconX className="size-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleScanQR(request.student_id, 'out')
                              }
                              disabled={isLoading}
                              className="h-8"
                            >
                              <IconQrcode className="size-4 mr-1" />
                              Pindai Keluar
                            </Button>
                          )}
                          {request.status === 'away' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleScanQR(request.student_id, 'in')
                              }
                              disabled={isLoading}
                              className="h-8"
                            >
                              <IconQrcode className="size-4 mr-1" />
                              Pindai Masuk
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
