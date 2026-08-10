import { useGetDashboardStatsQuery } from '../services/dashboardAPI';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';
import { Card } from '../../../components/ui/Card/Card';
import { ATTENDANCE_LABELS } from '../../../constants/status';

export function DashboardView() {
  const { data: response, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <Loading message="Memuat statistik dashboard..." />;
  
  if (error) {
    return <ErrorMessage message="Fitur dashboard sedang dikembangkan. Statistik akan segera tersedia." />;
  }

  const stats = response?.data || {};
  const cards = [
    { label: 'Total Siswa', value: stats?.totals?.total_siswa ?? 0, icon: 'users', tone: 'primary' },
    { label: 'Total Guru', value: stats?.totals?.total_guru ?? 0, icon: 'chalkboard-teacher', tone: 'success' },
    { label: 'Total Kelas', value: stats?.totals?.total_kelas ?? 0, icon: 'school', tone: 'warning' },
    { label: 'Mata Pelajaran', value: stats?.totals?.total_mapel ?? 0, icon: 'book', tone: 'info' }
  ];

  const todayAttendance = stats?.today_attendance || {};
  const tones = ['bg-success bg-opacity-10 text-success', 'bg-info bg-opacity-10 text-info', 'bg-warning bg-opacity-10 text-warning', 'bg-danger bg-opacity-10 text-danger'];

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

      <Card title="Ringkasan Absensi Hari Ini" icon="clipboard-list">
        <div className="row text-center g-3">
          {ATTENDANCE_LABELS.map((label, index) => (
            <div className="col-3" key={label}>
              <div className={`p-3 rounded-3 ${tones[index] || 'bg-secondary bg-opacity-10 text-secondary'}`}>
                <div className="fs-2 fw-bold">{todayAttendance[label] ?? 0}</div>
                <div className="small fw-semibold">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
