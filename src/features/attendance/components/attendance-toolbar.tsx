import type {
  IClassOption,
  IMonthOption,
  ISemesterOption,
} from '@/features/attendance/types/attendance.types'

import { IconDownload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ATTENDANCE_STATUS_OPTIONS } from '@/features/attendance/lib/attendance-table'
import {
  getClassOptions,
  getMonthOptions,
  getSemesterOptions,
  getTeacherClassOptions,
} from '@/features/attendance/services/attendance-api'

function getSearchParam(param: string): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get(param) || ''
}

interface ClassFilterSelectProps {
  getClassesFn?: () => Promise<IClassOption[]>
}

function ClassFilterSelect({
  getClassesFn = getClassOptions,
}: ClassFilterSelectProps) {
  const { t } = useTranslation()
  const { value, setValue } = useDataTableFilter<string>('classroom_id', {
    defaultValue: '',
  })
  const [classes, setClasses] = useState<IClassOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClassesFn().then((data) => {
      setClasses(data)
      setLoading(false)
    })
  }, [getClassesFn])

  return (
    <Select
      value={value}
      onValueChange={(next) => setValue(next ?? '')}
      disabled={loading}
    >
      <SelectTrigger
        size="default"
        aria-label={t('common.class')}
        className="w-full sm:w-48"
      >
        <SelectValue placeholder={t('attendance.selectClass')} />
      </SelectTrigger>
      <SelectContent>
        {classes.map((cls) => (
          <SelectItem key={cls.id} value={String(cls.id)}>
            {cls.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function MonthFilterSelect() {
  const { t } = useTranslation()
  const { value, setValue } = useDataTableFilter<string>('month', {
    defaultValue: '',
  })
  const [months, setMonths] = useState<IMonthOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMonthOptions().then((data) => {
      setMonths(data)
      setLoading(false)
    })
  }, [])

  return (
    <Select
      value={value}
      onValueChange={(next) => setValue(next ?? '')}
      disabled={loading}
    >
      <SelectTrigger
        size="default"
        aria-label={t('common.month')}
        className="w-full sm:w-40"
      >
        <SelectValue placeholder={t('common.month')} />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.value} value={String(month.value)}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SemesterFilterSelect() {
  const { t } = useTranslation()
  const { value, setValue } = useDataTableFilter<string>('semester', {
    defaultValue: '',
  })
  const [semesters, setSemesters] = useState<ISemesterOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSemesterOptions().then((data) => {
      setSemesters(data)
      setLoading(false)
    })
  }, [])

  return (
    <Select
      value={value}
      onValueChange={(next) => setValue(next ?? '')}
      disabled={loading}
    >
      <SelectTrigger
        size="default"
        aria-label={t('common.semester')}
        className="w-full sm:w-48"
      >
        <SelectValue placeholder={t('common.semester')} />
      </SelectTrigger>
      <SelectContent>
        {semesters.map((sem) => (
          <SelectItem key={sem.value} value={sem.value}>
            {sem.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function StatusFilterSelect() {
  const { t } = useTranslation()
  const { value, setValue } = useDataTableFilter<string>('status', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label={t('common.status')}
      placeholder={t('attendance.allStatuses')}
      value={value}
      onChange={setValue}
      options={ATTENDANCE_STATUS_OPTIONS}
      className="sm:w-40"
    />
  )
}

export interface AttendanceToolbarProps {
  isTeacher?: boolean
}

export function AttendanceToolbar({
  isTeacher = false,
}: AttendanceToolbarProps) {
  const { t } = useTranslation()
  return (
    <DataTableToolbar
      searchPlaceholder={t('attendance.searchStudent')}
      showReset
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <ClassFilterSelect
          getClassesFn={isTeacher ? getTeacherClassOptions : getClassOptions}
        />
        <MonthFilterSelect />
        <SemesterFilterSelect />
        <StatusFilterSelect />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const classroomId = getSearchParam('classroom_id')
            const month = getSearchParam('month')
            const semester = getSearchParam('semester')
            window.open(
              `/api/attendance/export?classroom_id=${classroomId}&month=${month}&semester=${semester}`,
              '_blank',
            )
          }}
        >
          <IconDownload className="size-4" />
          <span>{t('attendance.exportData')}</span>
        </Button>
      </div>
    </DataTableToolbar>
  )
}
