import { useEffect, useState } from 'react';
import { apiRequest } from './services/api';
import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { menuItems } from './constants/menu';
import { useAuth } from './hooks/useAuth';
import { loginUser, logoutUser } from './services/auth';

function DashboardView({ stats }) {
  const cards = [
    { label: 'Total Siswa', value: stats?.totals?.total_siswa ?? 0, icon: 'users', tone: 'primary' },
    { label: 'Total Guru', value: stats?.totals?.total_guru ?? 0, icon: 'chalkboard-teacher', tone: 'success' },
    { label: 'Total Kelas', value: stats?.totals?.total_kelas ?? 0, icon: 'school', tone: 'warning' },
    { label: 'Mata Pelajaran', value: stats?.totals?.total_mapel ?? 0, icon: 'book', tone: 'info' }
  ];

  return (
    <div>
      <div className="row g-4 mb-4">
        {cards.map((card) => (
          <div className="col-md-3" key={card.label}>
            <div className="stat-card">
              <div className={`icon-box bg-${card.tone}`}><i className={`fas fa-${card.icon}`}></i></div>
              <div>
                <div className={`val text-${card.tone}`}>{card.value}</div>
                <div className="lbl">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-custom">
        <h5 className="fw-bold mb-3"><i className="fas fa-clipboard-list text-primary me-2"></i> Ringkasan Absensi Hari Ini</h5>
        <div className="row text-center g-3">
          {['Hadir', 'Izin', 'Sakit', 'Alfa'].map((label, index) => (
            <div className="col-3" key={label}>
              <div className={`p-3 rounded-3 ${index === 0 ? 'bg-success bg-opacity-10 text-success' : index === 1 ? 'bg-info bg-opacity-10 text-info' : index === 2 ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'}`}>
                <div className="fs-2 fw-bold">{stats?.today_attendance?.[label] ?? 0}</div>
                <div className="small fw-semibold">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableView({ title, icon, columns, rows, emptyMessage }) {
  return (
    <div className="card-custom">
      <h5 className="fw-bold mb-3"><i className={`fas fa-${icon} text-primary me-2`}></i> {title}</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            )) : <tr><td colSpan={columns.length} className="text-muted">{emptyMessage}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading, setUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeView, setActiveView] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const hash = window.location.hash.replace('#', '');
    return menuItems.some((item) => item.key === hash) ? hash : 'dashboard';
  });
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [laporan, setLaporan] = useState(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeView === 'laporan' && !laporan) {
      loadLaporan();
    }
  }, [activeView, laporan]);

  useEffect(() => {
    const syncViewFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (menuItems.some((item) => item.key === hash)) {
        setActiveView(hash);
      }
    };

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);

    return () => window.removeEventListener('hashchange', syncViewFromHash);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeView;
    }
  }, [activeView]);

  async function checkAuth() {
    try {
      const res = await apiRequest('/auth/me.php');
      if (res.status === 'success' && res.data?.user) {
        setUser(res.data.user);
        await Promise.all([loadStats(), loadMasterData()]);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      setMessage(error.message || 'Gagal memeriksa sesi');
    }
  }

  async function loadStats() {
    try {
      const res = await apiRequest('/dashboard/stats.php');
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (error) {
      setMessage(error.message || 'Gagal memuat dashboard');
    }
  }

  async function loadMasterData() {
    try {
      const [siswaRes, guruRes, kelasRes, mapelRes, jadwalRes] = await Promise.all([
        apiRequest('/siswa/index.php'),
        apiRequest('/guru/index.php'),
        apiRequest('/kelas/index.php'),
        apiRequest('/mapel/index.php'),
        apiRequest('/jadwal/index.php')
      ]);

      if (siswaRes.status === 'success') setSiswa(siswaRes.data || []);
      if (guruRes.status === 'success') setGuru(guruRes.data || []);
      if (kelasRes.status === 'success') setKelas(kelasRes.data || []);
      if (mapelRes.status === 'success') setMapel(mapelRes.data || []);
      if (jadwalRes.status === 'success') setJadwal(jadwalRes.data || []);
    } catch (error) {
      setMessage(error.message || 'Gagal memuat data master');
    }
  }

  async function loadLaporan() {
    try {
      const res = await apiRequest('/absensi/laporan.php');
      if (res.status === 'success') {
        setLaporan(res.data);
      }
    } catch (error) {
      setMessage(error.message || 'Gagal memuat laporan');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await loginUser(form.username, form.password);

      if (res.status === 'success') {
        await checkAuth();
      } else {
        setMessage(res.message || 'Login gagal');
      }
    } catch (error) {
      setMessage(error.message || 'Login gagal');
    }
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setStats(null);
    setSiswa([]);
    setGuru([]);
    setKelas([]);
    setMapel([]);
    setJadwal([]);
    setLaporan(null);
    setActiveView('dashboard');
    setMessage('');
  }

  if (loading) {
    return <div className="text-center py-5">Memuat aplikasi React...</div>;
  }

  if (!user) {
    return <LoginScreen form={form} onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))} onSubmit={handleLogin} message={message} />;
  }

  return (
    <Layout
      title={menuItems.find((item) => item.key === activeView)?.label || 'Dashboard'}
      user={user}
      activeView={activeView}
      onNavigate={setActiveView}
      onLogout={handleLogout}
    >
      {message ? <div className="alert alert-danger mb-3">{message}</div> : null}

      {activeView === 'dashboard' && <DashboardView stats={stats} />}

      {activeView === 'siswa' && (
        <TableView
          title="Data Siswa"
          icon="user-graduate"
          columns={[
            { key: 'nisn', label: 'NISN' },
            { key: 'nama_lengkap', label: 'Nama' },
            { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
            { key: 'nama_kelas', label: 'Kelas', render: (row) => row.nama_kelas || '-' },
            { key: 'no_telp', label: 'No. Telp', render: (row) => row.no_telp || '-' }
          ]}
          rows={siswa}
          emptyMessage="Belum ada data siswa"
        />
      )}

      {activeView === 'guru' && (
        <TableView
          title="Data Guru"
          icon="chalkboard-teacher"
          columns={[
            { key: 'nama_lengkap', label: 'Nama' },
            { key: 'nip', label: 'NIP' },
            { key: 'email', label: 'Email' },
            { key: 'no_telp', label: 'No. Telp', render: (row) => row.no_telp || '-' }
          ]}
          rows={guru}
          emptyMessage="Belum ada data guru"
        />
      )}

      {activeView === 'kelas' && (
        <div className="card-custom">
          <h5 className="fw-bold mb-3"><i className="fas fa-school text-primary me-2"></i> Data Kelas</h5>
          <div className="row g-3">
            {kelas.length > 0 ? kelas.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="p-3 rounded-3 border">
                  <div className="fw-bold">{item.nama_kelas}</div>
                  <div className="text-muted small">{item.tingkat} - {item.jurusan || 'Umum'}</div>
                  <div className="text-muted small mt-2">Wali Kelas: {item.guru_nama || '-'}</div>
                </div>
              </div>
            )) : <div className="text-muted">Belum ada data kelas</div>}
          </div>
        </div>
      )}

      {activeView === 'mapel' && (
        <div className="card-custom">
          <h5 className="fw-bold mb-3"><i className="fas fa-book-open text-primary me-2"></i> Mata Pelajaran</h5>
          <div className="row g-3">
            {mapel.length > 0 ? mapel.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="p-3 rounded-3 border">
                  <div className="fw-bold">{item.nama_mapel}</div>
                  <div className="text-muted small">Kode: {item.kode_mapel}</div>
                  <div className="text-muted small mt-2">Pengampu: {item.guru_nama || '-'}</div>
                </div>
              </div>
            )) : <div className="text-muted">Belum ada data mata pelajaran</div>}
          </div>
        </div>
      )}

      {activeView === 'jadwal' && (
        <div className="card-custom">
          <h5 className="fw-bold mb-3"><i className="fas fa-calendar-alt text-primary me-2"></i> Jadwal Pelajaran</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Hari</th><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th><th>Jam</th></tr></thead>
              <tbody>
                {jadwal.length > 0 ? jadwal.map((item) => (
                  <tr key={item.id}>
                    <td>{item.hari}</td>
                    <td>{item.nama_kelas}</td>
                    <td>{item.nama_mapel}</td>
                    <td>{item.guru_nama}</td>
                    <td>{item.jam_mulai} - {item.jam_selesai}</td>
                  </tr>
                )) : <tr><td colSpan="5" className="text-muted">Belum ada data jadwal</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'absensi' && (
        <div className="card-custom">
          <h5 className="fw-bold mb-3"><i className="fas fa-clipboard-check text-primary me-2"></i> Absensi</h5>
          <div className="alert alert-info">Fitur absensi siap dikembangkan lebih lanjut dengan daftar siswa dan form input per jadwal.</div>
        </div>
      )}

      {activeView === 'laporan' && (
        <div className="card-custom">
          <h5 className="fw-bold mb-3"><i className="fas fa-file-invoice text-primary me-2"></i> Laporan Absensi</h5>
          {laporan ? (
            <div>
              <div className="mb-3 text-muted">Bulan {laporan.bulan_nama} {laporan.tahun} • Kelas {laporan.kelas?.nama_kelas || '-'}</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead><tr><th>Nama Siswa</th><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alfa</th><th>% Hadir</th></tr></thead>
                  <tbody>
                    {laporan.laporan.map((item) => (
                      <tr key={item.siswa_id}>
                        <td>{item.nama_lengkap}</td>
                        <td>{item.total_hadir}</td>
                        <td>{item.total_izin}</td>
                        <td>{item.total_sakit}</td>
                        <td>{item.total_alfa}</td>
                        <td>{item.persentase_hadir}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : <div className="text-muted">Memuat laporan...</div>}
        </div>
      )}
    </Layout>
  );
}
