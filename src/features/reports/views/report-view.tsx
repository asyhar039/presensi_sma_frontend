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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [dateRangeTab, setDateRangeTab] = useState('1-10')
  const [selectedMonth, setSelectedMonth] = useState('10')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleExport = (type: string) => {
    toast.success(t('reports.exportingMessage', { type: type.toUpperCase() }))
  }

  const handleResetFilters = () => {
    setSelectedMonth('10')
    setSelectedYear('2026')
    setSelectedClass('all')
    setSelectedSubject('all')
    setSelectedStatus('all')
    toast.info(t('reports.resetFilterSuccess'))
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
            {t('reports.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('adminDashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <IconDownload className="size-4" />
                  <span>{t('common.export')}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                {t('reports.exportExcel')} (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                {t('reports.exportPdf')} (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                {t('reports.exportCsv')} (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.effectiveDays')}
            </CardTitle>
            <IconCalendar className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22 {t('schedules.day')}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {t('attendance.selectMonthYear')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('reports.averageAttendance')}
            </CardTitle>
            <IconChartBar className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">93.8%</div>
            <p className="text-xs text-muted-foreground pt-1">
              {t('attendance.attendancePercentage')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('adminDashboard.absent')} (&gt;3 {t('schedules.day')})
            </CardTitle>
            <IconUserExclamation className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              3 {t('students.title')}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {t('dutyTeacher.studentStatus')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('classrooms.title')}
            </CardTitle>
            <IconSchool className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">X MIPA 1</div>
            <p className="text-xs text-muted-foreground pt-1">
              {t('attendance.attendancePercentage')} (98.2%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <IconFilter className="size-4" />
            <span>{t('reports.filterTitle')}</span>
          </CardTitle>
          <CardDescription>{t('reports.filterDesc')}</CardDescription>
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
                {t('common.month')}
              </label>
              <Select
                value={selectedMonth}
                onValueChange={(val) => val && setSelectedMonth(val)}
              >
                <SelectTrigger id="report-filter-month" className="h-10 w-full">
                  <SelectValue placeholder={t('reports.selectMonth')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('months.january')}</SelectItem>
                  <SelectItem value="2">{t('months.february')}</SelectItem>
                  <SelectItem value="3">{t('months.march')}</SelectItem>
                  <SelectItem value="4">{t('months.april')}</SelectItem>
                  <SelectItem value="5">{t('months.may')}</SelectItem>
                  <SelectItem value="6">{t('months.june')}</SelectItem>
                  <SelectItem value="7">{t('months.july')}</SelectItem>
                  <SelectItem value="8">{t('months.august')}</SelectItem>
                  <SelectItem value="9">{t('months.september')}</SelectItem>
                  <SelectItem value="10">{t('months.october')}</SelectItem>
                  <SelectItem value="11">{t('months.november')}</SelectItem>
                  <SelectItem value="12">{t('months.december')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="report-filter-year"
                className="text-xs font-medium text-muted-foreground"
              >
                {t('common.year')}
              </label>
              <Select
                value={selectedYear}
                onValueChange={(val) => val && setSelectedYear(val)}
              >
                <SelectTrigger id="report-filter-year" className="h-10 w-full">
                  <SelectValue placeholder={t('reports.selectYear')} />
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
                {t('common.class')}
              </label>
              <Select
                value={selectedClass}
                onValueChange={(val) => val && setSelectedClass(val)}
              >
                <SelectTrigger id="report-filter-class" className="h-10 w-full">
                  <SelectValue placeholder={t('reports.allClasses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('reports.allClasses')}</SelectItem>
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
                {t('navigation.subject')}
              </label>
              <Select
                value={selectedSubject}
                onValueChange={(val) => val && setSelectedSubject(val)}
              >
                <SelectTrigger
                  id="report-filter-subject"
                  className="h-10 w-full"
                >
                  <SelectValue placeholder={t('reports.allSubjects')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('reports.allSubjects')}
                  </SelectItem>
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
                {t('common.status')}
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => val && setSelectedStatus(val)}
              >
                <SelectTrigger
                  id="report-filter-status"
                  className="h-10 w-full"
                >
                  <SelectValue placeholder={t('reports.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('reports.allStatuses')}
                  </SelectItem>
                  <SelectItem value="h">
                    {t('reports.presentDesc')} (H)
                  </SelectItem>
                  <SelectItem value="i">
                    {t('reports.permitDesc')} (I)
                  </SelectItem>
                  <SelectItem value="s">{t('reports.sickDesc')} (S)</SelectItem>
                  <SelectItem value="a">
                    {t('reports.absentDesc')} (A)
                  </SelectItem>
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
                {t('common.reset')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Matrix Table Section */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle>{t('reports.dailyMatrix')}</CardTitle>
            <CardDescription>{t('reports.dailyMatrixDesc')}</CardDescription>
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
                {t('reports.dateRange1_10')}
              </TabsTab>
              <TabsTab
                value="11-20"
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer',
                  dateRangeTab === '11-20' &&
                    'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80',
                )}
              >
                {t('reports.dateRange11_20')}
              </TabsTab>
              <TabsTab
                value="21-31"
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer',
                  dateRangeTab === '21-31' &&
                    'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80',
                )}
              >
                {t('reports.dateRange21_31')}
              </TabsTab>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Legend Indicators */}
          <div className="flex flex-wrap items-center gap-4 text-xs bg-muted/40 p-3 rounded-lg border">
            <span className="font-semibold text-muted-foreground">
              {t('reports.statusLegend')}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                H
              </span>
              <span>{t('reports.presentDesc')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                I
              </span>
              <span>{t('reports.permitDesc')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px]">
                S
              </span>
              <span>{t('reports.sickDesc')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-5 rounded bg-red-100 text-red-700 font-bold flex items-center justify-center text-[10px]">
                A
              </span>
              <span>{t('reports.absentDesc')}</span>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">
                    {t('reports.no')}
                  </TableHead>
                  <TableHead className="min-w-[180px]">
                    {t('reports.studentNameNis')}
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    {t('common.class')}
                  </TableHead>
                  <TableHead className="text-center">
                    {dateRangeTab === '1-10'
                      ? t('reports.dateRange1_10')
                      : dateRangeTab === '11-20'
                        ? t('reports.dateRange11_20')
                        : t('reports.dateRange21_31')}
                  </TableHead>
                  <TableHead className="text-center">H</TableHead>
                  <TableHead className="text-center">I</TableHead>
                  <TableHead className="text-center">S</TableHead>
                  <TableHead className="text-center">A</TableHead>
                  <TableHead className="text-right">
                    {t('reports.attendanceRate')}
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
            <span>
              {t('reports.showingStudents', { from: 1, to: 5, total: 36 })}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                {t('reports.previous')}
              </Button>
              <Button variant="outline" size="sm">
                {t('reports.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
