export function StudentSummaryCard({ student, profile }) {
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
