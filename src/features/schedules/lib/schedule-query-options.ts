import { queryOptions } from '@tanstack/react-query'

import {
  getClassSchedules,
  getMyTeachingSchedules,
} from '@/features/schedules/services/schedule-api'
import { daySchedulesQueryOptions } from '@/features/settings/lib/settings-query-options'

export const scheduleKeys = {
  all: ['class-schedules'] as const,
  day: (classroomId: number, day: string) =>
    [...scheduleKeys.all, classroomId, day] as const,
}

export function classSchedulesQueryOptions(
  classroomId: number | null,
  day: string,
) {
  return queryOptions({
    queryKey: scheduleKeys.day(classroomId ?? 0, day),
    queryFn: () => getClassSchedules(classroomId as number, day),
    enabled:
      typeof classroomId === 'number' && classroomId > 0 && day.length > 0,
    staleTime: 30_000,
  })
}

export { daySchedulesQueryOptions }

export const teacherScheduleKeys = {
  all: ['my-teaching-schedules'] as const,
}

export function myTeachingSchedulesQueryOptions() {
  return queryOptions({
    queryKey: teacherScheduleKeys.all,
    queryFn: getMyTeachingSchedules,
    staleTime: 30_000,
  })
}
