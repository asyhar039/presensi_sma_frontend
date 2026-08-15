import { useGetDashboardStatsQuery } from '../services/dashboardAPI';
import { Loading } from '../../../components/feedback/Loading/Loading';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { Card } from '../../../components/ui/Card/Card';
import { StatisticCard } from '../../../components/data-display/StatisticCard/StatisticCard';
import { ATTENDANCE_LABELS } from '../../../constants/status';

export function DashboardView() {
  const { data: response, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <Loading message="Memuat statistik dashboard..." />;

  if (error) {
    return <ErrorState message="Fitur dashboard sedang dikembangkan. Statistik akan segera tersedia." />;
  }

  const stats = response?.data || {};
  const cards = [
    { label: 'Total Siswa', value: stats?.totals?.total_siswa ?? 0, icon: 'users', tone: 'primary' },
    { label: 'Total Guru', value: stats?.totals?.total_guru ?? 0, icon: 'chalkboard-teacher', tone: 'success' },
    { label: 'Total Kelas', value: stats?.totals?.total_kelas ?? 0, icon: 'school', tone: 'warning' },
    { label: 'Mata Pelajaran', value: stats?.totals?.total_mapel ?? 0, icon: 'book', tone: 'info' }
  ];

  const todayAttendance = stats?.today_attendance || {};
  const tones = ['success', 'info', 'warning', 'danger'];

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <StatisticCard key={card.label} label={card.label} value={card.value} icon={card.icon} tone={card.tone} layout="icon" />
        ))}
      </div>

      <Card title="Ringkasan Absensi Hari Ini" icon="clipboard-list">
        <div className="grid grid-cols-4 gap-4 text-center">
          {ATTENDANCE_LABELS.map((label, index) => (
            <StatisticCard key={label} label={label} value={todayAttendance[label] ?? 0} tone={tones[index] || 'secondary'} layout="flat" />
          ))}
        </div>
      </Card>
    </div>
  );
}