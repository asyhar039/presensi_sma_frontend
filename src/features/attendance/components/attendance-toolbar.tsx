import type {
  IClassOption,
  IMonthOption,
  ISemesterOption,
} from '@/features/attendance/types/attendance.types'

import { IconDownload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

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
} from '@/features/attendance/services/attendance-api'

function getSearchParam(param: string): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get(param) || ''
}

function ClassFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('classroom_id', {
    defaultValue: '',
  })
  const [classes, setClasses] = useState<IClassOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClassOptions().then((data) => {
      setClasses(data)
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
        aria-label="Kelas"
        className="w-full sm:w-48"
      >
        <SelectValue placeholder="Pilih Kelas" />
      </SelectTrigger>
      <SelectContent>
        {classes.map((cls) => (
          <SelectItem key={cls.id} value={String(cls.id)}>
            {cls.name}{' '}
            {cls.academic_year ? `(${cls.academic_year.semester})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function MonthFilterSelect() {
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
        aria-label="Bulan"
        className="w-full sm:w-40"
      >
        <SelectValue placeholder="Bulan" />
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
        aria-label="Semester"
        className="w-full sm:w-48"
      >
        <SelectValue placeholder="Semester" />
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
  const { value, setValue } = useDataTableFilter<string>('status', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Status"
      placeholder="Semua Status"
      value={value}
      onChange={setValue}
      options={ATTENDANCE_STATUS_OPTIONS}
      className="sm:w-40"
    />
  )
}

export function AttendanceToolbar() {
  return (
    <DataTableToolbar
      searchPlaceholder="Cari NIS atau nama siswa..."
      showReset
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <ClassFilterSelect />
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
          <span>Ekspor Data</span>
        </Button>
      </div>
    </DataTableToolbar>
  )
}
