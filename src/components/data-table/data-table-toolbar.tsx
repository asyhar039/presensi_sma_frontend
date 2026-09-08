import type { DataTableFilter } from './data-table-types'

import { IconSearch, IconX } from '@tabler/icons-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useUpdateEffect } from '@/hooks/use-update-effect'

export interface DataTableToolbarProps {
  searchValue?: string
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  filters?: DataTableFilter[]
  onReset?: () => void
  children?: React.ReactNode
}

export function DataTableToolbar({
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters = [],
  onReset,
  children,
}: DataTableToolbarProps) {
  const [input, setInput] = useState<string>(searchValue)
  const debouncedInput = useDebouncedValue<string>(input)

  useUpdateEffect(() => {
    onSearchChange?.(debouncedInput)
  }, [debouncedInput])

  useUpdateEffect(() => {
    setInput(searchValue)
  }, [searchValue])

  const hasActiveFilter =
    input !== '' || filters.some((filter) => filter.value !== '')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={searchPlaceholder}
          className="pr-8 pl-8"
          aria-label={searchPlaceholder}
        />
        {input !== '' && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setInput('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
          >
            <IconX />
          </Button>
        )}
      </div>

      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onValueChange={(value) => filter.onChange(value ?? '')}
        >
          <SelectTrigger size="default" aria-label={filter.label}>
            <SelectValue placeholder={filter.placeholder ?? filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {children}

      {hasActiveFilter && onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <IconX />
          <span>Reset</span>
        </Button>
      )}
    </div>
  )
}
