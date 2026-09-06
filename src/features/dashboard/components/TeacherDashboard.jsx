import { CalendarDays, CheckCircle2, ClipboardCheck, Users } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import Card from '../../../components/ui/Card/Card';
import StatisticCard from '../../../components/data-display/StatisticCard/StatisticCard';
import StatusBadge from '../../../components/data-display/StatusBadge/StatusBadge';
import Button from '../../../components/ui/Button/Button';

const teacherPreview = {
  stats: [
    { label: 'Jadwal Hari Ini', value: '4', icon: 'calendar-alt', tone: 'primary' },
    { label: 'Kelas Diampu', value: '3', icon: 'users', tone: 'info' },
    { label: 'Presensi Hari Ini', value: '86', icon: 'clipboard-check', tone: 'success' },
    { label: 'Kehadiran', value: '94.8%', icon: 'chart-line', tone: 'warning' },
  ],
  schedule: [
    { time: '07:00 - 07:45', className: 'XI IPA 1', subject: 'Matematika', status: 'Selesai' },
    { time: '08:30 - 09:15', className: 'X MIPA 2', subject: 'Matematika', status: 'Berlangsung' },
    { time: '10:15 - 11:00', className: 'XII IPA 1', subject: 'Matematika', status: 'Berikutnya' },
  ],
};

const TeacherDashboard = () => {
  const user = useAppSelector(selectUser);
  const displayName = user?.nama_lengkap || 'Guru';

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Ringkasan hari ini" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teacherPreview.stats.map((stat) => (
          <StatisticCard key={stat.label} {...stat} layout="icon" />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Jadwal Mengajar Hari Ini" icon="calendar">
          <div className="divide-y divide-slate-100">
            {teacherPreview.schedule.map((item) => (
              <div key={`${item.time}-${item.className}`} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-bold text-slate-900">{item.subject}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.className} · {item.time}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Presensi Kelas" icon="clipboard-check">
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold">2 kelas sudah direkap</span>
            </div>
            <p className="mt-2 text-sm text-emerald-700/80">Satu kelas sedang menunggu presensi.</p>
          </div>
          <Button className="mt-4 w-full" icon="clipboard-check">Mulai Presensi</Button>
        </Card>
      </div>

      <Card title="Aktivitas Terbaru" icon="users">
        <div className="flex items-start gap-3 text-sm text-slate-600">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <span>Rekap presensi XI IPA 1 diperbarui hari ini pukul 07:50.</span>
        </div>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
