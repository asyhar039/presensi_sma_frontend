import { ApiCombobox } from '@/components/composite/api-combobox'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  getAcademicYearDropdown,
  getAcademicYearDropdownSelected,
} from '@/features/classrooms/services/classroom-dropdown-api'
import {
  getClassroomDropdownByYear,
  getClassroomDropdownSelected,
} from '@/features/schedules/services/schedule-api'

type ScheduleFilterCardProps = {
  yearId: string
  classroomId: string
  onYear: (value: string | undefined) => void
  onClassroom: (value: string | undefined) => void
}

export function ScheduleFilterCard({
  yearId,
  classroomId,
  onYear,
  onClassroom,
}: ScheduleFilterCardProps) {
  return (
    <Card>
      <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Academic year</Label>
          <ApiCombobox
            queryKey="academic-year-dropdown"
            queryFn={getAcademicYearDropdown}
            selectedQueryFn={getAcademicYearDropdownSelected}
            placeholder="Select academic year..."
            value={yearId || undefined}
            onValueChange={(next) => {
              onYear(next)
              onClassroom(undefined)
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Class</Label>
          <ApiCombobox
            key={yearId || 'no-year'}
            queryKey={`classroom-dropdown-${yearId || 'all'}`}
            queryFn={getClassroomDropdownByYear(yearId)}
            selectedQueryFn={getClassroomDropdownSelected}
            placeholder={
              yearId ? 'Select class...' : 'Select academic year first...'
            }
            disabled={!yearId}
            value={classroomId || undefined}
            onValueChange={(next) => onClassroom(next)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
