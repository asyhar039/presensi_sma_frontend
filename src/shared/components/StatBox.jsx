const ATTENDANCE_LABELS = ['Hadir', 'Izin', 'Sakit', 'Alfa'];

export function StatBox({ label, value }) {
  return (
    <div className="card p-3">
      <div className="small-muted">{label}</div>
      <div className="fs-4 fw-bold">{value}</div>
    </div>
  );
}

export function AttendanceStatsRow({ stats = {}, labels = ATTENDANCE_LABELS, className = 'row g-3 mt-3' }) {
  return (
    <div className={className}>
      {labels.map((label) => (
        <div className="col-md-3" key={label}>
          <StatBox label={label} value={stats[label] ?? 0} />
        </div>
      ))}
    </div>
  );
}
