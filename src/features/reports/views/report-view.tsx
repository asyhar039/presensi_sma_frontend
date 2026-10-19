import { IconDownload, IconLoader2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReportFilters } from '@/features/reports/components/report-filters'
import { ReportMatrixTable } from '@/features/reports/components/report-matrix-table'
import { ReportSummaryCards } from '@/features/reports/components/report-summary-cards'
import { useAttendanceReport } from '@/features/reports/hooks/use-attendance-report'

export function ReportView() {
  const { t } = useTranslation()

  const {
    dateRangeTab,
    selectedMonth,
    selectedYear,
    selectedClass,
    selectedSubject,
    selectedStatus,
    currentPage,
    pageSize,
    classOptions,
    subjectOptions,
    yearOptions,
    summaryData,
    matrixStudents,
    paginationMeta,
    isLoadingSummary,
    isLoadingMatrix,
    isExporting,
    handleDateRangeChange,
    handleMonthChange,
    handleYearChange,
    handleClassChange,
    handleSubjectChange,
    handleStatusChange,
    handleResetFilters,
    handleExport,
    setCurrentPage,
  } = useAttendanceReport()

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('reports.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('reports.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <IconDownload className="size-4" />
                  )}
                  <span>{t('common.export')}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                {t('reports.exportExcel')} (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                {t('reports.exportPdf')} (.pdf)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                {t('reports.exportCsv')} (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <ReportSummaryCards summary={summaryData} isLoading={isLoadingSummary} />

      {/* Filter Bar with Dynamic Options */}
      <ReportFilters
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedStatus={selectedStatus}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        yearOptions={yearOptions}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onClassChange={handleClassChange}
        onSubjectChange={handleSubjectChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      {/* Attendance Matrix Table */}
      <ReportMatrixTable
        students={matrixStudents}
        isLoading={isLoadingMatrix}
        dateRangeTab={dateRangeTab}
        onDateRangeChange={handleDateRangeChange}
        currentPage={currentPage}
        pageSize={pageSize}
        paginationMeta={paginationMeta}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
