import type {
  IAttendanceReportFilterParams,
  IReportClassOption,
  IReportSubjectOption,
  IReportYearOption,
} from '@/features/reports/types/report.types'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { getAcademicYears } from '@/features/academic-years/services/academic-year-api'
import { getClassOptions } from '@/features/attendance/services/attendance-api'
import {
  exportAttendanceReport,
  getAttendanceReportMatrix,
  getAttendanceReportSummary,
} from '@/features/reports/services/report-api'
import { getSubjects } from '@/features/subjects/services/subject-api'

const DEFAULT_PAGE_SIZE = 10
const FALLBACK_YEAR_OPTIONS: IReportYearOption[] = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
]

export function useAttendanceReport() {
  const { t } = useTranslation()

  const [dateRangeTab, setDateRangeTab] = useState('1-10')
  const [selectedMonth, setSelectedMonth] = useState('10')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const hasInitializedAcademicYear = useRef(false)

  const classOptionsQuery = useQuery({
    queryKey: ['report', 'class-options'],
    queryFn: getClassOptions,
  })
  const subjectOptionsQuery = useQuery({
    queryKey: ['report', 'subject-options'],
    queryFn: () => getSubjects({ page: 1, per_page: 50 }),
  })
  const academicYearsQuery = useQuery({
    queryKey: ['report', 'academic-year-options'],
    queryFn: () => getAcademicYears({ page: 1, per_page: 20 }),
  })

  const classOptions: IReportClassOption[] = classOptionsQuery.data ?? []
  const subjectOptions: IReportSubjectOption[] =
    subjectOptionsQuery.data?.items.map((subject) => ({
      id: subject.id,
      name: subject.name,
    })) ?? []
  const mappedYearOptions: IReportYearOption[] =
    academicYearsQuery.data?.items.map((item) => ({
      value: item.odd_start_date
        ? new Date(item.odd_start_date).getFullYear().toString()
        : String(item.id),
      label: formatAcademicLabel(item),
    })) ?? []
  const yearOptions =
    mappedYearOptions.length > 0 ? mappedYearOptions : FALLBACK_YEAR_OPTIONS

  useEffect(() => {
    if (!academicYearsQuery.isSuccess || hasInitializedAcademicYear.current) {
      return
    }

    hasInitializedAcademicYear.current = true
    const activeYear = academicYearsQuery.data?.items.find(
      (year) => year.is_active,
    )
    if (activeYear) {
      const activeStartYear = activeYear.odd_start_date
        ? new Date(activeYear.odd_start_date).getFullYear().toString()
        : '2026'
      setSelectedYear(activeStartYear)
    }
  }, [academicYearsQuery.data, academicYearsQuery.isSuccess])

  const summaryQuery = useQuery({
    queryKey: [
      'report',
      'attendance-summary',
      {
        month: selectedMonth,
        year: selectedYear,
        classroom_id: selectedClass === 'all' ? 'all' : selectedClass,
      },
    ],
    queryFn: () =>
      getAttendanceReportSummary({
        month: selectedMonth,
        year: selectedYear,
        classroom_id: selectedClass === 'all' ? 'all' : selectedClass,
      }),
  })

  const matrixParams: IAttendanceReportFilterParams = {
    month: selectedMonth,
    year: selectedYear,
    classroom_id: selectedClass === 'all' ? undefined : selectedClass,
    subject_id: selectedSubject === 'all' ? undefined : selectedSubject,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    date_range: dateRangeTab,
    format: 'compact',
    page: currentPage,
    per_page: DEFAULT_PAGE_SIZE,
  }
  const matrixQuery = useQuery({
    queryKey: ['report', 'attendance-matrix', matrixParams],
    queryFn: () => getAttendanceReportMatrix(matrixParams),
  })
  const matrixStudents = matrixQuery.data?.items ?? []
  const paginationMeta = matrixQuery.data
    ? (matrixQuery.data.meta ?? {
        page: currentPage,
        per_page: DEFAULT_PAGE_SIZE,
        total: matrixStudents.length,
        total_pages: Math.ceil(matrixStudents.length / DEFAULT_PAGE_SIZE) || 1,
      })
    : null

  useEffect(() => {
    if (matrixQuery.isError) {
      console.warn('Fetch attendance matrix note:', matrixQuery.error)
      toast.error(t('attendance.failedLoadAttendance'))
    }
  }, [matrixQuery.error, matrixQuery.isError, t])

  useEffect(() => {
    if (classOptionsQuery.isError) {
      console.warn('Class options load note:', classOptionsQuery.error)
    }
    if (subjectOptionsQuery.isError) {
      console.warn('Subject options load note:', subjectOptionsQuery.error)
    }
    if (academicYearsQuery.isError) {
      console.warn('Academic years load note:', academicYearsQuery.error)
    }
    if (summaryQuery.isError) {
      console.warn('Fetch report summary note:', summaryQuery.error)
    }
  }, [
    academicYearsQuery.error,
    academicYearsQuery.isError,
    classOptionsQuery.error,
    classOptionsQuery.isError,
    subjectOptionsQuery.error,
    subjectOptionsQuery.isError,
    summaryQuery.error,
    summaryQuery.isError,
  ])

  const exportMutation = useMutation({
    mutationFn: exportAttendanceReport,
  })

  const handleExport = async (type: 'excel' | 'pdf' | 'csv') => {
    toast.info(t('reports.exportingMessage', { type: type.toUpperCase() }))
    try {
      await exportMutation.mutateAsync({
        type,
        month: selectedMonth,
        year: selectedYear,
        classroom_id: selectedClass === 'all' ? 'all' : selectedClass,
        subject_id: selectedSubject === 'all' ? undefined : selectedSubject,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        date_range: dateRangeTab,
      })
      toast.success(t('common.success'))
    } catch (err) {
      console.error('Export failed:', err)
      toast.error(t('common.error'))
    }
  }

  const handleResetFilters = () => {
    setSelectedMonth('10')
    setSelectedYear(yearOptions[0]?.value || '2026')
    setSelectedClass('all')
    setSelectedSubject('all')
    setSelectedStatus('all')
    setDateRangeTab('1-10')
    setCurrentPage(1)
    toast.info(t('reports.resetFilterSuccess'))
  }

  const handleDateRangeChange = (val: string) => {
    setDateRangeTab(val)
    setCurrentPage(1)
  }

  const handleMonthChange = (val: string) => {
    setSelectedMonth(val)
    setCurrentPage(1)
  }

  const handleYearChange = (val: string) => {
    setSelectedYear(val)
    setCurrentPage(1)
  }

  const handleClassChange = (val: string) => {
    setSelectedClass(val)
    setCurrentPage(1)
  }

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val)
    setCurrentPage(1)
  }

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val)
    setCurrentPage(1)
  }

  return {
    dateRangeTab,
    selectedMonth,
    selectedYear,
    selectedClass,
    selectedSubject,
    selectedStatus,
    currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
    classOptions,
    subjectOptions,
    yearOptions,
    summaryData: summaryQuery.data ?? null,
    matrixStudents,
    paginationMeta,
    isLoadingSummary: summaryQuery.isLoading,
    isLoadingMatrix: matrixQuery.isLoading,
    isExporting: exportMutation.isPending,
    handleDateRangeChange,
    handleMonthChange,
    handleYearChange,
    handleClassChange,
    handleSubjectChange,
    handleStatusChange,
    handleResetFilters,
    handleExport,
    setCurrentPage,
  }
}
