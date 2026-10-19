import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { ICalendarDay } from '@/features/student-permits/services/presence-scan-api'
import type { ILeaveRequestResult } from '@/features/student-permits/types/permit.types'

import {
  IconArrowLeft,
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
  IconQrcode,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/composite/language-switcher'
import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { DataTable, dataTableHeader } from '@/components/data-table'
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  monthlyCalendarQueryOptions,
  studentInformationQueryOptions,
} from '@/features/student-permits/lib/attendance-history-query-options'
import { studentLeaveRequestsQueryOptions } from '@/features/student-permits/lib/student-permit-query-options'
import { cn } from '@/lib/class-name'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

type HistoryViewProps = { month?: string }

const STATUS_TONE: Record<string, string> = {
  present:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sick_leave:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  permit:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  alpha: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  holiday: 'bg-muted text-muted-foreground',
  upcoming: 'bg-muted text-muted-foreground',
}

function statusTone(status: string) {
  return STATUS_TONE[status.toLowerCase()] ?? 'bg-muted text-muted-foreground'
}

function DayCell({
  day,
  selected,
  onSelect,
}: {
  day: ICalendarDay
  selected: boolean
  onSelect: () => void
}) {
  const d = dayjs(day.date)
  const primary =
    day.schedules[0]?.status.toLowerCase() ??
    (day.is_holiday === 'true' || day.is_holiday === '1'
      ? 'holiday'
      : 'upcoming')
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex min-h-16 flex-col items-start gap-1 rounded-lg border p-2 text-left transition-colors hover:bg-muted/60 md:min-h-20',
        selected && 'border-primary ring-1 ring-primary',
      )}
    >
      <span className="text-xs font-semibold">{d.format('D')}</span>
      <span
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-medium capitalize',
          statusTone(primary),
        )}
      >
        {day.is_holiday === 'true' || day.is_holiday === '1'
          ? 'Holiday'
          : primary.replaceAll('_', ' ')}
      </span>
      {day.schedules.length > 1 && (
        <span className="text-[10px] text-muted-foreground">
          +{day.schedules.length - 1} more
        </span>
      )}
    </button>
  )
}

function DayCellSkeleton() {
  return <Skeleton className="min-h-16 w-full md:min-h-20" />
}

function DetailPanel({ day }: { day: ICalendarDay | null }) {
  const { t } = useTranslation()
  if (!day) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCalendarMonth />
          </EmptyMedia>
          <EmptyTitle>{t('studentDashboard.selectDate')}</EmptyTitle>
          <EmptyDescription>
            {t('studentDashboard.selectDateDesc')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold">
          {dayjs(day.date).format('dddd, DD MMMM YYYY')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('studentDashboard.schedulesCount', {
            count: day.schedules.length,
          })}
        </p>
      </div>
      {day.schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('studentDashboard.noScheduleToday')}
        </p>
      ) : (
        <ul className="space-y-2">
          {day.schedules.map((s) => (
            <li key={s.schedule_id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {s.start_time}–{s.end_time}
                </p>
                <Badge className={cn('capitalize', statusTone(s.status))}>
                  {s.status.replaceAll('_', ' ')}
                </Badge>
              </div>
              <p className="mt-1 text-sm">{s.teacher}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {s.day}
              </p>
              {s.permit_types.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.permit_types.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-[10px] capitalize"
                    >
                      {t.replaceAll('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function StudentAttendanceHistoryView({
  month: initialMonth,
}: HistoryViewProps = {}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false }) as {
    requestId?: string | number
  }
  const [cursor, setCursor] = useState(
    () => initialMonth ?? dayjs().format('YYYY-MM'),
  )
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeQrRequest, setActiveQrRequest] =
    useState<ILeaveRequestResult | null>(null)

  const monthParam = useMemo(
    () => dayjs(`${cursor}-01`).format('YYYY-MM'),
    [cursor],
  )

  const infoQuery = useQuery(studentInformationQueryOptions())
  const calendarQuery = useQuery(monthlyCalendarQueryOptions(monthParam))
  const leaveRequestsQueryOpts = useMemo(
    () => studentLeaveRequestsQueryOptions(),
    [],
  )
  const leaveRequestsQuery = useQuery(leaveRequestsQueryOpts)

  const wrappedQueryFn = useMemo(
    () =>
      async (
        params: Record<string, string | number | undefined>,
      ): Promise<{
        items: ILeaveRequestResult[]
        meta: {
          page: number
          per_page: number
          total: number
          total_pages: number
        }
      }> => {
        const queryFn = leaveRequestsQueryOpts.queryFn
        const data = queryFn ? await queryFn({} as never) : []
        return {
          items: data ?? [],
          meta: {
            page: (params.page as number) ?? 1,
            per_page: (params.per_page as number) ?? 10,
            total: (data ?? []).length,
            total_pages: 1,
          },
        }
      },
    [leaveRequestsQueryOpts.queryFn],
  )

  const columns: ColumnDef<DataTableFeatures, ILeaveRequestResult, unknown>[] =
    useMemo(
      () => [
        {
          id: 'type',
          header: dataTableHeader(t('studentDashboard.requestType')),
          cell: ({ row }) => (
            <Badge variant="outline" className="font-medium">
              {row.original.type?.label ?? row.original.type?.key ?? 'Leave'}
            </Badge>
          ),
        },
        {
          id: 'requested_at',
          header: dataTableHeader(t('studentDashboard.submissionDateTime')),
          cell: ({ row }) => (
            <span className="text-muted-foreground">
              {row.original.requested_at
                ? formatDate(row.original.requested_at, 'DD MMM YYYY HH:mm')
                : '-'}
            </span>
          ),
        },
        {
          id: 'reason',
          header: dataTableHeader(t('studentDashboard.reasonDestination')),
          cell: ({ row }) => (
            <span className="max-w-xs truncate">
              {row.original.exit_reason ||
                row.original.late_reason ||
                row.original.notes ||
                row.original.destination ||
                '-'}
            </span>
          ),
        },
        {
          id: 'status',
          header: dataTableHeader(t('common.status')),
          cell: ({ row }) => {
            const statusKey = (row.original.status?.key ?? '').toLowerCase()
            const statusVariant =
              statusKey === 'approved'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : statusKey === 'rejected'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            return (
              <Badge className={cn('capitalize', statusVariant)}>
                {row.original.status?.label ??
                  row.original.status?.key ??
                  'Pending'}
              </Badge>
            )
          },
        },
        {
          id: 'actions',
          header: dataTableHeader(t('common.actions')),
          cell: ({ row }) => (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveQrRequest(row.original)}
              >
                <IconQrcode className="size-4" />
                {t('studentDashboard.viewPass')}
              </Button>
            </div>
          ),
        },
      ],
      [t],
    )

  const days = calendarQuery.data?.days ?? []
  const leaveRequests = leaveRequestsQuery.data ?? []

  useEffect(() => {
    if (searchParams?.requestId && leaveRequests.length > 0) {
      const found = leaveRequests.find(
        (req) =>
          String(req.id) === String(searchParams.requestId) ||
          req.key === String(searchParams.requestId),
      )
      if (found) {
        setActiveQrRequest(found)
      }
    }
  }, [searchParams, leaveRequests])

  const selected: ICalendarDay | null = useMemo(
    () =>
      days.find((d) => d.date === selectedDate) ??
      days.find((d) => d.date === dayjs().format('YYYY-MM-DD')) ??
      null,
    [days, selectedDate],
  )
  const leadingBlanks = useMemo(() => {
    if (days.length === 0) return 0
    return (dayjs(days[0].date).day() + 6) % 7
  }, [days])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('studentDashboard.historyTitle')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('studentDashboard.historySubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() =>
              setCursor((c) =>
                dayjs(`${c}-01`).subtract(1, 'month').format('YYYY-MM'),
              )
            }
          >
            <IconChevronLeft />
          </Button>
          <span className="min-w-32 text-center text-sm font-medium">
            {dayjs(`${monthParam}-01`).format('MMMM YYYY')}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() =>
              setCursor((c) =>
                dayjs(`${c}-01`).add(1, 'month').format('YYYY-MM'),
              )
            }
          >
            <IconChevronRight />
          </Button>
          <LanguageSwitcher className="size-9" />
          <ThemeSwitcher className="size-9" />
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <IconArrowLeft />
            {t('common.back')}
          </Button>
        </div>
      </div>

      {infoQuery.isPending ? (
        <Skeleton className="h-20 w-full" />
      ) : infoQuery.data ? (
        <Card>
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                {t('classrooms.title')}
              </p>
              <p className="text-sm font-medium">{infoQuery.data.class.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('studentDashboard.homeroomTeacher')}
              </p>
              <p className="text-sm font-medium">
                {infoQuery.data.class.homeroom_teacher.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('studentDashboard.academicYear')}
              </p>
              <p className="text-sm font-medium">
                {dayjs(infoQuery.data.academic_year.odd_start_date).format(
                  'YYYY',
                )}
                /
                {dayjs(infoQuery.data.academic_year.even_end_date).format(
                  'YYYY',
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('common.month')}
              </p>
              <p className="text-sm font-medium">
                {calendarQuery.data?.month ?? monthParam}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>{t('studentDashboard.monthlyCalendar')}</CardTitle>
            <CardDescription>
              {t('studentDashboard.monthlyCalendarDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-muted-foreground md:gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            {calendarQuery.isPending ? (
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <DayCellSkeleton key={i} />
                ))}
              </div>
            ) : calendarQuery.isError ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCalendarMonth />
                  </EmptyMedia>
                  <EmptyTitle>
                    {t('studentDashboard.failedLoadCalendar')}
                  </EmptyTitle>
                  <EmptyDescription>
                    {getErrorMessage(calendarQuery.error)}
                  </EmptyDescription>
                </EmptyHeader>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => calendarQuery.refetch()}
                >
                  {t('common.tryAgain')}
                </Button>
              </Empty>
            ) : days.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCalendarMonth />
                  </EmptyMedia>
                  <EmptyTitle>
                    {t('studentDashboard.noDataThisMonth')}
                  </EmptyTitle>
                  <EmptyDescription>
                    {t('studentDashboard.noDataThisMonthDesc', {
                      month: dayjs(`${monthParam}-01`).format('MMMM YYYY'),
                    })}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {Array.from({ length: leadingBlanks }).map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}
                {days.map((day) => (
                  <DayCell
                    key={day.date}
                    day={day}
                    selected={selected?.date === day.date}
                    onSelect={() => setSelectedDate(day.date)}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                'present',
                'sick_leave',
                'permit',
                'alpha',
                'holiday',
                'upcoming',
              ].map((s) => (
                <Badge key={s} className={cn('capitalize', statusTone(s))}>
                  {s.replaceAll('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('studentDashboard.dayDetail')}</CardTitle>
            <CardDescription>
              {selected
                ? dayjs(selected.date).format('DD MMMM YYYY')
                : 'Nothing selected'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calendarQuery.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <DetailPanel day={selected} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('studentDashboard.leaveRequestHistory')}</CardTitle>
          <CardDescription>
            {t('studentDashboard.leaveRequestHistoryDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={leaveRequestsQueryOpts.queryKey}
            queryFn={wrappedQueryFn}
            emptyTitle={t('studentDashboard.noLeaveRequests')}
            emptyDescription={t('studentDashboard.noLeaveRequestsDesc')}
            errorMessage={t('studentDashboard.failedLoadLeave')}
          />
        </CardContent>
      </Card>

      <ResponsiveDialog
        title={t('studentDashboard.leaveTicketQr')}
        description={t('studentDashboard.leaveTicketDesc')}
        isOpen={activeQrRequest !== null}
        onIsOpenChange={(isOpen) => {
          if (!isOpen) setActiveQrRequest(null)
        }}
      >
        {activeQrRequest && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
              <QRCodeSVG
                value={activeQrRequest.key}
                size={160}
                className="rounded"
              />
              <p className="font-mono text-sm font-semibold tracking-wider">
                {activeQrRequest.key}
              </p>
              <Badge variant="secondary">{activeQrRequest.status.label}</Badge>
            </div>
            <dl className="divide-y rounded-lg border px-3 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {activeQrRequest.type.label}
                </span>
              </div>
              {activeQrRequest.range_date &&
                activeQrRequest.range_date.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Dates</span>
                    <span className="font-medium">
                      {activeQrRequest.range_date.filter(Boolean).join(' – ') ||
                        '-'}
                    </span>
                  </div>
                )}
              {activeQrRequest.date && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{activeQrRequest.date}</span>
                </div>
              )}
              {activeQrRequest.time_out && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">
                    {activeQrRequest.time_out} – {activeQrRequest.time_in ?? ''}
                  </span>
                </div>
              )}
              {activeQrRequest.destination && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">
                    {activeQrRequest.destination}
                  </span>
                </div>
              )}
              {(activeQrRequest.exit_reason ||
                activeQrRequest.late_reason ||
                activeQrRequest.notes) && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Reason / Notes</span>
                  <span className="font-medium text-right max-w-[200px] truncate">
                    {activeQrRequest.exit_reason ||
                      activeQrRequest.late_reason ||
                      activeQrRequest.notes}
                  </span>
                </div>
              )}
            </dl>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveQrRequest(null)}>
                {t('common.close')}
              </Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>
    </div>
  )
}
