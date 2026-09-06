import { useState } from 'react';
import { Info, CheckCircle } from 'lucide-react';
import Modal from '../../../components/feedback/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import PasswordInput from '../../../components/ui/Input/PasswordInput';
import Alert from '../../../components/feedback/Alert/Alert';

/**
 * ResetPasswordModal - Reusable UI component for Password Management (Student & Teacher).
 */
const ResetPasswordModal = ({ open, user, entityName = 'Pengguna', onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const userName = user?.nama_lengkap || user?.name || entityName;

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = 'Password baru wajib diisi';
    } else if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleCloseAll = () => {
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose?.();
  };

  if (isSuccess) {
    return (
      <Modal open={open} onClose={handleCloseAll} size="sm">
        <div className="flex flex-col items-center text-center p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Kata Sandi Berhasil Diperbarui</h3>
          <p className="text-sm text-slate-500 mb-6">
            Kata sandi untuk akun <span className="font-semibold text-slate-700">{userName}</span> telah divalidasi dan berhasil disimpan.
          </p>
          <Button
            variant="primary"
            className="w-full bg-indigo-600 hover:bg-indigo-700 border-none py-2.5 rounded-xl text-white font-medium"
            onClick={handleCloseAll}
          >
            Kembali
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} title={`Manajemen Password ${entityName}`} onClose={handleCloseAll}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100/60">
          <Info className="h-5 w-5 shrink-0 text-indigo-600 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <div className="font-medium text-indigo-700">Mengubah kata sandi untuk:</div>
            <div className="font-bold text-slate-900 text-base">{userName}</div>
          </div>
        </div>

        {errors.general ? <Alert variant="danger">{errors.general}</Alert> : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-1">
          <PasswordInput
            label="Password Baru"
            name="password"
            value={password}
            onChange={(_, val) => setPassword(value => val)}
            placeholder="Masukkan password baru"
            helperText="Minimal 8 karakter, kombinasi huruf dan angka."
            error={errors.password}
          />

          <PasswordInput
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(_, val) => setConfirmPassword(value => val)}
            placeholder="Ketik ulang password baru"
            error={errors.confirmPassword}
          />

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
            <Button
              variant="outline-secondary"
              className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={handleCloseAll}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-md shadow-indigo-100"
              loading={isSubmitting}
            >
              Simpan Kata Sandi
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
