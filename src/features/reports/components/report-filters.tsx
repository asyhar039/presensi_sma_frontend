import type {
  IReportClassOption,
  IReportSubjectOption,
  IReportYearOption,
} from '@/features/reports/types/report.types'

import { IconFilter, IconRefresh } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/class-name'

interface ReportFiltersProps {
  selectedMonth: string
  selectedYear: string
  selectedClass: string
  selectedSubject: string
  selectedStatus: string
  classOptions: IReportClassOption[]
  subjectOptions: IReportSubjectOption[]
  yearOptions: IReportYearOption[]
  onMonthChange: (val: string) => void
  onYearChange: (val: string) => void
  onClassChange: (val: string) => void
  onSubjectChange: (val: string) => void
  onStatusChange: (val: string) => void
  onReset: () => void
}

export function ReportFilters({
  selectedMonth,
  selectedYear,
  selectedClass,
  selectedSubject,
  selectedStatus,
  classOptions,
  subjectOptions,
  yearOptions,
  onMonthChange,
  onYearChange,
  onClassChange,
  onSubjectChange,
  onStatusChange,
  onReset,
}: ReportFiltersProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <IconFilter className="size-4" />
          <span>{t('reports.filterTitle')}</span>
        </CardTitle>
        <CardDescription>{t('reports.filterDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'grid gap-4 items-end',
            'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
          )}
        >
          {/* Month Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="report-filter-month"
              className="text-xs font-medium text-muted-foreground"
            >
              {t('common.month')}
            </label>
            <Select
              value={selectedMonth}
              onValueChange={(val) => val && onMonthChange(val)}
            >
              <SelectTrigger id="report-filter-month" className="h-10 w-full">
                <SelectValue placeholder={t('reports.selectMonth')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t('months.january')}</SelectItem>
                <SelectItem value="2">{t('months.february')}</SelectItem>
                <SelectItem value="3">{t('months.march')}</SelectItem>
                <SelectItem value="4">{t('months.april')}</SelectItem>
                <SelectItem value="5">{t('months.may')}</SelectItem>
                <SelectItem value="6">{t('months.june')}</SelectItem>
                <SelectItem value="7">{t('months.july')}</SelectItem>
                <SelectItem value="8">{t('months.august')}</SelectItem>
                <SelectItem value="9">{t('months.september')}</SelectItem>
                <SelectItem value="10">{t('months.october')}</SelectItem>
                <SelectItem value="11">{t('months.november')}</SelectItem>
                <SelectItem value="12">{t('months.december')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter (Connected to getAcademicYears) */}
          <div className="space-y-1.5">
            <label
              htmlFor="report-filter-year"
              className="text-xs font-medium text-muted-foreground"
            >
              {t('common.year')}
            </label>
            <Select
              value={selectedYear}
              onValueChange={(val) => val && onYearChange(val)}
            >
              <SelectTrigger id="report-filter-year" className="h-10 w-full">
                <SelectValue placeholder={t('reports.selectYear')} />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.length > 0 ? (
                  yearOptions.map((yr) => (
                    <SelectItem key={yr.value} value={yr.value}>
                      {yr.label}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter (Connected to getClassOptions) */}
          <div className="space-y-1.5">
            <label
              htmlFor="report-filter-class"
              className="text-xs font-medium text-muted-foreground"
            >
              {t('common.class')}
            </label>
            <Select
              value={selectedClass}
              onValueChange={(val) => val && onClassChange(val)}
            >
              <SelectTrigger id="report-filter-class" className="h-10 w-full">
                <SelectValue placeholder={t('reports.allClasses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('reports.allClasses')}</SelectItem>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.id} value={String(cls.id)}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Filter (Connected to getSubjects) */}
          <div className="space-y-1.5">
            <label
              htmlFor="report-filter-subject"
              className="text-xs font-medium text-muted-foreground"
            >
              {t('navigation.subject')}
            </label>
            <Select
              value={selectedSubject}
              onValueChange={(val) => val && onSubjectChange(val)}
            >
              <SelectTrigger id="report-filter-subject" className="h-10 w-full">
                <SelectValue placeholder={t('reports.allSubjects')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('reports.allSubjects')}</SelectItem>
                {subjectOptions.map((subj) => (
                  <SelectItem key={String(subj.id)} value={String(subj.id)}>
                    {subj.name} {subj.code ? `(${subj.code})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label
              htmlFor="report-filter-status"
              className="text-xs font-medium text-muted-foreground"
            >
              {t('common.status')}
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(val) => val && onStatusChange(val)}
            >
              <SelectTrigger id="report-filter-status" className="h-10 w-full">
                <SelectValue placeholder={t('reports.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('reports.allStatuses')}</SelectItem>
                <SelectItem value="h">
                  {t('reports.presentDesc')} (H)
                </SelectItem>
                <SelectItem value="i">{t('reports.permitDesc')} (I)</SelectItem>
                <SelectItem value="s">{t('reports.sickDesc')} (S)</SelectItem>
                <SelectItem value="a">{t('reports.absentDesc')} (A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Action */}
          <div className="space-y-1.5 flex items-end">
            <Button variant="outline" className="h-10 w-full" onClick={onReset}>
              <IconRefresh className="size-4 mr-1.5" />
              {t('common.reset')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
