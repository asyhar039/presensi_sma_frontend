import type { ISessionFeedItem } from '@/features/teacher-session/types/teacher-session.types'

import { IconScan } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

type SessionFeedProps = { feed: ISessionFeedItem[]; isFetching: boolean }

export function SessionFeed({ feed, isFetching }: SessionFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Live Feed{' '}
          {isFetching && (
            <span className="size-2 animate-pulse rounded-full bg-green-500" />
          )}
        </CardTitle>
        <CardDescription>
          Students appear here the moment they scan the QR code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!feed || feed?.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconScan />
              </EmptyMedia>
              <EmptyTitle>No scans yet</EmptyTitle>
              <EmptyDescription>
                Waiting for the first student to scan the QR code.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {feed.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    NIS {item.identity_number} • {item.scanned_at}
                  </p>
                </div>
                <Badge variant={item.inside_zone ? 'secondary' : 'destructive'}>
                  {item.inside_zone ? 'In zone' : 'Outside'}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function SessionFeedSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
