export function DashboardView({ stats }) {
  const cards = [
    { label: 'Total Siswa', value: stats?.totals?.total_siswa ?? 0, icon: 'users', tone: 'primary' },
    { label: 'Total Guru', value: stats?.totals?.total_guru ?? 0, icon: 'chalkboard-teacher', tone: 'success' },
    { label: 'Total Kelas', value: stats?.totals?.total_kelas ?? 0, icon: 'school', tone: 'warning' },
    { label: 'Mata Pelajaran', value: stats?.totals?.total_mapel ?? 0, icon: 'book', tone: 'info' }
  ];

  const todayAttendance = stats?.today_attendance || {};

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
                <div className="fs-2 fw-bold">{todayAttendance[label] ?? 0}</div>
                <div className="small fw-semibold">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
