import type { PermitType } from '@/features/student-permits/types/permit.types'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/class-name'

interface LeaveTypeSelectorProps {
  value: PermitType
  onChange: (value: PermitType) => void
  disabled?: boolean
}

const LEAVE_TYPES: {
  value: PermitType
  label: string
  activeBg: string
  activeText: string
  activeBorder: string
  outlineBorder: string
}[] = [
  {
    value: 'sick',
    label: 'Izin Sakit',
    activeBg: 'bg-green-600',
    activeText: 'text-white',
    activeBorder: 'border-green-600',
    outlineBorder: 'border-green-600',
  },
  {
    value: 'leave_school',
    label: 'Izin Keluar',
    activeBg: 'bg-blue-600',
    activeText: 'text-white',
    activeBorder: 'border-blue-600',
    outlineBorder: 'border-blue-600',
  },
  {
    value: 'leave_in',
    label: 'Izin Terlambat',
    activeBg: 'bg-amber-500',
    activeText: 'text-white',
    activeBorder: 'border-amber-500',
    outlineBorder: 'border-amber-500',
  },
]

export function LeaveTypeSelector({
  value,
  onChange,
  disabled,
}: LeaveTypeSelectorProps) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Jenis Izin">
      {LEAVE_TYPES.map(
        ({
          value: typeValue,
          label,
          activeBg,
          activeText,
          activeBorder,
          outlineBorder,
        }) => (
          <Button
            key={typeValue}
            type="button"
            variant={value === typeValue ? 'default' : 'outline'}
            className={cn(
              'flex-1 py-3 px-4 text-sm font-medium transition-all',
              value === typeValue
                ? `${activeBg} ${activeText} ${activeBorder} shadow-sm`
                : `border-2 ${outlineBorder} hover:bg-amber-50 hover:border-amber-500 dark:hover:bg-amber-950/30`,
            )}
            onClick={() => !disabled && onChange(typeValue)}
            disabled={disabled}
            role="radio"
            aria-checked={value === typeValue}
          >
            {label}
          </Button>
        ),
      )}
    </div>
  )
}
