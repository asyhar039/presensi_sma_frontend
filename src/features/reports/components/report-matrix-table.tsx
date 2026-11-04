import type {
  IAttendanceMatrixItem,
  IAttendanceMatrixPaginationMeta,
} from '@/features/reports/types/report.types'

import { IconLoader2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

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
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
import { cn } from '@/lib/class-name'

interface ReportMatrixTableProps {
  students: IAttendanceMatrixItem[]
  isLoading: boolean
  dateRangeTab: string
  onDateRangeChange: (val: string) => void
  currentPage: number
  pageSize: number
  paginationMeta: IAttendanceMatrixPaginationMeta | null
  onPageChange: (page: number) => void
}

function getStatusBadgeClass(status: string): string {
  const norm = status.toUpperCase()
  switch (norm) {
    case 'H':
      return 'bg-emerald-100 text-emerald-700'
    case 'I':
      return 'bg-blue-100 text-blue-700'
    case 'S':
      return 'bg-amber-100 text-amber-700'
    case 'A':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function ReportMatrixTable({
  students,
  isLoading,
  dateRangeTab,
  onDateRangeChange,
  currentPage,
  pageSize,
  paginationMeta,
  onPageChange,
}: ReportMatrixTableProps) {
  const { t } = useTranslation()

  const totalItems = paginationMeta?.total ?? students.length
  const totalPages = paginationMeta?.total_pages ?? 1
  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const toIndex = Math.min(currentPage * pageSize, totalItems)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle>{t('reports.dailyMatrix')}</CardTitle>
          <CardDescription>{t('reports.dailyMatrixDesc')}</CardDescription>
        </div>
        <Tabs
          value={dateRangeTab}
          onValueChange={(val) => val && onDateRangeChange(val as string)}
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

        {/* Matrix Table */}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <IconLoader2 className="size-6 animate-spin" />
                      <span className="text-sm">{t('common.loading')}...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {t('attendance.noAttendanceData')}
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => {
                  const studentName =
                    student.name || student.student_name || '-'
                  const studentNis = student.nis || student.student_nis || '-'
                  const studentClass =
                    student.className || student.classroom_name || '-'
                  const hCount = student.h ?? student.present ?? 0
                  const iCount = student.i ?? student.permission ?? 0
                  const sCount = student.s ?? student.sick ?? 0
                  const aCount = student.a ?? student.absent ?? 0
                  const rateVal = student.rate ?? student.attendance_rate ?? 0
                  const matrixArr = Array.isArray(student.matrix)
                    ? student.matrix
                    : []

                  return (
                    <TableRow key={student.id || student.student_id || index}>
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {fromIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{studentName}</div>
                        <div className="text-xs text-muted-foreground">
                          {studentNis}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{studentClass}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {matrixArr.length > 0 ? (
                            matrixArr.map((status, i) => (
                              <span
                                key={i}
                                className={cn(
                                  'size-6 rounded font-semibold text-xs flex items-center justify-center',
                                  getStatusBadgeClass(String(status)),
                                )}
                              >
                                {String(status).toUpperCase()}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-emerald-600">
                        {hCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {iCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-amber-600">
                        {sCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-red-600">
                        {aCount}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            'font-bold px-2 py-1 rounded text-xs',
                            rateVal >= 90
                              ? 'bg-emerald-50 text-emerald-700'
                              : rateVal >= 75
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-red-50 text-red-700',
                          )}
                        >
                          {rateVal.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            {t('reports.showingStudents', {
              from: fromIndex,
              to: toIndex,
              total: totalItems,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage <= 1 || isLoading}
            >
              {t('reports.previous')}
            </Button>
            <span className="text-xs font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage >= totalPages || isLoading}
            >
              {t('reports.next')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
