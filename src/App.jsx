import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { menuItems } from './constants/menu';
import { useAuth } from './hooks/useAuth';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import { DashboardView } from './components/admin/DashboardView';
import { TableView } from './components/admin/TableView';
import { ClassView } from './components/admin/views/ClassView';
import { SubjectView } from './components/admin/views/SubjectView';
import { ScheduleView } from './components/admin/views/ScheduleView';
import { ReportView } from './components/admin/views/ReportView';
import { AttendanceView } from './components/admin/views/AttendanceView';

export default function App() {
  const { user, loading, setUser } = useAuth();
  const {
    stats,
    activeView,
    setActiveView,
    message,
    form,
    setForm,
    siswa,
    guru,
    kelas,
    mapel,
    jadwal,
    laporan,
    handleLogin,
    handleLogout
  } = useAdminDashboard(user, setUser);

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

      {activeView === 'kelas' && <ClassView items={kelas} />}

      {activeView === 'mapel' && <SubjectView items={mapel} />}

      {activeView === 'jadwal' && <ScheduleView items={jadwal} />}

      {activeView === 'absensi' && <AttendanceView />}

      {activeView === 'laporan' && <ReportView report={laporan} />}
    </Layout>
  );
}
