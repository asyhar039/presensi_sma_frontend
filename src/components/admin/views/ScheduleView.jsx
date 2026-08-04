export function ScheduleView({ items }) {
  return (
    <div className="card-custom">
      <h5 className="fw-bold mb-3"><i className="fas fa-calendar-alt text-primary me-2"></i> Jadwal Pelajaran</h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Hari</th><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th><th>Jam</th></tr></thead>
          <tbody>
            {items && items.length > 0 ? items.map((item) => (
              <tr key={item?.id || item?.hari + item?.nama_kelas}>
                <td>{item?.hari || '-'}</td>
                <td>{item?.nama_kelas || '-'}</td>
                <td>{item?.nama_mapel || '-'}</td>
                <td>{item?.guru_nama || '-'}</td>
                <td>{item?.jam_mulai || '-'} - {item?.jam_selesai || '-'}</td>
              </tr>
            )) : <tr><td colSpan="5" className="text-muted">Belum ada data jadwal</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
