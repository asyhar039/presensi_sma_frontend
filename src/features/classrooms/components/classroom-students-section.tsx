import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ClassroomAssignStudentsDialog } from '@/features/classrooms/components/classroom-assign-students-dialog'
import { useClassroomMemberColumns } from '@/features/classrooms/components/classroom-members-columns'
import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { getClassroomMembers } from '@/features/classrooms/services/classroom-api'

type ClassroomStudentsSectionProps = { classroomId: number }

function ClassroomStudentsTable({
  classroomId,
}: ClassroomStudentsSectionProps) {
  const columns = useClassroomMemberColumns(classroomId)
  return (
    <DataTable
      columns={columns}
      queryKey={classroomKeys.members(classroomId, {})}
      queryFn={(params) =>
        getClassroomMembers(classroomId, {
          page: params.page as number | undefined,
          per_page: params.per_page as number | undefined,
        })
      }
      enableSearch={false}
      searchPlaceholder="Search students..."
      syncWithQueryParams={false}
      emptyTitle="No students yet"
      emptyDescription="Assign students to fill this classroom."
    />
  )
}

export function ClassroomStudentsSection({
  classroomId,
}: ClassroomStudentsSectionProps) {
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Students</CardTitle>
          <CardDescription>
            Students assigned to this classroom.
          </CardDescription>
        </div>
        <Button
          onClick={() => setIsAssignOpen(true)}
          className="w-full sm:w-auto"
        >
          <IconPlus />
          <span>Assign students</span>
        </Button>
      </CardHeader>
      <CardContent>
        <ClassroomStudentsTable key={classroomId} classroomId={classroomId} />
      </CardContent>
      <ClassroomAssignStudentsDialog
        classroomId={classroomId}
        isOpen={isAssignOpen}
        onOpenChange={setIsAssignOpen}
      />
    </Card>
  )
}
