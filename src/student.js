import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/student.css';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function getUserFriendlyMessage(error, fallback = 'Terjadi kesalahan.') {
  const message = error?.message || '';
  if (message.includes('Failed to fetch') || message.includes('fetch')) {
    return 'Backend sedang tidak tersedia. Pastikan server PHP berjalan di http://127.0.0.1:8000.';
  }
  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Sesi Anda telah berakhir. Silakan masuk kembali.';
  }
  return message || fallback;
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body && !options.headers?.['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { status: 'error', message: text || 'Respons tidak valid' };
  }

  if (!response.ok && data.status !== 'error') {
    throw new Error(data.message || `HTTP error: ${response.status}`);
  }

  return data || { status: 'error', message: 'Respons kosong' };
}

function StudentApp() {
  const [form, setForm] = React.useState({ username: '', password: '' });
  const [student, setStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [banner, setBanner] = React.useState({ type: 'info', text: 'Silakan masuk menggunakan nama lengkap dan NISN Anda.' });
  const [profile, setProfile] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  function setBannerMessage(text, type = 'info') {
    setBanner({ text, type });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setBannerMessage('Memproses login...', 'info');

    try {
      const res = await apiRequest('/auth/student_login.php', {
        method: 'POST',
        body: JSON.stringify({ username: form.username, password: form.password })
      });

      if (res.status === 'success') {
        setStudent(res.data?.student || null);
        await loadProfile();
        setBannerMessage('Login berhasil. Anda dapat melihat profil dan riwayat absensi Anda.', 'success');
      } else {
        setBannerMessage(res.message || 'Login gagal. Periksa kembali nama lengkap dan NISN.', 'danger');
      }
    } catch (error) {
      setBannerMessage(getUserFriendlyMessage(error, 'Login gagal. Periksa kembali nama lengkap dan NISN.'), 'danger');
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    try {
      const res = await apiRequest('/student/profile.php');
      if (res.status === 'success') {
        setProfile(res.data);
      } else {
        setBannerMessage(res.message || 'Profil siswa tidak tersedia saat ini.', 'warning');
      }
    } catch (error) {
      setBannerMessage(getUserFriendlyMessage(error, 'Profil siswa tidak dapat dimuat saat ini.'), 'warning');
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('/auth/logout.php');
    } catch {}
    setStudent(null);
    setProfile(null);
    setBannerMessage('Anda telah keluar. Silakan masuk kembali bila diperlukan.', 'info');
  }

  React.useEffect(() => {
    async function init() {
      try {
        const res = await apiRequest('/student/profile.php');
        if (res.status === 'success') {
          setStudent(res.data?.student || null);
          setProfile(res.data);
          setBannerMessage('Sesi Anda aktif. Anda bisa melihat profil dan riwayat kehadiran.', 'success');
        } else {
          setBannerMessage(res.message || 'Anda belum login. Silakan masuk terlebih dahulu.', 'info');
        }
      } catch (error) {
        setStudent(null);
        setProfile(null);
        setBannerMessage(getUserFriendlyMessage(error, 'Backend belum siap. Coba beberapa saat lagi.'), 'warning');
      } finally {
        setReady(true);
      }
    }
    init();
  }, []);

  return (
    <div className="app-shell">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="fw-bold mb-1">Portal Siswa</h2>
                  <p className="small-muted mb-0">Pantau profil dan riwayat kehadiran Anda</p>
                </div>
                {student ? <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Keluar</button> : null}
              </div>

              {!ready ? <div className="text-muted mb-3">Memuat portal siswa...</div> : null}

              {banner.text ? (
                <div className={`alert alert-${banner.type === 'danger' ? 'danger' : banner.type === 'warning' ? 'warning' : banner.type === 'success' ? 'success' : 'info'}`}>
                  {banner.text}
                </div>
              ) : null}

              {!student ? (
                <form onSubmit={handleLogin}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nama Lengkap</label>
                      <input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Masukkan nama lengkap" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">NISN</label>
                      <input className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Masukkan NISN" required />
                    </div>
                  </div>
                  <button className="btn btn-primary mt-4" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
                </form>
              ) : (
                <div>
                  <div className="stat-box mb-4">
                    <div className="fw-bold">{student.nama_lengkap}</div>
                    <div className="small">NISN: {student.nisn} • Kelas: {student.nama_kelas || '-'}</div>
                  </div>

                  {profile ? (
                    <div className="row g-3 mb-4">
                      <div className="col-md-3">
                        <div className="card p-3">
                          <div className="small-muted">Hadir</div>
                          <div className="fs-4 fw-bold">{profile.stats?.Hadir ?? 0}</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card p-3">
                          <div className="small-muted">Izin</div>
                          <div className="fs-4 fw-bold">{profile.stats?.Izin ?? 0}</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card p-3">
                          <div className="small-muted">Sakit</div>
                          <div className="fs-4 fw-bold">{profile.stats?.Sakit ?? 0}</div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card p-3">
                          <div className="small-muted">Alfa</div>
                          <div className="fs-4 fw-bold">{profile.stats?.Alfa ?? 0}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <h5 className="fw-bold">Riwayat Kehadiran</h5>
                  <ul className="list-group mt-3">
                    {(profile?.history || []).length > 0 ? profile.history.map((item, index) => (
                      <li className="list-group-item" key={index}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">{item.tanggal_indo}</div>
                            <div className="small-muted">{item.nama_mapel} • {item.nama_guru}</div>
                          </div>
                          <span className="badge text-bg-primary">{item.status}</span>
                        </div>
                      </li>
                    )) : <li className="list-group-item text-muted">Belum ada riwayat presensi</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<StudentApp />);
