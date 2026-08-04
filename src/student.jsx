import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/student.css';
import { useStudentPortal } from './hooks/useStudentPortal';
import { StudentSummaryCard } from './components/admin/views/StudentSummaryCard';

function StudentApp() {
  const {
    form,
    setForm,
    student,
    loading,
    banner,
    profile,
    ready,
    handleLogin,
    handleLogout
  } = useStudentPortal();

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

              {banner?.text ? (
                <div 
                  className={
                    `alert alert-${banner.type === 'danger' ?
                    'danger' : banner.type === 'warning' ? 
                    'warning' : banner.type === 'success' ? 
                    'success' : 'info'}`
                    }>
                  {banner.text}
                </div>
              ) : null}

              {!student ? (
                <form onSubmit={handleLogin}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nama Lengkap</label>
                      <input 
                      className="form-control" 
                      value={form.username} 
                      onChange={(e) => setForm({ ...form, username: e.target.value })} 
                      placeholder="Masukkan nama lengkap" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">NISN</label>
                        <input 
                          className="form-control" 
                          value={form.password} 
                          onChange={(e) => setForm({ ...form, password: e.target.value })} 
                          placeholder="Masukkan NISN" required />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary mt-4"
                    disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}
                  </button>
                </form>
              ) : (
                <div>
                  <StudentSummaryCard student={student} profile={profile} />

                  <h5 className="fw-bold">Riwayat Kehadiran</h5>
                  <ul className="list-group mt-3">
                    {(profile?.history || []).length > 0 ? (profile.history || []).map((item, index) => (
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
