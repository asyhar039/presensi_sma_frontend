import { useGetAttendanceReportQuery } from '../attendanceAPI';
import { TableView } from '../../../shared/components/TableView';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

const COLUMNS = [
  { key: 'nama_lengkap', label: 'Nama Siswa', render: (row) => row.nama_lengkap || '-' },
  { key: 'total_hadir', label: 'Hadir', render: (row) => row.total_hadir ?? 0 },
  { key: 'total_izin', label: 'Izin', render: (row) => row.total_izin ?? 0 },
  { key: 'total_sakit', label: 'Sakit', render: (row) => row.total_sakit ?? 0 },
  { key: 'total_alfa', label: 'Alfa', render: (row) => row.total_alfa ?? 0 },
  { key: 'persentase_hadir', label: '% Hadir', render: (row) => `${row.persentase_hadir ?? 0}%` },
];

export function ReportView() {
  const { data: response, isLoading, error } = useGetAttendanceReportQuery();

  if (isLoading) return <LoadingState message="Memuat laporan absensi..." />;
  if (error) return <ErrorState message="Fitur laporan sedang dikembangkan. Laporan absensi akan segera tersedia." />;

  const report = response?.data || null;

  return (
    <TableView
      title="Laporan Absensi"
      icon="file-invoice"
      description={report ? `Bulan ${report.bulan_nama} ${report.tahun} • Kelas ${report.kelas?.nama_kelas || '-'}` : undefined}
      columns={COLUMNS}
      rows={report?.laporan || []}
      emptyMessage="Belum ada data laporan"
    />
  );
}
