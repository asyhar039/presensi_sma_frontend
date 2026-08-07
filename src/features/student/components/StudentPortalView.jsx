import { useGetStudentProfileQuery } from '../studentAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

function StudentSummaryCard({ student, profile }) {
  return (
    <div className="stat-box mb-4">
      <div className="fw-bold">{student?.nama_lengkap || '-'}</div>
      <div className="small">NISN: {student?.nisn || '-'} • Kelas: {student?.nama_kelas || '-'}</div>
      {profile ? (
        <div className="row g-3 mt-3">
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
    </div>
  );
}

export function StudentPortalView() {
  const user = useAppSelector(selectUser);
  const { data: response, isLoading, error } = useGetStudentProfileQuery();

  if (isLoading) return <LoadingState message="Memuat profil siswa..." />;
  if (error) return <ErrorState message="Profil siswa tidak dapat dimuat saat ini." />;

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
              <span className="badge text-bg-primary">{item.status}</span>
            </div>
          </li>
        )) : <li className="list-group-item text-muted">Belum ada riwayat presensi</li>}
      </ul>
    </div>
  );
}
