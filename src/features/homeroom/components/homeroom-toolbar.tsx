import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import {
  HOMEROOM_STATUS_OPTIONS,
  HOMEROOM_TYPE_OPTIONS,
} from '@/features/homeroom/lib/homeroom-table'

export function HomeroomToolbar() {
  const typeFilter = useDataTableFilter<string>('type', { defaultValue: 'all' })
  const statusFilter = useDataTableFilter<string>('status', {
    defaultValue: 'all',
  })

  return (
    <DataTableToolbar>
      <DataTableFilterSelect
        label="Type"
        placeholder="All types"
        options={[...HOMEROOM_TYPE_OPTIONS]}
        value={typeFilter.value}
        onChange={typeFilter.setValue}
        className="w-full sm:w-44"
      />
      <DataTableFilterSelect
        label="Status"
        placeholder="All statuses"
        options={[...HOMEROOM_STATUS_OPTIONS]}
        value={statusFilter.value}
        onChange={statusFilter.setValue}
        className="w-full sm:w-44"
      />
    </DataTableToolbar>
  )
}
