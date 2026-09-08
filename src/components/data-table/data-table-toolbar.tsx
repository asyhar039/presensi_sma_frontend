import type { ReactNode } from 'react'
import type { DataTableFilterDef } from './data-table-types'

import { IconSearch, IconX } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDataTable } from './data-table-context'

export interface DataTableSearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  disabled?: boolean
}

export function DataTableSearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  disabled = false,
}: DataTableSearchInputProps) {
  const showClear = value !== ''

  return (
    <div className="relative w-full sm:max-w-xs">
      <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pr-8 pl-8"
        aria-label={placeholder}
        disabled={disabled}
      />
      {showClear && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
        >
          <IconX />
        </Button>
      )}
    </div>
  )
}

export interface DataTableFilterSelectProps {
  def: DataTableFilterDef
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function DataTableFilterSelect({
  def,
  value,
  onChange,
  disabled = false,
}: DataTableFilterSelectProps) {
  if (!def.options || def.options.length === 0) return null

  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value ?? '')}
      disabled={disabled}
    >
      <SelectTrigger size="default" aria-label={def.label}>
        <SelectValue placeholder={def.placeholder ?? def.label} />
      </SelectTrigger>
      <SelectContent>
        {def.options.map((option) => (
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

function ToolbarSearch({ placeholder }: { placeholder?: string }) {
  const {
    enableSearch,
    searchInput,
    setSearchInput,
    clearSearch,
    searchPlaceholder,
  } = useDataTable<unknown>()

  if (!enableSearch) return null

  return (
    <DataTableSearchInput
      value={searchInput}
      onChange={setSearchInput}
      onClear={clearSearch}
      placeholder={placeholder ?? searchPlaceholder}
    />
  )
}

function ToolbarFilters() {
  const { filterDefs, filters, setFilter, isFetching } = useDataTable<unknown>()
  const selectDefs = filterDefs.filter(
    (def) => def.options && def.options.length > 0,
  )

  return (
    <>
      {selectDefs.map((def) => (
        <DataTableFilterSelect
          key={def.key}
          def={def}
          value={filters[def.key] ?? ''}
          onChange={(value) => setFilter(def.key, value)}
          disabled={isFetching}
        />
      ))}
    </>
  )
}

function ToolbarReset() {
  const { isFiltered, reset } = useDataTable<unknown>()
  if (!isFiltered) return null

  return <DataTableResetButton onReset={reset} />
}

export interface DataTableToolbarProps {
  searchPlaceholder?: string
  showReset?: boolean
  children?: ReactNode
}

export function DataTableToolbar({
  searchPlaceholder,
  showReset = true,
  children,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <ToolbarSearch placeholder={searchPlaceholder} />
      <ToolbarFilters />
      {children}
      {showReset && <ToolbarReset />}
    </div>
  )
}
