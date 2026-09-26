import type { IStudentProfile } from '@/features/student-permits/types/permit.types'

import { IconUsers } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface StudentProfileCardProps {
  student: IStudentProfile
  onViewHistory: () => void
}

export function StudentProfileCard({
  student,
  onViewHistory,
}: StudentProfileCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconUsers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                NISN: {student.identity_number}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4" />
              <span>Kelas: {student.classroom_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4" />
              <span>Wali Kelas: {student.homeroom_teacher}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={onViewHistory}>
            Lihat Riwayat Saya
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
