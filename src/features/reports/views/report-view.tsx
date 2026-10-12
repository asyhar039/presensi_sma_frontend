import {
  IconCalendar,
  IconChartBar,
  IconDownload,
  IconFilter,
  IconRefresh,
  IconSchool,
  IconUserExclamation,
} from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
import { cn } from '@/lib/class-name'

export function ReportView() {
  const [dateRangeTab, setDateRangeTab] = useState('1-10')
  const [selectedMonth, setSelectedMonth] = useState('10')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleExport = (type: string) => {
    toast.success(`Exporting attendance report as ${type.toUpperCase()}...`)
  }

  const handleResetFilters = () => {
    setSelectedMonth('10')
    setSelectedYear('2026')
    setSelectedClass('all')
    setSelectedSubject('all')
    setSelectedStatus('all')
    toast.info('Filter laporan berhasil direset.')
  }

  const mockStudents = [
    {
      id: 1,
      nis: '20240101',
      name: 'Aditya Pratama',
      className: 'X MIPA 1',
      matrix: ['H', 'H', 'H', 'I', 'H', 'H', 'H', 'H', 'H', 'H'],
      h: 9,
      i: 1,
      s: 0,
      a: 0,
      rate: 95.0,
    },
    {
      id: 2,
      nis: '20240102',
      name: 'Bella Safitri',
      className: 'X MIPA 1',
      matrix: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
      h: 10,
      i: 0,
      s: 0,
      a: 0,
      rate: 100.0,
    },
    {
      id: 3,
      nis: '20240103',
      name: 'Dimas Setiawan',
      className: 'X MIPA 1',
      matrix: ['H', 'A', 'A', 'A', 'H', 'H', 'H', 'S', 'H', 'H'],
      h: 6,
      i: 0,
      s: 1,
      a: 3,
      rate: 65.0,
    },
    {
      id: 4,
      nis: '20240104',
      name: 'Fani Rahmawati',
      className: 'X MIPA 1',
      matrix: ['H', 'H', 'S', 'S', 'H', 'H', 'H', 'H', 'H', 'H'],
      h: 8,
      i: 0,
      s: 2,
      a: 0,
      rate: 85.0,
    },
    {
      id: 5,
      nis: '20240105',
      name: 'Gilang Ramadhan',
      className: 'X MIPA 1',
      matrix: ['H', 'H', 'H', 'H', 'H', 'A', 'A', 'A', 'A', 'H'],
      h: 6,
      i: 0,
      s: 0,
      a: 4,
      rate: 60.0,
    },
  ]

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Laporan Presensi
          </h1>
          <p className="text-sm text-muted-foreground">
            Laporan rekapitulasi data kehadiran siswa, persentase kedisiplinan,
            dan matriks harian sekolah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <IconDownload className="size-4" />
                  <span>Export Data</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                Export Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export PDF (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Efektif</CardTitle>
            <IconCalendar className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22 Hari</div>
            <p className="text-xs text-muted-foreground pt-1">
              Periode Bulan Berjalan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Kehadiran
            </CardTitle>
            <IconChartBar className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">93.8%</div>
            <p className="text-xs text-muted-foreground pt-1">
              Tingkat kehadiran siswa seluruh kelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alpa Kronis (&gt;3 Hari)
            </CardTitle>
            <IconUserExclamation className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3 Siswa</div>
            <p className="text-xs text-muted-foreground pt-1">
              Perlu tindak lanjut pembinaan BK
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kelas Terdisiplin
            </CardTitle>
            <IconSchool className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">X MIPA 1</div>
            <p className="text-xs text-muted-foreground pt-1">
              Tingkat kehadiran tertinggi (98.2%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <IconFilter className="size-4" />
            <span>Filter Laporan Kehadiran</span>
          </CardTitle>
          <CardDescription>
            Atur filter untuk menyaring rekapitulasi data kehadiran siswa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'grid gap-4 items-end',
              'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
            )}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-month"
                className="text-xs font-medium text-muted-foreground"
              >
                Bulan
              </label>
              <Select
                value={selectedMonth}
                onValueChange={(val) => val && setSelectedMonth(val)}
              >
                <SelectTrigger id="report-filter-month" className="h-10 w-full">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Januari</SelectItem>
                  <SelectItem value="2">Februari</SelectItem>
                  <SelectItem value="3">Maret</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">Mei</SelectItem>
                  <SelectItem value="6">Juni</SelectItem>
                  <SelectItem value="7">Juli</SelectItem>
                  <SelectItem value="8">Agustus</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">Oktober</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-year"
                className="text-xs font-medium text-muted-foreground"
              >
                Tahun
              </label>
              <Select
                value={selectedYear}
                onValueChange={(val) => val && setSelectedYear(val)}
              >
                <SelectTrigger id="report-filter-year" className="h-10 w-full">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-class"
                className="text-xs font-medium text-muted-foreground"
              >
                Kelas
              </label>
              <Select
                value={selectedClass}
                onValueChange={(val) => val && setSelectedClass(val)}
              >
                <SelectTrigger id="report-filter-class" className="h-10 w-full">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  <SelectItem value="1">X MIPA 1</SelectItem>
                  <SelectItem value="2">X MIPA 2</SelectItem>
                  <SelectItem value="3">XI MIPA 1</SelectItem>
                  <SelectItem value="4">XII MIPA 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-subject"
                className="text-xs font-medium text-muted-foreground"
              >
                Mata Pelajaran
              </label>
              <Select
                value={selectedSubject}
                onValueChange={(val) => val && setSelectedSubject(val)}
              >
                <SelectTrigger
                  id="report-filter-subject"
                  className="h-10 w-full"
                >
                  <SelectValue placeholder="Semua Mapel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mapel</SelectItem>
                  <SelectItem value="math">Matematika</SelectItem>
                  <SelectItem value="phys">Fisika</SelectItem>
                  <SelectItem value="chem">Kimia</SelectItem>
                  <SelectItem value="bio">Biologi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-status"
                className="text-xs font-medium text-muted-foreground"
              >
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => val && setSelectedStatus(val)}
              >
                <SelectTrigger
                  id="report-filter-status"
                  className="h-10 w-full"
                >
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="h">Hadir (H)</SelectItem>
                  <SelectItem value="i">Izin (I)</SelectItem>
                  <SelectItem value="s">Sakit (S)</SelectItem>
                  <SelectItem value="a">Alpa (A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex items-end">
              <Button
                variant="outline"
                className="h-10 w-full"
                onClick={handleResetFilters}
              >
                <IconRefresh className="size-4 mr-1.5" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Matrix Table Section */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle>Matriks Presensi Harian</CardTitle>
            <CardDescription>
              Tabel rekapitulasi presensi harian per siswa berdasarkan tanggal
              terpilih.
            </CardDescription>
          </div>
          <Tabs
            value={dateRangeTab}
            onValueChange={(val) => setDateRangeTab(val as string)}
          >
            <TabsList className="grid h-auto grid-cols-3 gap-1 rounded-lg bg-muted/80 p-1">
              <TabsTab
                value="1-10"
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer',
                  dateRangeTab === '1-10' &&
                    'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80',
                )}
              >
                Tanggal 1–10
              </TabsTab>
              <TabsTab
                value="11-20"
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer',
                  dateRangeTab === '11-20' &&
                    'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80',
                )}
              >
                Tanggal 11–20
              </TabsTab>
              <TabsTab
                value="21-31"
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer',
                  dateRangeTab === '21-31' &&
                    'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80',
                )}
              >
                Tanggal 21–31
              </TabsTab>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Legend Indicators */}
          <div className="flex flex-wrap items-center gap-4 text-xs bg-muted/40 p-3 rounded-lg border">
            <span className="font-semibold text-muted-foreground">
              Keterangan Status:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                H
              </span>
              <span>Hadir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                I
              </span>
              <span>Izin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px]">
                S
              </span>
              <span>Sakit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-red-100 text-red-700 font-bold flex items-center justify-center text-[10px]">
                A
              </span>
              <span>Alpa (Tanpa Keterangan)</span>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead className="min-w-[180px]">
                    Nama Siswa / NIS
                  </TableHead>
                  <TableHead className="min-w-[100px]">Kelas</TableHead>
                  <TableHead className="text-center">
                    Matriks Tanggal (1–10)
                  </TableHead>
                  <TableHead className="text-center">H</TableHead>
                  <TableHead className="text-center">I</TableHead>
                  <TableHead className="text-center">S</TableHead>
                  <TableHead className="text-center">A</TableHead>
                  <TableHead className="text-right">
                    Tingkat Kehadiran
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {student.nis}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.className}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {student.matrix.map((status, i) => {
                          const bg =
                            status === 'H'
                              ? 'bg-emerald-100 text-emerald-700'
                              : status === 'I'
                                ? 'bg-blue-100 text-blue-700'
                                : status === 'S'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                          return (
                            <span
                              key={i}
                              className={cn(
                                'size-6 rounded font-semibold text-xs flex items-center justify-center',
                                bg,
                              )}
                            >
                              {status}
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-emerald-600">
                      {student.h}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-blue-600">
                      {student.i}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-amber-600">
                      {student.s}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-red-600">
                      {student.a}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-bold px-2 py-1 rounded text-xs',
                          student.rate >= 90
                            ? 'bg-emerald-50 text-emerald-700'
                            : student.rate >= 75
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-700',
                        )}
                      >
                        {student.rate.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Menampilkan 1–5 dari 36 siswa</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm">
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
