import type { IScheduleEntry } from '@/features/schedules/types/schedule.types'

import {
  IconCalendar,
  IconClock,
  IconDoor,
  IconDownload,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/auth-context'
import {
  PERIOD_ROWS,
  WEEK_DAYS,
  pickScheduleStyle,
} from '@/features/schedules/lib/schedule-timetable'
import {
  exportSchedules,
  getScheduleSummary,
  getSchedules,
} from '@/features/schedules/services/schedule-api'
import { useScheduleViewStore } from '@/features/schedules/stores/schedule-view-store'

function useSchedulesQuery(semester: string) {
  return useQuery({
    queryKey: ['schedules', { semester }],
    queryFn: () =>
      getSchedules({
        semester: semester === 'all' ? undefined : semester,
        per_page: 200,
      }),
    staleTime: 30_000,
  })
}

function SummaryCards({
  items,
  summary,
}: {
  items: IScheduleEntry[]
  summary: ReturnType<typeof useQuery>['data']
}) {
  const totalJp =
    summary && typeof summary === 'object' && 'total_jp' in (summary as object)
      ? (summary as { total_jp: number }).total_jp
      : items.length
  const distinctClasses = new Set(items.map((i) => i.class_name)).size || 0
  const specialRooms = new Set(
    items.map((i) => i.room).filter((r) => /lab|lapangan/i.test(r)),
  ).size
  const conflicts = (() => {
    const seen = new Map<string, number>()
    let c = 0
    for (const it of items) {
      const k = `${it.day}-${it.start_time}-${it.end_time}`
      const n = seen.get(k) ?? 0
      if (n > 0) c += 1
      seen.set(k, n + 1)
    }
    return c
  })()

  const classLabel =
    summary &&
    typeof summary === 'object' &&
    'class_labels' in (summary as object)
      ? String((summary as { class_labels: string }).class_labels)
      : distinctClasses > 0
        ? `${distinctClasses} Kelas · X, XI, XII`
        : '—'

  const specialLabel =
    summary &&
    typeof summary === 'object' &&
    'special_room_label' in (summary as object)
      ? String((summary as { special_room_label: string }).special_room_label)
      : 'Lab & Lapangan'

  const isOptimal = conflicts === 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            TOTAL JAM MENGAJAR
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {totalJp.toLocaleString('id-ID')} JP
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
            <span aria-hidden>↑</span> 100% Terisi
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            JUMLAH KELAS
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {distinctClasses} Kelas
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{classLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            RUANG KHUSUS AKTIF
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {specialRooms} Ruangan
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{specialLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            STATUS JADWAL
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-2xl font-bold tracking-tight">
              {conflicts} Bentrok
            </p>
            <Badge
              variant={isOptimal ? 'default' : 'destructive'}
              className={
                isOptimal
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : undefined
              }
            >
              {isOptimal ? 'Optimal' : 'Perlu tinjau'}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {isOptimal ? 'Tidak ada konflik' : 'Ada jadwal bertabrakan'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ScheduleCell({ entry }: { entry: IScheduleEntry | null }) {
  if (!entry) {
    return (
      <div className="min-h-[76px] rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-3 text-[11px] text-muted-foreground">
        Terisi
      </div>
    )
  }
  const style = pickScheduleStyle(entry.subject)
  return (
    <div
      className={`min-h-[76px] rounded-lg border px-3 py-2.5 ${style.bg} ${style.border}`}
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1 size-1.5 shrink-0 rounded-full ${style.dot}`} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-4">
            {entry.subject}
          </p>
          <p className="truncate text-[11px] leading-4 text-muted-foreground">
            {entry.class_name}
          </p>
          <p className="mt-1 flex items-center gap-1 truncate text-[11px] leading-4 text-muted-foreground">
            <IconDoor className="size-3 shrink-0" />
            <span className="truncate">{entry.room}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function WeeklyTimetable({ items }: { items: IScheduleEntry[] }) {
  const bySlot = useMemo(() => {
    const m = new Map<string, IScheduleEntry>()
    for (const it of items) {
      const day = (it.day ?? '').toLowerCase()
      for (const row of PERIOD_ROWS) {
        if (row.kind !== 'period') continue
        if (it.start_time === row.start && it.end_time === row.end) {
          m.set(`${day}::${row.key}`, it)
        }
      }
      const k1 = `${day}::${it.period ?? ''}`
      if (it.period && !m.has(k1)) m.set(k1, it)
    }
    return m
  }, [items])

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[96px_repeat(5,minmax(0,1fr))] gap-px bg-border">
            <div className="bg-muted px-3 py-3 text-[11px] font-semibold tracking-widest text-muted-foreground">
              TIME
            </div>
            {WEEK_DAYS.map((d) => (
              <div
                key={d.key}
                className="bg-muted px-3 py-3 text-center text-[11px] font-semibold tracking-widest text-muted-foreground"
              >
                {d.label}
              </div>
            ))}
          </div>

          <div className="grid gap-px bg-border">
            {PERIOD_ROWS.map((row) => {
              if (row.kind === 'break') {
                return (
                  <div
                    key={row.key}
                    className="grid grid-cols-[96px_1fr] gap-px bg-border"
                  >
                    <div className="flex flex-col justify-center bg-card px-3 py-3">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {row.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-center bg-amber-50 px-3 py-3 text-[11px] font-semibold tracking-[0.18em] text-amber-700">
                      {row.label}
                    </div>
                  </div>
                )
              }
              return (
                <div
                  key={row.key}
                  className="grid grid-cols-[96px_repeat(5,minmax(0,1fr))] gap-px bg-border"
                >
                  <div className="flex flex-col justify-center gap-0.5 bg-card px-3 py-3">
                    <span className="text-[11px] font-semibold">
                      {row.label}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <IconClock className="size-3" />
                      {row.time}
                    </span>
                  </div>
                  {WEEK_DAYS.map((d) => {
                    const entry = bySlot.get(`${d.key}::${row.key}`) ?? null
                    return (
                      <div key={`${row.key}-${d.key}`} className="bg-card p-2">
                        <ScheduleCell entry={entry} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}

function DailyTimetable({ items }: { items: IScheduleEntry[] }) {
  const [day, setDay] = useState<string>(WEEK_DAYS[0]?.key ?? 'senin')
  const filtered = items.filter((i) => (i.day ?? '').toLowerCase() === day)
  const byPeriod = new Map(
    filtered.map((i) => [i.period ?? `${i.start_time}-${i.end_time}`, i]),
  )

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        {WEEK_DAYS.map((d) => (
          <Button
            key={d.key}
            size="sm"
            variant={day === d.key ? 'default' : 'outline'}
            onClick={() => setDay(d.key)}
          >
            {d.label}
          </Button>
        ))}
      </div>
      <div className="divide-y">
        {PERIOD_ROWS.map((row) => {
          if (row.kind === 'break') {
            return (
              <div
                key={row.key}
                className="bg-amber-50 px-4 py-3 text-center text-xs font-semibold tracking-widest text-amber-700"
              >
                {row.label} · {row.time}
              </div>
            )
          }
          const entry =
            byPeriod.get(row.key) ??
            filtered.find(
              (f) => f.start_time === row.start && f.end_time === row.end,
            ) ??
            null
          return (
            <div
              key={row.key}
              className="grid grid-cols-[96px_1fr] gap-3 px-4 py-3"
            >
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold">{row.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {row.time}
                </span>
              </div>
              <ScheduleCell entry={entry} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export function TeachingScheduleView() {
  const { user } = useAuth()
  const { viewMode, semester, setViewMode, setSemester } =
    useScheduleViewStore()

  const schedulesQuery = useSchedulesQuery(semester)
  const summaryQuery = useQuery({
    queryKey: ['schedules', 'summary', { semester }],
    queryFn: () =>
      getScheduleSummary({
        semester: semester === 'all' ? undefined : semester,
      }),
    staleTime: 30_000,
  })

  const items = schedulesQuery.data?.items ?? []
  const isLoading = schedulesQuery.isLoading

  const handleExport = async () => {
    try {
      const blob = await exportSchedules({
        semester: semester === 'all' ? undefined : semester,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jadwal-mengajar-${semester}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Gagal mengekspor jadwal. Fitur belum tersedia.')
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Mengajar</h1>
          <p className="text-sm text-muted-foreground">
            Lihat dan kelola jadwal mengajar anda.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start">
          {user ? (
            <div className="hidden items-center gap-2 rounded-full border bg-card px-2 py-1 text-sm sm:flex">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[14ch] truncate pr-1 text-xs font-medium">
                {user.name}
              </span>
            </div>
          ) : null}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <IconDownload />
            Export Jadwal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-20 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <SummaryCards items={items} summary={summaryQuery.data as never} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Semester</span>
          <Select
            value={semester}
            onValueChange={(v) => setSemester(v ?? 'all')}
          >
            <SelectTrigger size="sm" className="w-[160px]">
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="ganjil">Ganjil</SelectItem>
              <SelectItem value="genap">Genap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="inline-flex rounded-lg border bg-card p-1">
          <Button
            size="sm"
            variant={viewMode === 'mingguan' ? 'default' : 'ghost'}
            onClick={() => setViewMode('mingguan')}
            className="h-7 px-3 text-xs"
          >
            <IconCalendar className="size-3.5" />
            Mingguan
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'harian' ? 'default' : 'ghost'}
            onClick={() => setViewMode('harian')}
            className="h-7 px-3 text-xs"
          >
            Harian
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Memuat jadwal...
          </CardContent>
        </Card>
      ) : viewMode === 'harian' ? (
        <DailyTimetable items={items} />
      ) : (
        <WeeklyTimetable items={items} />
      )}
    </div>
  )
}
