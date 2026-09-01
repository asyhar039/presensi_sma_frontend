import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, TrendingUp, AlertTriangle, AlertCircle, Phone, Mail } from 'lucide-react';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import { useCrud } from '../../../hooks/useCrud';
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../services/studentsAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';
import Button from '../../../components/ui/Button/Button';
import SearchInput from '../../../components/ui/SearchInput/SearchInput';
import DataTable from '../../../components/data-display/DataTable/DataTable';
import Card from '../../../components/ui/Card/Card';
import Modal from '../../../components/feedback/Modal/Modal';
import Form from '../../../components/feedback/Form/Form';
import ConfirmDialog from '../../../components/feedback/ConfirmDialog/ConfirmDialog';
import Loading from '../../../components/feedback/Loading/Loading';
import ErrorState from '../../../components/feedback/ErrorState/ErrorState';

const FIELDS = [
  { key: 'nisn', label: 'NISN', required: true },
  { key: 'nama_lengkap', label: 'Nama Lengkap', required: true },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', required: true, options: [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
  ] },
  { key: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date' },
  { key: 'no_telp', label: 'No. Telp' },
  { key: 'alamat', label: 'Alamat' },
  { key: 'kelas_id', label: 'Kelas', type: 'select' },
];

const StudentTable = () => {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('siswa');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading, error, refetch } = useGetStudentsQuery();
  const { data: classResponse } = useGetClassesQuery();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const crud = useCrud({
    create: createStudent,
    update: updateStudent,
    remove: deleteStudent,
    confirmMessage: (row) => `Hapus siswa "${row.nama_lengkap}"?`,
    messages: {
      updated: 'Data siswa berhasil diperbarui.',
      added: 'Data siswa berhasil ditambahkan.',
      deleted: 'Data siswa berhasil dihapus.',
      saveError: 'Terjadi kesalahan saat menyimpan data siswa.',
      deleteError: 'Terjadi kesalahan saat menghapus data siswa.',
    },
  });

  const navigate = useNavigate();

  const classes = classResponse?.data || [];
  const fields = FIELDS.map((field) =>
    field.key === 'kelas_id'
      ? { ...field, options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })) }
      : field
  );

  const rows = useMemo(() => {
    const data = response?.data || [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) =>
      [row.nama_lengkap, row.nisn, row.nama_kelas].some((value) =>
        value && value.toLowerCase().includes(query)
      )
    );
  }, [response, debouncedSearch]);

  const COLUMNS = [
    {
      key: 'nisn',
      label: 'NIS',
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-900">{row.nisn || row.id}</span>
        </div>
      ),
    },
    {
      key: 'nama_lengkap',
      label: 'Nama Siswa',
      render: (row) => <span className="text-sm font-semibold text-slate-900">{row.nama_lengkap}</span>,
    },
    {
      key: 'nama_kelas',
      label: 'Kelas',
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          {row.nama_kelas || '-'}
        </span>
      ),
    },
    {
      key: 'alamat',
      label: 'Alamat',
      render: (row) => <span className="text-sm text-slate-600 max-w-[200px] block truncate">{row.alamat || '-'}</span>,
    },
    {
      key: 'kontak',
      label: 'Kontak & Email',
      render: (row) => (
        <div className="flex flex-col gap-1 text-slate-500 text-xs">
          <div className="flex items-center gap-1.5"><Phone className="size-3" /> <span>{row.no_telp || '-'}</span></div>
          <div className="flex items-center gap-1.5"><Mail className="size-3" /> <span>{row.email || '-'}</span></div>
        </div>
      ),
    },
    {
      key: 'akumulasi',
      label: (
        <div className="flex flex-col gap-1">
          <span>Akumulasi Presensi</span>
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase">
            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500" /> H</div>
            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-indigo-500" /> I</div>
            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500" /> S</div>
            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-rose-500" /> A</div>
          </div>
        </div>
      ),
      render: () => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">12</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">0</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">2</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-600">0</div>
        </div>
      ),
    },
  ];

  const rowActions = [
    ...(canEdit ? [{ key: 'edit', icon: 'edit', variant: 'outline-warning', label: 'Edit', onClick: crud.openEdit }] : []),
    ...(canEdit ? [{ key: 'reset', icon: 'rotate-ccw-key', variant: 'outline-info', label: 'Reset Password', onClick: (row) => alert(`Reset password untuk siswa ${row.nama_lengkap}`) }] : []),
    ...(canDelete ? [{ key: 'delete', icon: 'trash', variant: 'outline-danger', label: 'Hapus', onClick: crud.requestRemove }] : []),
  ];

  if (isLoading) return <Loading message="Memuat data siswa..." />;
  if (error) {
    const maintenance = isMaintenanceError(error);
    return (
      <ErrorState
        maintenance={maintenance}
        message={getErrorMessage(error, "Gagal memuat data siswa. Silakan coba beberapa saat lagi.")}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outline-secondary" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50" icon="download" onClick={() => alert('Export Data')}>
           Export Data
        </Button>
        {canCreate ? (
          <Button variant="primary" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-md shadow-indigo-100" icon="plus" onClick={() => navigate('/siswa/create')}>
             Tambah Siswa
          </Button>
        ) : null}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none p-5 bg-white rounded-2xl shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Siswa Aktif</div>
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{rows.length}</span>
            <span className="text-sm font-medium text-slate-500">Siswa</span>
          </div>
        </Card>

        <Card className="border-none p-5 bg-white rounded-2xl shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tingkat Kehadiran</div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">95.4%</span>
            <span className="text-sm font-medium text-emerald-600">Rata-rata</span>
          </div>
        </Card>

        <Card className="border-none p-5 bg-white rounded-2xl shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Izin / Sakit Hari Ini</div>
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">28</span>
            <span className="text-sm font-medium text-slate-500">Siswa</span>
          </div>
        </Card>

        <Card className="border-none p-5 bg-white rounded-2xl shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase leading-tight">At-Risk / Alpa &gt; 3 Kali</div>
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">4</span>
            <span className="text-sm font-medium text-rose-600">Siswa</span>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama atau NIS siswa..."
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Agustus 2024</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2">
          <select className="bg-white border-0 text-sm font-medium text-slate-700 focus:outline-none">
            <option>Semester Ganjil 2023/2024</option>
            <option>Semester Genap 2023/2024</option>
          </select>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2">
          <select className="bg-white border-0 text-sm font-medium text-slate-700 focus:outline-none">
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Non-Aktif</option>
          </select>
        </div>
      </Card>

      {/* Main Table Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <DataTable
          columns={COLUMNS}
          rows={rows}
          emptyMessage="Belum ada data siswa"
          rowActions={rowActions}
          paginated
          pageSize={7}
        />
      </div>

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Siswa' : 'Tambah Siswa'}
        onClose={crud.close}
      >
        <Form
          fields={fields}
          initialValues={crud.editing || {}}
          onSubmit={crud.submit}
          onCancel={crud.close}
        />
      </Modal>
      <ConfirmDialog {...crud.confirmDialog} confirmLabel="Hapus" />
    </div>
  );
};

export default StudentTable;
