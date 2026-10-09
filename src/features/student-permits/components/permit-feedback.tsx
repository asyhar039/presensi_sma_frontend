import { IconAlertCircle, IconInbox } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type FeedbackAction = {
  label: string
  onClick: () => void
}

type PermitErrorProps = {
  title?: string
  message: string
  action?: FeedbackAction
}

export function PermitError({
  title = 'Something went wrong',
  message,
  action,
}: PermitErrorProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertCircle />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button onClick={action.onClick} variant="outline">
            {action.label}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

type PermitEmptyProps = {
  title: string
  message: string
  action?: FeedbackAction
}

export function PermitEmpty({ title, message, action }: PermitEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button onClick={action.onClick}>{action.label}</Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
