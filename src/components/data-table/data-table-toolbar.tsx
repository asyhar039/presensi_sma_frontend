import type { ReactNode } from 'react'

import { IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/class-name'
import { useDataTable } from './data-table-context'
import { DataTableSearchInput } from './data-table-search-input'

export interface DataTableFilterSelectOption {
  label: string
  value: string
}

export interface DataTableFilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: DataTableFilterSelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DataTableFilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className,
}: DataTableFilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? '')}
      disabled={disabled}
      items={options}
    >
      <SelectTrigger
        size="default"
        aria-label={label}
        className={cn('w-full sm:w-auto', className)}
      >
        <SelectValue placeholder={placeholder ?? label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function DataTableResetButton({ onReset }: { onReset: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onReset}>
      <IconX />
      <span>Reset</span>
    </Button>
  )
}

function ToolbarReset() {
  const { isFiltered, reset } = useDataTable()
  if (!isFiltered) return null

  return <DataTableResetButton onReset={reset} />
}

export interface DataTableToolbarProps {
  searchPlaceholder?: string
  searchDebounceMs?: number
  showSearch?: boolean
  showReset?: boolean
  children?: ReactNode
  className?: string
}

export function DataTableToolbar({
  searchPlaceholder,
  searchDebounceMs,
  showSearch = true,
  showReset = true,
  children,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 lg:flex-row lg:items-center',
        className,
      )}
    >
      {showSearch && (
        <div className="w-full shrink-0 lg:w-64 xl:w-72">
          <DataTableSearchInput
            placeholder={searchPlaceholder}
            debounceMs={searchDebounceMs}
          />
        </div>
      )}
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
      {showReset && <ToolbarReset />}
    </div>
  )
}
