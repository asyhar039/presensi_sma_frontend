import { IconX } from '@tabler/icons-react'
import { useShallow } from 'zustand/shallow'

import { ButtonLoading } from '@/components/composite/button-loading'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useConfirmationStore } from '@/stores/confirmation-store'

export function ConfirmationDialog() {
  const [
    data,
    isOpen,
    close,
    isActionLoading,
    isCancelLoading,
    actionLoading,
    cancelLoading,
  ] = useConfirmationStore(
    useShallow((state) => [
      state.data,
      state.isOpen,
      state.close,
      state.isActionLoading,
      state.isCancelLoading,
      state.actionLoading,
      state.cancelLoading,
    ]),
  )

  if (!data) return null

  const handleAction = async () => {
    if (data.onAction) {
      await data.onAction({ close, loading: actionLoading })
      return
    }

    close()
  }

  const handleCancel = () => {
    if (data.onCancel) {
      data.onCancel({ close, loading: cancelLoading })
    }

    close()
  }

  const Icon = data.icon

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          {!data.hideClose && (
            <AlertDialogCancel
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-4 right-4"
                >
                  <IconX />
                  <span className="sr-only">Close</span>
                </Button>
              }
            />
          )}
          {Icon && (
            <AlertDialogMedia>
              <Icon />
            </AlertDialogMedia>
          )}
          {data.title && <AlertDialogTitle>{data.title}</AlertDialogTitle>}
          {data.description && (
            <AlertDialogDescription>{data.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:justify-center gap-4">
          {!data.hideCancel && (
            <AlertDialogCancel
              render={
                <ButtonLoading
                  disabled={isActionLoading}
                  loading={isCancelLoading}
                  variant={data.cancelVariant ?? 'outline'}
                  onClick={handleCancel}
                >
                  {data.cancelLabel ?? 'Cancel'}
                </ButtonLoading>
              }
            />
          )}

          {!data.hideAction && (
            <AlertDialogAction
              render={
                <ButtonLoading
                  disabled={isCancelLoading}
                  loading={isActionLoading}
                  variant={data.actionVariant ?? 'default'}
                  onClick={handleAction}
                >
                  {data.actionLabel ?? 'Continue'}
                </ButtonLoading>
              }
            />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
