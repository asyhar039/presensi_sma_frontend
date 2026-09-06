import { CalendarDays, CheckCircle2, Clock3, School } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import Card from '../../../components/ui/Card/Card';
import StatisticCard from '../../../components/data-display/StatisticCard/StatisticCard';
import StatusBadge from '../../../components/data-display/StatusBadge/StatusBadge';

// Local preview data only. Student profile/statistics are not available from the current backend contract.
const studentPreview = {
  className: 'XI IPA 1',
  stats: [
    { label: 'Kehadiran', value: '95.8%', icon: 'chart-line', tone: 'primary' },
    { label: 'Hadir', value: '18 Hari', icon: 'user-check', tone: 'success' },
    { label: 'Izin', value: '1 Hari', icon: 'info-circle', tone: 'info' },
    { label: 'Alpa', value: '1 Hari', icon: 'exclamation-triangle', tone: 'danger' },
  ],
  schedule: [
    { time: '07:00 - 07:45', subject: 'Matematika', room: 'Ruang 201' },
    { time: '08:30 - 09:15', subject: 'Fisika', room: 'Lab Sains' },
    { time: '10:15 - 11:00', subject: 'Bahasa Inggris', room: 'Ruang 201' },
  ],
  recent: [
    { date: 'Jumat, 4 September 2026', subject: 'Matematika', status: 'Hadir' },
    { date: 'Kamis, 3 September 2026', subject: 'Fisika', status: 'Izin' },
    { date: 'Rabu, 2 September 2026', subject: 'Bahasa Inggris', status: 'Hadir' },
  ],
};

const StudentDashboard = () => {
  const user = useAppSelector(selectUser);
  const displayName = user?.nama_lengkap || 'Siswa';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
        <School className="h-4 w-4" />
        Kelas {studentPreview.className}
      </div>

      <section aria-label="Ringkasan kehadiran" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studentPreview.stats.map((stat) => (
          <StatisticCard key={stat.label} {...stat} layout="icon" />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card title="Jadwal Pelajaran Hari Ini" icon="calendar-alt">
          <div className="divide-y divide-slate-100">
            {studentPreview.schedule.map((item) => (
              <div key={`${item.time}-${item.subject}`} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <div>
                    <p className="font-bold text-slate-900">{item.subject}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.time} · {item.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Status Hari Ini" icon="clipboard-check">
          <div className="rounded-xl bg-emerald-50 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
            <p className="mt-2 font-bold text-emerald-800">Presensi hari ini tercatat</p>
            <p className="mt-1 text-sm text-emerald-700/80">Terakhir diperbarui pukul 07:05</p>
            <StatusBadge status="Hadir" className="mt-3" />
          </div>
        </Card>
      </div>

      <Card title="Riwayat Presensi Terbaru" icon="clipboard-list">
        <div className="divide-y divide-slate-100">
          {studentPreview.recent.map((item) => (
            <div key={`${item.date}-${item.subject}`} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-semibold text-slate-900">{item.subject}</p>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
