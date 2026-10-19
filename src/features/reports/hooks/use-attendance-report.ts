import type {
  IAttendanceMatrixItem,
  IAttendanceMatrixPaginationMeta,
  IAttendanceReportFilterParams,
  IAttendanceReportSummary,
} from '@/features/reports/types/report.types'

import { useCallback, useEffect, useState } from 'react'
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

export interface YearOption {
  value: string
  label: string
}

export interface SubjectOption {
  id: number | string
  name: string
  code?: string
}

// Fallback subjects if /subjects endpoint requires specific role/params or fails
const DEFAULT_FALLBACK_SUBJECTS: SubjectOption[] = [
  { id: 'math', name: 'Matematika' },
  { id: 'phys', name: 'Fisika' },
  { id: 'chem', name: 'Kimia' },
  { id: 'bio', name: 'Biologi' },
]

export function useAttendanceReport() {
  const { t } = useTranslation()

  // Filter States
  const [dateRangeTab, setDateRangeTab] = useState('1-10')
  const [selectedMonth, setSelectedMonth] = useState('10')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  // Options States
  const [classOptions, setClassOptions] = useState<
    Array<{ id: number; name: string }>
  >([])
  const [subjectOptions, setSubjectOptions] = useState<SubjectOption[]>(
    DEFAULT_FALLBACK_SUBJECTS,
  )
  const [yearOptions, setYearOptions] = useState<YearOption[]>([])

  // Data States
  const [summaryData, setSummaryData] =
    useState<IAttendanceReportSummary | null>(null)
  const [matrixStudents, setMatrixStudents] = useState<IAttendanceMatrixItem[]>(
    [],
  )
  const [paginationMeta, setPaginationMeta] =
    useState<IAttendanceMatrixPaginationMeta | null>(null)

  // Loading States
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Fetch Dropdown Options (Classes, Subjects, Academic Years)
  useEffect(() => {
    let isMounted = true

    async function loadOptions() {
      // 1. Load Classes
      try {
        const classes = await getClassOptions()
        if (isMounted && classes?.length) {
          setClassOptions(classes)
        }
      } catch (err) {
        console.warn('Class options load note:', err)
      }

      // 2. Load Subjects via API with fallback
      try {
        // Pass page and per_page explicitly
        const subjectsResult = await getSubjects({ page: 1, per_page: 50 })
        if (
          isMounted &&
          subjectsResult.items &&
          subjectsResult.items.length > 0
        ) {
          setSubjectOptions(
            subjectsResult.items.map((sub) => ({
              id: sub.id,
              name: sub.name,
            })),
          )
        }
      } catch (err) {
        // Backend returned 422 Unprocessable Entity (e.g. max per_page validation or requires search param)
        // Keep fallback subjects gracefully without breaking the UI
        console.warn(
          'Using fallback subjects (API returned validation notice):',
          err,
        )
      }

      // 3. Load Academic Years via API
      try {
        const yearsResult = await getAcademicYears({ page: 1, per_page: 20 })
        if (isMounted && yearsResult.items?.length > 0) {
          const mappedYears: YearOption[] = yearsResult.items.map((item) => {
            const label = formatAcademicLabel(item)
            const startYear = item.odd_start_date
              ? new Date(item.odd_start_date).getFullYear().toString()
              : String(item.id)
            return {
              value: startYear,
              label,
            }
          })
          setYearOptions(mappedYears)

          // Default to active academic year if present
          const activeYear = yearsResult.items.find((y) => y.is_active)
          if (activeYear) {
            const activeStartYear = activeYear.odd_start_date
              ? new Date(activeYear.odd_start_date).getFullYear().toString()
              : '2026'
            setSelectedYear(activeStartYear)
          }
        } else if (isMounted) {
          setYearOptions([
            { value: '2026', label: '2026' },
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
          ])
        }
      } catch (err) {
        console.warn('Academic years load note:', err)
        if (isMounted) {
          setYearOptions([
            { value: '2026', label: '2026' },
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
          ])
        }
      }
    }

    loadOptions()
    return () => {
      isMounted = false
    }
  }, [])

  // Fetch Summary Cards
  const fetchSummary = useCallback(async () => {
    setIsLoadingSummary(true)
    try {
      const data = await getAttendanceReportSummary({
        month: selectedMonth,
        year: selectedYear,
        classroom_id: selectedClass === 'all' ? 'all' : selectedClass,
      })
      setSummaryData(data)
    } catch (err) {
      console.warn('Fetch report summary note:', err)
      setSummaryData(null)
    } finally {
      setIsLoadingSummary(false)
    }
  }, [selectedMonth, selectedYear, selectedClass])

  // Fetch Attendance Matrix
  const fetchMatrix = useCallback(async () => {
    setIsLoadingMatrix(true)
    try {
      const params: IAttendanceReportFilterParams = {
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
      const result = await getAttendanceReportMatrix(params)
      setMatrixStudents(result.items)
      if (result.meta) {
        setPaginationMeta(result.meta)
      } else {
        setPaginationMeta({
          page: currentPage,
          per_page: DEFAULT_PAGE_SIZE,
          total: result.items.length,
          total_pages: Math.ceil(result.items.length / DEFAULT_PAGE_SIZE) || 1,
        })
      }
    } catch (err) {
      console.warn('Fetch attendance matrix note:', err)
      toast.error(t('attendance.failedLoadAttendance'))
      setMatrixStudents([])
    } finally {
      setIsLoadingMatrix(false)
    }
  }, [
    selectedMonth,
    selectedYear,
    selectedClass,
    selectedSubject,
    selectedStatus,
    dateRangeTab,
    currentPage,
    t,
  ])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    fetchMatrix()
  }, [fetchMatrix])

  // Export Action
  const handleExport = async (type: string) => {
    setIsExporting(true)
    toast.info(t('reports.exportingMessage', { type: type.toUpperCase() }))
    try {
      await exportAttendanceReport({
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
    } finally {
      setIsExporting(false)
    }
  }

  // Reset Filters
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
    // States
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
    summaryData,
    matrixStudents,
    paginationMeta,
    isLoadingSummary,
    isLoadingMatrix,
    isExporting,

    // Handlers
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
