import { Modal } from '../Modal/Modal';
import { Button } from '../../ui/Button/Button';

export function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
  variant = 'danger',
}) {
  return (
    <Modal open={open} title={title} onClose={onCancel} size="sm">
      <div className="mb-6">{message}</div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}