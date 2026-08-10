import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation, useLoginStudentMutation } from '../services/authAPI';
import { Input } from '../../../components/ui/Input/Input';
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

  return (
    <>
      <div className="text-center mb-4">
        <div className="mx-auto mb-3 text-primary d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(99, 102, 241, 0.1)', fontSize: 32 }}>
          <i className="fas fa-graduation-cap"></i>
        </div>
        <h4 className="fw-bold text-dark">ABSENSI SMA</h4>
        <p className="text-muted small">Sistem Manajemen Kehadiran</p>
      </div>

      <ul className="nav nav-pills nav-fill mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            type="button"
          >
            Admin / Guru
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
            type="button"
          >
            Siswa
          </button>
        </li>
      </ul>

      {activeTab === 'admin' ? (
        <>
          {userError ? <div className="alert alert-danger">{getErrorMessage(userError)}</div> : null}
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
            <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit" disabled={userLoading}>
              {userLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-light rounded-3 text-muted small">
            <strong>Credential Demo:</strong><br />
            • Admin: <code>admin</code> / <code>admin123</code><br />
            • Guru: <code>guru</code> / <code>guru123</code>
          </div>
        </>
      ) : (
        <>
          {studentError ? <div className="alert alert-danger">{getErrorMessage(studentError)}</div> : null}
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
            <button className="btn btn-primary btn-lg w-100 fw-bold" type="submit" disabled={studentLoading}>
              {studentLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-light rounded-3 text-muted small">
            <i className="fas fa-info-circle me-1"></i>
            <strong>Portal Siswa:</strong> Login dengan Nama Lengkap dan NISN Anda
          </div>
        </>
      )}
    </>
  );
}
