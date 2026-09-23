import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import {
  IconCalendarHeart,
  IconCalendarPlus,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import dayjs from 'dayjs'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatDisplayDate,
  formatListDescription,
} from '@/features/settings/components/public-holiday/public-holiday-helpers'

export interface IPublicHolidayListProps {
  holidays: IPublicHoliday[]
  isLoading?: boolean
  onEdit: (holiday: IPublicHoliday) => void
  onDelete: (holiday: IPublicHoliday) => void
}

export interface IPublicHolidayListItemProps {
  holiday: IPublicHoliday
  onEdit: (holiday: IPublicHoliday) => void
  onDelete: (holiday: IPublicHoliday) => void
}

function HolidayCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="size-8 shrink-0 rounded-md" />
    </div>
  )
}

function PublicHolidayListItem({
  holiday,
  onEdit,
  onDelete,
}: IPublicHolidayListItemProps) {
  const date = dayjs(holiday.date)

  const handleEdit = () => {
    onEdit(holiday)
  }

  const handleDelete = () => {
    onDelete(holiday)
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:bg-muted/40">
      <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="text-sm leading-none font-bold">
          {date.format('DD')}
        </span>
        <span className="text-[10px] leading-tight font-medium uppercase">
          {date.format('MMM')}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className="truncate text-sm font-medium max-w-48"
          title={holiday.name}
        >
          {holiday.name}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{formatDisplayDate(holiday.date)}</span>
          <span aria-hidden="true" className="shrink-0">
            ·
          </span>
          <span className="shrink-0">{date.format('dddd')}</span>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${holiday.name}`}
          onClick={handleEdit}
        >
          <IconPencil className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${holiday.name}`}
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive"
        >
          <IconTrash className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function PublicHolidayList({
  holidays,
  isLoading = false,
  onEdit,
  onDelete,
}: IPublicHolidayListProps) {
  return (
    <Card className="flex min-h-0 flex-col overflow-hidden">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconCalendarHeart className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">All holidays</span>
            </CardTitle>
            <CardDescription>
              {isLoading && holidays.length === 0
                ? 'Loading holidays...'
                : formatListDescription(holidays.length)}
            </CardDescription>
          </div>
          {holidays.length > 0 && (
            <Badge variant="secondary" className="shrink-0">
              {holidays.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {isLoading && holidays.length === 0 ? (
          <div className="flex flex-col gap-2">
            <HolidayCardSkeleton />
            <HolidayCardSkeleton />
            <HolidayCardSkeleton />
            <HolidayCardSkeleton />
          </div>
        ) : holidays.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-6 text-center sm:p-8">
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <IconCalendarPlus className="size-5" />
            </span>
            <p className="text-sm font-medium">No holidays this month</p>
            <p className="max-w-55 text-xs text-muted-foreground sm:text-sm">
              Pick a date on the calendar or use the button above to add the
              first holiday.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-80 min-h-0 sm:max-h-105 lg:max-h-130">
            <div className="flex flex-col gap-2">
              {holidays.map((holiday) => (
                <PublicHolidayListItem
                  key={holiday.id}
                  holiday={holiday}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
