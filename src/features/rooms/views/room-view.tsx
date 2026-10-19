import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useRoomColumns } from '@/features/rooms/components/room-columns'
import { RoomDialog } from '@/features/rooms/components/room-dialog'
import {
  RoomProvider,
  useRoomStore,
} from '@/features/rooms/components/room-store'
import { roomKeys } from '@/features/rooms/lib/room-query-options'
import {
  ROOM_DEFAULT_ORDER,
  ROOM_DEFAULT_SORT_BY,
  ROOM_PER_PAGE_OPTIONS,
  ROOM_SORT_BY,
} from '@/features/rooms/lib/room-table'
import { getRooms } from '@/features/rooms/services/room-api'

function RoomContent() {
  const { t } = useTranslation()
  const openCreate = useRoomStore((state) => state.openCreate)
  const columns = useRoomColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {t('rooms.title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('rooms.subtitle')}</p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>{t('rooms.add')}</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{t('rooms.title')}</CardTitle>
          <CardDescription>{t('rooms.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={roomKeys.lists()}
            queryFn={getRooms}
            allowedSortBy={ROOM_SORT_BY}
            defaultSortBy={ROOM_DEFAULT_SORT_BY}
            defaultOrder={ROOM_DEFAULT_ORDER}
            perPageOptions={ROOM_PER_PAGE_OPTIONS}
            searchPlaceholder={t('common.search')}
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <RoomDialog />
    </div>
  )
}

export function RoomView() {
  return (
    <RoomProvider>
      <RoomContent />
    </RoomProvider>
  )
}
