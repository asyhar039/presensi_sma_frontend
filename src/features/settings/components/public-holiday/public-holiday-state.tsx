import { IconCalendarPlus, IconRotateClockwise } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export interface IPublicHolidayErrorStateProps {
  onRetry: () => void
}

export function PublicHolidayErrorState({
  onRetry,
}: IPublicHolidayErrorStateProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendarPlus />
        </EmptyMedia>
        <EmptyTitle>Failed to load holidays</EmptyTitle>
        <EmptyDescription>
          We could not load the public holidays. Please try again.
        </EmptyDescription>
      </EmptyHeader>
      <Button variant="outline" onClick={onRetry}>
        <IconRotateClockwise className="size-4" />
        Retry
      </Button>
    </Empty>
  )
}
