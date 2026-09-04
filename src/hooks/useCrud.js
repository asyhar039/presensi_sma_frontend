import { useCallback, useState } from 'react';
import { getErrorMessage } from '../utils/errors';
import { useToast } from '../components/feedback/Toast/toastContext';

export function useCrud({
  create,
  update,
  remove,
  confirmMessage,
  messages = {},
}) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((row) => {
    setEditing(row);
    setModalOpen(true);
  }, []);

  const close = useCallback(() => setModalOpen(false), []);

  const submit = useCallback(async (values) => {
    try {
      if (editing?.id) {
        await update({ ...values, id: editing.id }).unwrap();
        toast.success(messages.updated || 'Data berhasil diperbarui.');
      } else {
        await create(values).unwrap();
        toast.success(messages.added || 'Data berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, messages.saveError));
    }
  }, [editing, update, create, toast, messages]);

  const requestRemove = useCallback((row) => setConfirming(row), []);

  const cancelConfirm = useCallback(() => setConfirming(null), []);

  const confirmRemove = useCallback(async () => {
    const row = confirming;
    if (!row) return;
    setConfirming(null);
    try {
      await remove(row.id).unwrap();
      toast.success(messages.deleted || 'Data berhasil dihapus.');
    } catch (error) {
      toast.error(getErrorMessage(error, messages.deleteError));
    }
  }, [confirming, remove, toast, messages]);

  const confirmDialog = {
    open: Boolean(confirming),
    message: confirming ? confirmMessage(confirming) : '',
    onConfirm: confirmRemove,
    onCancel: cancelConfirm,
  };

  return { modalOpen, editing, openCreate, openEdit, close, submit, requestRemove, confirmDialog };
}