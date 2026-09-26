import type { PermitType } from '@/features/student-permits/types/permit.types'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/class-name'

interface LeaveTypeSelectorProps {
  value: PermitType
  onChange: (value: PermitType) => void
  disabled?: boolean
}

const LEAVE_TYPES: { value: PermitType; label: string }[] = [
  { value: 'sick', label: 'Izin Sakit' },
  { value: 'leave_school', label: 'Izin Keluar' },
  { value: 'leave_in', label: 'Izin Terlambat' },
]

export function LeaveTypeSelector({
  value,
  onChange,
  disabled,
}: LeaveTypeSelectorProps) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Jenis Izin">
      {LEAVE_TYPES.map(({ value: typeValue, label }) => (
        <Button
          key={typeValue}
          type="button"
          variant={value === typeValue ? 'default' : 'outline'}
          className={cn(
            'flex-1 py-2.5 text-sm font-medium transition-all',
            value === typeValue &&
              'bg-primary text-primary-foreground shadow-sm',
          )}
          onClick={() => !disabled && onChange(typeValue)}
          disabled={disabled}
          role="radio"
          aria-checked={value === typeValue}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
