export function ReportView({ report }) {
  return (
    <div className="card-custom">
      <h5 className="fw-bold mb-3"><i className="fas fa-file-invoice text-primary me-2"></i> Laporan Absensi</h5>
      {report ? (
        <div>
          <div className="mb-3 text-muted">Bulan {report.bulan_nama} {report.tahun} • Kelas {report.kelas?.nama_kelas || '-'}</div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Nama Siswa</th><th>Hadir</th><th>Izin</th><th>Sakit</th><th>Alfa</th><th>% Hadir</th></tr></thead>
              <tbody>
                {(report?.laporan || []).map((item) => (
                  <tr key={item?.siswa_id || item?.nama_lengkap}>
                    <td>{item?.nama_lengkap || '-'}</td>
                    <td>{item?.total_hadir ?? 0}</td>
                    <td>{item?.total_izin ?? 0}</td>
                    <td>{item?.total_sakit ?? 0}</td>
                    <td>{item?.total_alfa ?? 0}</td>
                    <td>{item?.persentase_hadir ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : <div className="text-muted">Memuat laporan...</div>}
    </div>
  );
}
