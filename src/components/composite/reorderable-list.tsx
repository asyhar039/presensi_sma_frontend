import type { ReactNode } from 'react'

import { IconGripVertical } from '@tabler/icons-react'

import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from '@/components/ui/sortable'
import { cn } from '@/lib/class-name'

export interface ReorderableListProps<T> {
  items: T[]
  getKey: (item: T) => string
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  disabled?: boolean
  className?: string
  itemClassName?: string
}

export function ReorderableList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  disabled = false,
  className,
  itemClassName,
}: ReorderableListProps<T>) {
  if (items.length === 0) return null

  return (
    <Sortable
      value={items}
      onValueChange={onReorder}
      getItemValue={getKey}
      className={cn('flex flex-col gap-2', className)}
    >
      {items.map((item, index) => (
        <SortableItem
          key={getKey(item)}
          value={getKey(item)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-card p-2.5',
            itemClassName,
          )}
        >
          {renderItem(item, index)}
        </SortableItem>
      ))}
    </Sortable>
  )
}

export function ReorderableHandle({ className }: { className?: string }) {
  return (
    <SortableItemHandle
      className={cn(
        'flex shrink-0 cursor-grab touch-none items-center text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <IconGripVertical className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </SortableItemHandle>
  )
}
