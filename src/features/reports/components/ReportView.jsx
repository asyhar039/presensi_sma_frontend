import { useGetAttendanceReportQuery } from '../services/reportsAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectAttendanceFilters } from '../../attendance/attendanceSelectors';
import { setFilters, resetFilters } from '../../attendance/attendanceSlice';
import DataTable from '../../../components/data-display/DataTable/DataTable';
import FilterBar from '../../../components/data-display/FilterBar/FilterBar';
import Loading from '../../../components/feedback/Loading/Loading';
import ErrorState from '../../../components/feedback/ErrorState/ErrorState';

const COLUMNS = [
  { key: 'nama_lengkap', label: 'Nama Siswa', render: (row) => row.nama_lengkap || '-' },
  { key: 'total_hadir', label: 'Hadir', render: (row) => row.total_hadir ?? 0 },
  { key: 'total_izin', label: 'Izin', render: (row) => row.total_izin ?? 0 },
  { key: 'total_sakit', label: 'Sakit', render: (row) => row.total_sakit ?? 0 },
  { key: 'total_alfa', label: 'Alfa', render: (row) => row.total_alfa ?? 0 },
  { key: 'persentase_hadir', label: '% Hadir', render: (row) => `${row.persentase_hadir ?? 0}%` },
];

const toMonthValue = (filters) => {
  if (!filters.bulan || !filters.tahun) return '';
  return `${filters.tahun}-${String(filters.bulan).padStart(2, '0')}`;
};

const ReportView = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectAttendanceFilters);
  const { data: classResponse } = useGetClassesQuery();
  const { data: response, isLoading, error } = useGetAttendanceReportQuery(filters);

  const classes = classResponse?.data || [];
  const filterConfig = [
    {
      key: 'kelas_id',
      label: 'Kelas',
      type: 'select',
      options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })),
      placeholder: '-- Semua Kelas --',
    },
    { key: 'bulan', label: 'Bulan', type: 'month' },
  ];

  const filterValues = {
    kelas_id: filters.kelas_id ?? '',
    bulan: toMonthValue(filters),
  };

  const handleFilterChange = (key, value) => {
    if (key === 'bulan') {
      const [tahun, bulan] = String(value || '').split('-');
      dispatch(setFilters({ bulan: bulan ? String(Number(bulan)) : null, tahun: tahun || null }));
    } else {
      dispatch(setFilters({ [key]: value }));
    }
  };

  const handleReset = () => dispatch(resetFilters());

  if (isLoading) return <Loading message="Memuat laporan absensi..." />;
  if (error) return <ErrorState message="Fitur laporan sedang dikembangkan. Laporan absensi akan segera tersedia." />;

  const report = response?.data || null;

  return (
    <>
      <FilterBar
        filters={filterConfig}
        values={filterValues}
        onChange={handleFilterChange}
        onReset={handleReset}
      />
      <DataTable
        title="Laporan Absensi"
        icon="file-invoice"
        description={report ? `Bulan ${report.bulan_nama} ${report.tahun} • Kelas ${report.kelas?.nama_kelas || '-'}` : undefined}
        columns={COLUMNS}
        rows={report?.laporan || []}
        emptyMessage="Belum ada data laporan"
      />
    </>
  );
};

export default ReportView;