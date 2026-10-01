import type { IAttendanceLog } from '@/features/teacher-attendance/types/teacher-attendance.types'

import { IconCheck, IconRefresh, IconX } from '@tabler/icons-react'
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
        <>
          {/* QR Code and Controls Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* QR Code Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>QR Code Kehadiran</CardTitle>
                <CardDescription>Scan untuk mencatat kehadiran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900">
                  <div className="space-y-2 text-center">
                    <div className="text-4xl">⬜</div>
                    <p className="text-xs text-muted-foreground">QR Code</p>
                  </div>
                </div>
                {qrCode && (
                  <p className="text-xs text-muted-foreground text-center">
                    Berlaku hingga:{' '}
                    {new Date(qrCode.expires_at).toLocaleTimeString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={regenerateQRCode}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <IconRefresh className="size-4 mr-2" />
                    Baru
                  </Button>
                  <Button
                    onClick={endSession}
                    disabled={isLoading}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Status Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Hadir
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {attendanceStats.present}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Izin
                      </p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {attendanceStats.permission}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Sakit
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {attendanceStats.sick}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Alpa
                      </p>
                      <p className="text-3xl font-bold text-red-600">
                        {attendanceStats.absent}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Real-time Attendance Log */}
          <Card>
            <CardHeader>
              <CardTitle>Log Kehadiran Real-time</CardTitle>
              <CardDescription>
                Daftar siswa yang telah melakukan presensi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Belum ada presensi siswa
                  </p>
                ) : (
                  displayLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">
                          {log.student_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          NIS: {log.student_nis}
                        </p>
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
        </>
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
