import { IconSearch, IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/class-name'
import { useDataTable, useDataTableFilter } from './data-table-context'

export interface DataTableSearchInputProps {
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function DataTableSearchInput({
  placeholder,
  debounceMs,
  className,
}: DataTableSearchInputProps) {
  const { enableSearch, searchPlaceholder } = useDataTable()
  const { value, setValue, clear, isDefault } = useDataTableFilter<string>(
    'search',
    debounceMs === undefined ? undefined : { debounceMs },
  )

  if (!enableSearch) return null

  const resolvedPlaceholder = placeholder ?? searchPlaceholder

  return (
    <div className={cn('relative w-full', className)}>
      <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !isDefault) clear()
        }}
        placeholder={resolvedPlaceholder}
        aria-label={resolvedPlaceholder}
        className="pr-8 pl-8"
      />
      {!isDefault && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
        >
          <IconX />
        </Button>
      )}
    </div>
  )
}
