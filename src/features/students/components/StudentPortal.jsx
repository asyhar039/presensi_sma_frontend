import { useGetStudentProfileQuery } from '../services/studentsAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';
import { StatCardRow } from '../../../components/ui/StatCard/StatCard';
import { Badge } from '../../../components/ui/Badge/Badge';

function StudentSummaryCard({ student, profile }) {
  return (
    <div className="stat-box mb-4">
      <div className="fw-bold">{student?.nama_lengkap || '-'}</div>
      <div className="small">NISN: {student?.nisn || '-'} • Kelas: {student?.nama_kelas || '-'}</div>
      {profile ? <StatCardRow stats={profile.stats || {}} /> : null}
    </div>
  );
}

export function StudentPortal() {
  const user = useAppSelector(selectUser);
  const { data: response, isLoading, error } = useGetStudentProfileQuery();

  if (isLoading) return <Loading message="Memuat profil siswa..." />;
  if (error) return <ErrorMessage message="Profil siswa tidak dapat dimuat saat ini." />;

  const profile = response?.data || null;
  const student = profile?.student || user;
  const history = profile?.history || [];
  const stats = profile?.stats || {};

  return (
    <div className="card p-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Portal Siswa</h2>
        <p className="small-muted mb-0">Pantau profil dan riwayat absensi Anda</p>
      </div>

      <StudentSummaryCard student={student} profile={{ ...profile, stats }} />

      <h5 className="fw-bold mt-4">Riwayat Kehadiran</h5>
      <ul className="list-group mt-3">
        {history.length > 0 ? history.map((item, index) => (
          <li className="list-group-item" key={index}>
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-semibold">{item.tanggal_indo}</div>
                <div className="small-muted">{item.nama_mapel} • {item.nama_guru}</div>
              </div>
              <Badge status={item.status} />
            </div>
          </li>
        )) : <li className="list-group-item text-muted">Belum ada riwayat presensi</li>}
      </ul>
    </div>
  );
}
