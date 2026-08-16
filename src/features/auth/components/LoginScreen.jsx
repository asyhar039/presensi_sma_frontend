import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation, useLoginStudentMutation } from '../services/authAPI';
import { Input } from '../../../components/ui/Input/Input';
import { Alert } from '../../../components/feedback/Alert/Alert';
import { getErrorMessage } from '../../../utils/errors';
import { ROUTES } from '../../../constants/routes';

export function LoginScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');
  const [form, setForm] = useState({ username: '', password: '' });
  const [studentForm, setStudentForm] = useState({ username: '', password: '' });

  const [loginUser, { isLoading: userLoading, error: userError }] = useLoginUserMutation();
  const [loginStudent, { isLoading: studentLoading, error: studentError }] = useLoginStudentMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginUser(form).unwrap();
    if (res?.status === 'success') {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    const res = await loginStudent(studentForm).unwrap();
    if (res?.status === 'success') {
      navigate(ROUTES.PROFILE, { replace: true });
    }
  };

  const tabClass = (active) =>
    `flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
      active ? 'bg-primary text-white' : 'text-secondary hover:bg-white hover:shadow'
    }`;

  const submitClass =
    'w-full rounded-lg border border-primary bg-primary px-4 py-2 text-lg font-bold text-white transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-65 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25';

  return (
    <>
      <div className="mb-4 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[rgba(99,102,241,0.1)] text-[32px] text-primary">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h4 className="text-xl font-bold text-dark">ABSENSI SMA</h4>
        <p className="text-sm text-muted">Sistem Manajemen Kehadiran</p>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-light p-1">
        <button type="button" className={tabClass(activeTab === 'admin')} onClick={() => setActiveTab('admin')}>
          Admin / Guru
        </button>
        <button type="button" className={tabClass(activeTab === 'student')} onClick={() => setActiveTab('student')}>
          Siswa
        </button>
      </div>

      {activeTab === 'admin' ? (
        <>
          {userError ? <Alert variant="danger" className="mb-4">{getErrorMessage(userError)}</Alert> : null}
          <form onSubmit={handleLogin}>
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
              placeholder="Masukkan username"
              autoComplete="username"
              size="lg"
              required
            />
            <Input
              label="Password"
              name="password"
              value={form.password}
              onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
              type="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              size="lg"
              required
            />
            <button className={submitClass} type="submit" disabled={userLoading}>
              {userLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-light p-4 text-sm text-muted">
            <strong>Credential Demo:</strong><br />
            • Admin: <code>admin</code> / <code>admin123</code><br />
            • Guru: <code>guru</code> / <code>guru123</code>
          </div>
        </>
      ) : (
        <>
          {studentError ? <Alert variant="danger" className="mb-4">{getErrorMessage(studentError)}</Alert> : null}
          <form onSubmit={handleStudentLogin}>
            <Input
              label="Nama Lengkap"
              name="username"
              value={studentForm.username}
              onChange={(field, value) => setStudentForm((prev) => ({ ...prev, [field]: value }))}
              placeholder="Masukkan nama lengkap"
              size="lg"
              required
            />
            <Input
              label="NISN"
              name="password"
              value={studentForm.password}
              onChange={(field, value) => setStudentForm((prev) => ({ ...prev, [field]: value }))}
              placeholder="Masukkan NISN"
              size="lg"
              required
            />
            <button className={submitClass} type="submit" disabled={studentLoading}>
              {studentLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-light p-4 text-sm text-muted">
            <i className="fas fa-info-circle mr-1"></i>
            <strong>Portal Siswa:</strong> Login dengan Nama Lengkap dan NISN Anda
          </div>
        </>
      )}
    </>
  );
}