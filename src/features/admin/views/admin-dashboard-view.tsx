import dayjs from 'dayjs'
import { useMemo } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats'

export function AdminDashboardView() {
  const { user } = useAuth()
  const { totalStudents, totalTeachers, attendancePercentage, isLoading } =
    useAdminStats()

  const currentDate = useMemo(() => dayjs().format('dddd, D MMMM YYYY'), [])

  const stats = [
    {
      title: 'Jumlah Siswa',
      value: totalStudents,
      description: 'Total siswa terdaftar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Jumlah Guru',
      value: totalTeachers,
      description: 'Total guru terdaftar',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Persentase Kehadiran Hari Ini',
      value: `${attendancePercentage.toFixed(1)}%`,
      description: 'Tingkat kehadiran siswa',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Mata Pelajaran Aktif',
      value: 10,
      description: 'Sesi pelajaran aktif hari ini',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang {user?.name ? `, ${user.name}` : ''}
          </h1>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`rounded-lg ${stat.bgColor} p-4`}>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {isLoading ? <Skeleton className="h-10 w-24" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Live Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Kehadiran Langsung</CardTitle>
            <CardDescription>Status kehadiran siswa saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Hadir</span>
                </div>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Izin</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Sakit</span>
                </div>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Alpa</span>
                </div>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Kehadiran</CardTitle>
            <CardDescription>Persentase status kehadiran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hadir</span>
                  <span className="font-semibold">91.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '91%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Izin</span>
                  <span className="font-semibold">4.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: '4.5%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sakit</span>
                  <span className="font-semibold">3.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: '3%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Alpa</span>
                  <span className="font-semibold">1.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: '1.5%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
