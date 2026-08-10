import { useCallback, useState } from 'react';
import { getErrorMessage } from '../utils/errors';

export function useCrud({
  create,
  update,
  remove,
  confirmMessage,
  messages = {},
  clearAfterMs = 4000,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = useCallback((message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), clearAfterMs);
  }, [clearAfterMs]);

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
        showFeedback(messages.updated || 'Data berhasil diperbarui.');
      } else {
        await create(values).unwrap();
        showFeedback(messages.added || 'Data berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (error) {
      showFeedback(getErrorMessage(error, messages.saveError));
    }
  }, [editing, update, create, showFeedback, messages]);

  const removeRow = useCallback(async (row) => {
    if (!window.confirm(confirmMessage(row))) return;
    try {
      await remove(row.id).unwrap();
      showFeedback(messages.deleted || 'Data berhasil dihapus.');
    } catch (error) {
      showFeedback(getErrorMessage(error, messages.deleteError));
    }
  }, [remove, confirmMessage, showFeedback, messages]);

  return { modalOpen, editing, feedback, openCreate, openEdit, close, submit, removeRow };
}
