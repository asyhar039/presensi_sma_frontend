import type { IStudentInformation } from '@/features/student-permits/types/permit.types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'
import { getErrorMessage } from '@/utils/error'

type StudentInfoCardProps = {
  info: IStudentInformation | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
}

type InfoRowProps = {
  label: string
  value?: string
  isLoading: boolean
}

function InfoRow({ label, value, isLoading }: InfoRowProps) {
  if (!isLoading && !value) {
    return null
  }

  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-1 h-4 w-2/3" />
      ) : (
        <p className="truncate text-sm font-medium">{value || '-'}</p>
      )}
    </div>
  )
}

export function StudentInfoCard({
  info,
  isLoading,
  isError,
  error,
  onRetry,
}: StudentInfoCardProps) {
  const { user } = useAuth()
  const message = getErrorMessage(error, 'Failed to load student details.')
  const detail = isError ? message : ''

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Student Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <InfoRow label="Name" value={user?.name} isLoading={false} />
        <InfoRow
          label="Class"
          value={info?.class?.name}
          isLoading={isLoading}
        />
        <InfoRow
          label="Homeroom Teacher"
          value={info?.class?.homeroom_teacher?.name}
          isLoading={isLoading}
        />
        <InfoRow
          label="Academic Year"
          value={
            info?.academic_year
              ? `${info?.academic_year?.odd_start_date?.slice(0, 4)} / ${info?.academic_year?.even_start_date?.slice(0, 4)}`
              : undefined
          }
          isLoading={isLoading}
        />
        {isError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm"
          >
            <p className="font-medium text-destructive">
              Could not load class details.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRetry}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
