import { useCallback, useState } from 'react'

import { useToast } from '../components/feedback/Toast/toastContext'
import { getErrorMessage } from '../utils/errors'

export function useCrud({
  create,
  update,
  remove,
  confirmMessage,
  messages = {},
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (data: any) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (data: any) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove: (id: any) => Promise<any>
  confirmMessage: string | ((row: unknown) => string)
  messages?: {
    added?: string
    updated?: string
    deleted?: string
    saveError?: string
    deleteError?: string
  }
}) {
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [confirming, setConfirming] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<any>) | null
  >(null)

  const openCreate = useCallback(() => {
    setEditing(null)
    setModalOpen(true)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEdit = useCallback((row: any) => {
    setEditing(row)
    setModalOpen(true)
  }, [])

  const close = useCallback(() => setModalOpen(false), [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = useCallback(
    async (values: any) => {
      try {
        if (editing?.id) {
          await update({ ...values, id: editing.id })
          toast.success(messages.updated || 'Data berhasil diperbarui.')
        } else {
          await create(values)
          toast.success(messages.added || 'Data berhasil ditambahkan.')
        }
        setModalOpen(false)
      } catch (error) {
        toast.error(
          getErrorMessage(error, messages.saveError ?? 'Gagal menyimpan data.'),
        )
      }
    },
    [editing, update, create, toast, messages],
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestRemove = useCallback((row: any) => {
    setConfirming(row)
    setConfirmOpen(true)
    setConfirmAction(() => () => remove(row.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cancelConfirm = useCallback(() => {
    setConfirming(null)
    setConfirmOpen(false)
    setConfirmAction(null)
  }, [])

  const confirmRemove = useCallback(async () => {
    const action = confirmAction
    if (!action) return
    setConfirming(null)
    setConfirmOpen(false)
    setConfirmAction(null)
    try {
      await action()
      toast.success(messages.deleted || 'Data berhasil dihapus.')
    } catch (error) {
      toast.error(
        getErrorMessage(error, messages.deleteError ?? 'Gagal menghapus data.'),
      )
    }
  }, [confirmAction, toast, messages])

  const confirmMsgText =
    typeof confirmMessage === 'string'
      ? confirmMessage
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        confirming
        ? (confirmMessage as (row: any) => string)(confirming)
        : ''

  return {
    modalOpen,
    editing,
    openCreate,
    openEdit,
    close,
    submit,
    requestRemove,
    confirmOpen,
    confirmAction,
    setConfirmOpen,
    confirmDialog: {
      open: confirmOpen,
      message: confirmMsgText,
      onConfirm: confirmRemove,
      onCancel: cancelConfirm,
    },
  }
}
