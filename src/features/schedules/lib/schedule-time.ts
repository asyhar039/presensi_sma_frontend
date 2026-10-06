const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/

export function toMinutes(time: string): number {
  const match = TIME_RE.exec(time)
  if (!match) return Number.NaN
  return Number(match[1]) * 60 + Number(match[2])
}

export function toTime(total: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.round(total)))
  const hours = Math.floor(clamped / 60)
  const mins = clamped % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function snapMinutes(value: number, step = 5): number {
  return Math.round(value / step) * step
}

export function slotBoundaries(
  slots: { start: string; end: string }[],
): string[] {
  const points = new Set<string>()
  for (const slot of slots) {
    points.add(slot.start)
    points.add(slot.end)
  }
  return [...points].sort()
}

export interface DayScale {
  start: number
  end: number
  total: number
}

export function scaleOf(
  slots: { start: string; end: string }[],
): DayScale | null {
  const bounds = slotBoundaries(slots)
  if (bounds.length < 2) return null
  const start = toMinutes(bounds[0])
  const end = toMinutes(bounds[bounds.length - 1])
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return null
  return { start, end, total: end - start }
}

export function clampRange(
  start: number,
  end: number,
  scale: DayScale,
  minLength = 5,
): { start: number; end: number } {
  const safeStart = Math.max(
    scale.start,
    Math.min(start, scale.end - minLength),
  )
  const safeEnd = Math.max(safeStart + minLength, Math.min(end, scale.end))
  return { start: safeStart, end: safeEnd }
}
