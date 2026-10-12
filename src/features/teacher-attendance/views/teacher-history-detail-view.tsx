import { IconArrowLeft } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TeacherCalendar } from '@/features/teacher-attendance/components/teacher-calendar'
import {
  TeacherCalendarSkeleton,
  TeacherPageSkeleton,
  TeacherRecapError,
} from '@/features/teacher-attendance/components/teacher-recap-feedback'
import { TeacherStatCards } from '@/features/teacher-attendance/components/teacher-stat-cards'
import { teacherStudentHistoryQueryOptions } from '@/features/teacher-attendance/lib/teacher-attendance-query-options'
import { getErrorMessage } from '@/utils/error'

type MonthPickerProps = {
  month: number
  year: number
  onMonth: (month: number) => void
  onYear: (year: number) => void
}

function MonthPicker({ month, year, onMonth, onYear }: MonthPickerProps) {
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(year, i, 1).toLocaleString('en-US', { month: 'long' }),
      })),
    [year],
  )
  const years = useMemo(() => {
    const current = new Date().getFullYear()
    return [current - 1, current, current + 1]
  }, [])

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5">
        <Label>Month</Label>
        <Select
          value={String(month)}
          onValueChange={(next) => onMonth(Number(next))}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((item) => (
              <SelectItem key={item.value} value={String(item.value)}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Year</Label>
        <Select
          value={String(year)}
          onValueChange={(next) => onYear(Number(next))}
        >
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((item) => (
              <SelectItem key={item} value={String(item)}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function TeacherHistoryDetailView() {
  const navigate = useNavigate()
  const { studentId } = useParams({
    from: '/dashboard/attendance-recap/$studentId',
  })
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const studentIdNum = Number(studentId)

  const detailQuery = useQuery(
    teacherStudentHistoryQueryOptions(studentIdNum, { month, year }),
  )
  const detail = detailQuery.data

  if (!studentIdNum) {
    return (
      <TeacherRecapError
        title="Invalid student"
        message="The requested student could not be found."
        action={{
          label: 'Back to recap',
          onClick: () => navigate({ to: '/dashboard/attendance-recap' }),
        }}
      />
    )
  }

  if (detailQuery.isLoading) return <TeacherPageSkeleton />

  if (detailQuery.isError || !detail) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => navigate({ to: '/dashboard/attendance-recap' })}
        >
          <IconArrowLeft className="size-4" />
          <span>Back</span>
        </Button>
        <TeacherRecapError
          title="Failed to load attendance detail"
          message={getErrorMessage(
            detailQuery.error,
            'Could not load this student attendance history.',
          )}
          action={{ label: 'Try again', onClick: () => detailQuery.refetch() }}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => navigate({ to: '/dashboard/attendance-recap' })}
          >
            <IconArrowLeft className="size-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarFallback>
                {detail.student.student.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {detail.student.student.name}
                </h1>
                <Badge variant="secondary">{detail.student.class.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                NIS {detail.student.student.identity_number} -{' '}
                {detail.academic_year.label} academic year
              </p>
            </div>
          </div>
        </div>
        <MonthPicker
          month={month}
          year={year}
          onMonth={setMonth}
          onYear={setYear}
        />
      </div>

      <TeacherStatCards attendance={detail.attendance} />

      {detailQuery.isFetching ? (
        <Card>
          <CardContent className="pt-6">
            <TeacherCalendarSkeleton />
          </CardContent>
        </Card>
      ) : (
        <TeacherCalendar month={detail.month} calendar={detail.calendar} />
      )}
    </div>
  )
}
