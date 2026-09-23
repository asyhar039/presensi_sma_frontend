export type PeriodRow =
  | {
      kind: 'period'
      key: string
      label: string
      time: string
      start: string
      end: string
    }
  | {
      kind: 'break'
      key: string
      label: string
      time: string
    }

export const PERIOD_ROWS: PeriodRow[] = [
  {
    kind: 'period',
    key: '1',
    label: 'Ke-1',
    time: '07:00 - 07:45',
    start: '07:00',
    end: '07:45',
  },
  {
    kind: 'period',
    key: '2',
    label: 'Ke-2',
    time: '07:45 - 08:30',
    start: '07:45',
    end: '08:30',
  },
  { kind: 'break', key: 'break-1', label: 'ISTIRAHAT', time: '08:30 - 09:00' },
  {
    kind: 'period',
    key: '3',
    label: 'Ke-3',
    time: '09:00 - 09:45',
    start: '09:00',
    end: '09:45',
  },
  {
    kind: 'period',
    key: '4',
    label: 'Ke-4',
    time: '09:45 - 10:30',
    start: '09:45',
    end: '10:30',
  },
  {
    kind: 'period',
    key: '5',
    label: 'Ke-5',
    time: '10:30 - 11:15',
    start: '10:30',
    end: '11:15',
  },
  {
    kind: 'period',
    key: '6',
    label: 'Ke-6',
    time: '11:15 - 12:00',
    start: '11:15',
    end: '12:00',
  },
  { kind: 'break', key: 'break-2', label: 'ISTIRAHAT', time: '12:00 - 12:30' },
  {
    kind: 'period',
    key: '7',
    label: 'Ke-7',
    time: '12:30 - 13:15',
    start: '12:30',
    end: '13:15',
  },
  {
    kind: 'period',
    key: '8',
    label: 'Ke-8',
    time: '13:15 - 14:00',
    start: '13:15',
    end: '14:00',
  },
]

export const WEEK_DAYS = [
  { key: 'senin', label: 'Senin' },
  { key: 'selasa', label: 'Selasa' },
  { key: 'rabu', label: 'Rabu' },
  { key: 'kamis', label: 'Kamis' },
  { key: 'jumat', label: 'Jumat' },
] as const

export type ScheduleCardStyle = {
  bg: string
  border: string
  dot: string
}

export const SCHEDULE_CARD_STYLES: Record<string, ScheduleCardStyle> = {
  default: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500' },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
}

export function pickScheduleStyle(subject: string): ScheduleCardStyle {
  const key = subject.toLowerCase()
  if (key.includes('matematika')) return SCHEDULE_CARD_STYLES.default
  if (key.includes('fisika') || key.includes('kimia'))
    return SCHEDULE_CARD_STYLES.blue
  if (key.includes('biologi') || key.includes('geografi'))
    return SCHEDULE_CARD_STYLES.emerald
  if (key.includes('ekonomi') || key.includes('sosiologi'))
    return SCHEDULE_CARD_STYLES.amber
  return SCHEDULE_CARD_STYLES.default
}
