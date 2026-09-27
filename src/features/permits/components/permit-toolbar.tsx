import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import {
  PERMIT_STATUS_OPTIONS,
  PERMIT_TYPES,
} from '@/features/permits/lib/permit-table'

export function PermitToolbar() {
  const typeFilter = useDataTableFilter<string>('type', { defaultValue: 'all' })
  const statusFilter = useDataTableFilter<string>('status', {
    defaultValue: 'all',
  })

  return (
    <DataTableToolbar>
      <DataTableFilterSelect
        label="Jenis"
        placeholder="Semua Jenis"
        options={[...PERMIT_TYPES]}
        value={typeFilter.value}
        onChange={typeFilter.setValue}
        className="w-full sm:w-44"
      />
      <DataTableFilterSelect
        label="Status"
        placeholder="Semua Status"
        options={[...PERMIT_STATUS_OPTIONS]}
        value={statusFilter.value}
        onChange={statusFilter.setValue}
        className="w-full sm:w-44"
      />
    </DataTableToolbar>
  )
}
