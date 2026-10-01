import type { IAttendanceLog } from '@/features/teacher-attendance/types/teacher-attendance.types'

import {
  IconCheck,
  IconCircleX,
  IconClock,
  IconRefresh,
  IconX,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Typography } from '@/components/ui/typography'
import { useTeacherAttendance } from '@/features/teacher-attendance/hooks/use-teacher-attendance'

interface TeacherAttendanceViewProps {
  classroomId: number
  classroomName: string
}

export function TeacherAttendanceView({
  classroomId,
  classroomName,
}: TeacherAttendanceViewProps) {
  const {
    qrCode,
    attendanceLogs,
    permitRecords,
    attendanceStats,
    isSessionActive,
    isLoading,
    error,
    regenerateQRCode,
    endSession,
    handleApprovePermit,
    handleRejectPermit,
  } = useTeacherAttendance(classroomId)

  const [displayLogs, setDisplayLogs] = useState<IAttendanceLog[]>([])

  useEffect(() => {
    setDisplayLogs(attendanceLogs)
  }, [attendanceLogs])

  const totalStudents =
    attendanceStats.present +
    attendanceStats.permission +
    attendanceStats.sick +
    attendanceStats.absent
  const attendancePercentage =
    totalStudents > 0
      ? Math.round((attendanceStats.present / totalStudents) * 100)
      : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
      case 'permission':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
      case 'sick':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
      case 'absent':
        return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Hadir'
      case 'permission':
        return 'Izin'
      case 'sick':
        return 'Sakit'
      case 'absent':
        return 'Alpa'
      default:
        return status
    }
  }

  const getPermitTypeLabel = (type: string) => {
    switch (type) {
      case 'sick':
        return 'Sakit'
      case 'leave_school':
        return 'Izin Keluar'
      case 'leave_in':
        return 'Terlambat'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang, Guru
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelas: <span className="font-semibold">{classroomName}</span>
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isSessionActive && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="sticky top-6 self-start lg:col-span-5">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center justify-center rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
                  <div className="flex aspect-square w-full max-w-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-3">
                    {qrCode ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrCode.code)}`}
                        alt="QR Code Kehadiran"
                        className="size-full rounded-sm object-contain"
                      />
                    ) : (
                      <div className="space-y-2 text-center">
                        <div className="text-4xl">⬜</div>
                        <p className="text-xs text-muted-foreground">QR Code</p>
                      </div>
                    )}
                  </div>
                </div>
                {qrCode && (
                  <div className="flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-center text-xs font-medium text-red-600">
                    <IconClock className="size-4" />
                    <span>
                      Berlaku hingga:{' '}
                      {new Date(qrCode.expires_at).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                onClick={regenerateQRCode}
                disabled={isLoading}
                variant="outline"
              >
                <IconRefresh className="mr-2 size-4" />
                Generate QR Baru
              </Button>
              <Button
                onClick={endSession}
                disabled={isLoading}
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <IconCircleX className="mr-2 size-4" />
                Tutup Presensi
              </Button>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Typography
                      as="p"
                      variant="small"
                      className="uppercase tracking-wide text-muted-foreground"
                    >
                      Status Kehadiran
                    </Typography>
                    <Typography as="p" variant="h1" className="mt-3 font-bold">
                      <span className="text-primary">
                        {attendanceStats.present}
                      </span>{' '}
                      <span className="text-lg font-medium">
                        / {totalStudents} Siswa Sudah Presensi
                      </span>
                    </Typography>
                  </div>
                  <Badge className="rounded-xl border border-primary/40 bg-primary/15 px-4 py-2 text-xl font-bold text-primary hover:bg-primary/15 min-h-20 min-w-24 items-center justify-center">
                    {attendancePercentage}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Log Kehadiran Real-time</CardTitle>
                <CardDescription>
                  Daftar siswa yang telah melakukan presensi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                  {displayLogs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Belum ada presensi siswa
                    </p>
                  ) : (
                    displayLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                      >
                        <div className="flex-1 space-y-1">
                          <Typography
                            as="p"
                            variant="small"
                            className="font-medium"
                          >
                            {log.student_name}
                          </Typography>
                          <Typography
                            as="p"
                            variant="muted"
                            className="text-xs"
                          >
                            NIS: {log.student_nis}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            className={getStatusColor(log.status)}
                          >
                            {getStatusLabel(log.status)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Permits Approval Table */}
      {permitRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Permohonan Izin Menunggu Persetujuan</CardTitle>
            <CardDescription>
              Tabel izin siswa yang perlu disetujui oleh wali kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>Jenis Izin</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permitRecords.map((permit) => (
                    <TableRow key={permit.id}>
                      <TableCell className="font-medium">
                        {permit.student_name}
                      </TableCell>
                      <TableCell>{permit.student_nis}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPermitTypeLabel(permit.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(permit.date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{permit.duration}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {permit.reason}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovePermit(permit.id)}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                            title="Setujui"
                          >
                            <IconCheck className="size-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectPermit(permit.id)}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                            title="Tolak"
                          >
                            <IconX className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {permitRecords.length === 0 && isSessionActive && (
        <Card>
          <CardHeader>
            <CardTitle>Permohonan Izin</CardTitle>
            <CardDescription>
              Tidak ada permohonan izin yang menunggu persetujuan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Semua permohonan izin sudah diproses
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
