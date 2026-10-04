import { useState } from 'react'

import { ApiCombobox } from '@/components/composite/api-combobox'
import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { useAssignClassroomMembers } from '@/features/classrooms/hooks/use-assign-classroom-members'
import {
  getStudentDropdown,
  getStudentDropdownSelected,
} from '@/features/classrooms/services/classroom-dropdown-api'

type ClassroomAssignStudentsDialogProps = {
  classroomId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ClassroomAssignStudentsDialog({
  classroomId,
  isOpen,
  onOpenChange,
}: ClassroomAssignStudentsDialogProps) {
  const [studentIds, setStudentIds] = useState<string[]>([])
  const assignMutation = useAssignClassroomMembers(classroomId)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const ids = studentIds
      .map(Number)
      .filter((id) => Number.isFinite(id) && id > 0)
    if (ids.length === 0) return
    await assignMutation.mutateAsync(ids)
    setStudentIds([])
    onOpenChange(false)
  }

  return (
    <ResponsiveDialog
      title="Assign students"
      description="Selected students replace the current classroom members."
      isOpen={isOpen}
      onIsOpenChange={(open) => {
        if (!open) setStudentIds([])
        onOpenChange(open)
      }}
    >
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ApiCombobox
          multiple
          queryKey="student-dropdown"
          queryFn={getStudentDropdown}
          selectedQueryFn={getStudentDropdownSelected}
          placeholder="Search students..."
          value={studentIds}
          onValueChange={setStudentIds}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={studentIds.length === 0 || assignMutation.isPending}
          >
            {assignMutation.isPending ? 'Assigning...' : 'Assign students'}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  )
}
