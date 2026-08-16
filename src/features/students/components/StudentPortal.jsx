import { useGetStudentProfileQuery } from '../services/studentsAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import { Loading } from '../../../components/feedback/Loading/Loading';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';
import { EmptyState } from '../../../components/feedback/EmptyState/EmptyState';
import { StatisticCardList } from '../../../components/data-display/StatisticCard/StatisticCard';
import { StatusBadge } from '../../../components/data-display/StatusBadge/StatusBadge';
import { ATTENDANCE_LABELS } from '../../../constants/status';

function StudentSummaryCard({ student, profile }) {
  return (
    <div className="mb-4">
      <div className="font-bold">{student?.nama_lengkap || '-'}</div>
      <div className="text-sm">NISN: {student?.nisn || '-'} • Kelas: {student?.nama_kelas || '-'}</div>
      {profile ? <StatisticCardList stats={profile.stats || {}} labels={ATTENDANCE_LABELS} /> : null}
    </div>
  );
}

export function StudentPortal() {
  const user = useAppSelector(selectUser);
  const { data: response, isLoading, error } = useGetStudentProfileQuery();

  if (isLoading) return <Loading message="Memuat profil siswa..." />;
  if (error) return <ErrorState message="Profil siswa tidak dapat dimuat saat ini." />;

  const profile = response?.data || null;
  const student = profile?.student || user;
  const history = profile?.history || [];
  const stats = profile?.stats || {};

  return (
    <div className="rounded-lg border border-[#dee2e6] bg-white p-4">
      <div className="mb-6">
        <h2 className="mb-1 text-3xl font-bold">Portal Siswa</h2>
        <p className="mb-0 text-sm text-muted">Pantau profil dan riwayat absensi Anda</p>
      </div>

      <StudentSummaryCard student={student} profile={{ ...profile, stats }} />

      <h5 className="mt-6 text-xl font-bold">Riwayat Kehadiran</h5>
      <ul className="mt-4 flex flex-col divide-y divide-[#dee2e6] rounded-md border border-[#dee2e6] bg-white">
        {history.length > 0 ? history.map((item, index) => (
          <li className="flex items-center justify-between px-4 py-2" key={index}>
            <div>
              <div className="font-semibold">{item.tanggal_indo}</div>
              <div className="text-sm text-muted">{item.nama_mapel} • {item.nama_guru}</div>
            </div>
            <StatusBadge status={item.status} />
          </li>
        )) : (
          <li className="px-4 py-2">
            <EmptyState message="Belum ada riwayat presensi" />
          </li>
        )}
      </ul>
    </div>
  );
}