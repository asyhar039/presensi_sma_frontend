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
      <CardContent className="pt-8">
        <div className="space-y-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <IconUsers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                NISN: {student.identity_number}
              </p>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <IconUsers className="h-4 w-4" />
                <span>Kelas: {student.classroom_name}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <IconUsers className="h-4 w-4" />
                <span>Wali Kelas: {student.homeroom_teacher}</span>
              </div>
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
