import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import { useRef } from 'react'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { PublicHolidayForm } from '@/features/settings/components/public-holiday/public-holiday-form'
import {
  getDialogDescription,
  getDialogFormKey,
  getDialogTitle,
} from '@/features/settings/components/public-holiday/public-holiday-helpers'

export type PublicHolidayDialogState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; holiday: IPublicHoliday }

export interface IPublicHolidayDialogProps {
  dialog: PublicHolidayDialogState | null
  existing: IPublicHoliday[]
  onClose: () => void
  onDone: () => void
}

function resolveFormKey(dialog: PublicHolidayDialogState): string {
  if (dialog.mode === 'edit') {
    return getDialogFormKey(dialog.mode, String(dialog.holiday.id))
  }
  return getDialogFormKey(dialog.mode, dialog.date)
}

export function PublicHolidayDialog({
  dialog,
  existing,
  onClose,
  onDone,
}: IPublicHolidayDialogProps) {
  const lastDialogRef = useRef<PublicHolidayDialogState | null>(null)
  if (dialog !== null) {
    lastDialogRef.current = dialog
  }
  const renderDialog = dialog ?? lastDialogRef.current

  const isOpen = dialog !== null
  const mode = renderDialog ? renderDialog.mode : 'create'

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <ResponsiveDialog
      title={getDialogTitle(mode)}
      description={getDialogDescription(mode)}
      isOpen={isOpen}
      onIsOpenChange={handleOpenChange}
    >
      {renderDialog && (
        <PublicHolidayForm
          key={resolveFormKey(renderDialog)}
          dialog={renderDialog}
          existing={existing}
          onDone={onDone}
        />
      )}
    </ResponsiveDialog>
  )
}
