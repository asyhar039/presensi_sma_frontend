import { useMemo, useState } from 'react';
import { User, GraduationCap, BookOpen, Award, Search, ChevronDown, Phone, Mail } from 'lucide-react';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import { useCrud } from '../../../hooks/useCrud';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from '../services/teachersAPI';
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
  { key: 'nip', label: 'NIP', required: true },
  { key: 'nama_lengkap', label: 'Nama Lengkap', required: true },
  { key: 'username', label: 'Username', required: true },
  { key: 'password', label: 'Password', type: 'password', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'no_telp', label: 'No. Telp' },
  { key: 'alamat', label: 'Alamat' },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
  ] },
];

const TeacherTable = () => {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('guru');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading, error, refetch } = useGetTeachersQuery();
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const crud = useCrud({
    create: createTeacher,
    update: updateTeacher,
    remove: deleteTeacher,
    confirmMessage: (row) => `Hapus guru "${row.nama_lengkap}"?`,
    messages: {
      updated: 'Data guru berhasil diperbarui.',
      added: 'Data guru berhasil ditambahkan.',
      deleted: 'Data guru berhasil dihapus.',
      saveError: 'Terjadi kesalahan saat menyimpan data guru.',
      deleteError: 'Terjadi kesalahan saat menghapus data guru.',
    },
  });

  const fields = crud.editing
    ? FIELDS.filter((f) => !['username', 'password'].includes(f.key))
    : FIELDS;

  const rows = useMemo(() => {
    const data = response?.data || [];
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return data;
    return data.filter((row) =>
      [row.nama_lengkap, row.nip, row.email].some((value) =>
        value && value.toLowerCase().includes(query)
      )
    );
  }, [response, debouncedSearch]);

  const COLUMNS = [
    {
      key: 'nip',
      label: 'Kode & NIP',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 w-fit">
            GUR-{row.id}
          </span>
          <span className="text-xs text-slate-500">NIP {row.nip || '-'}</span>
        </div>
      ),
    },
    {
      key: 'nama_lengkap',
      label: 'Nama Guru',
      render: (row) => <span className="font-bold text-slate-900">{row.nama_lengkap}</span>,
    },
    {
      key: 'assignment',
      label: 'Penugasan / Wali Kelas',
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          {row.nama_kelas || 'Guru Mata Pelajaran'}
        </span>
      ),
    },
    {
      key: 'alamat',
      label: 'Alamat',
      render: (row) => <span className="text-slate-600 max-w-[200px] block truncate">{row.alamat || '-'}</span>,
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
  ];

  const rowActions = [
    ...(canEdit ? [{ key: 'edit', icon: 'edit', variant: 'outline-warning', label: 'Edit', onClick: crud.openEdit }] : []),
    ...(canDelete ? [{ key: 'delete', icon: 'trash', variant: 'outline-danger', label: 'Hapus', onClick: crud.requestRemove }] : []),
  ];

  if (isLoading) return <Loading message="Memuat data guru..." />;
  if (error) {
    const maintenance = isMaintenanceError(error);
    return (
      <ErrorState
        maintenance={maintenance}
        message={getErrorMessage(error, "Gagal memuat data guru. Silakan coba beberapa saat lagi.")}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Data Guru
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data induk guru, penugasan wali kelas, dan informasi kontak
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-full bg-indigo-50">
             <GraduationCap className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outline-secondary" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" icon="file-spreadsheet">
           Import Excel
        </Button>
        <Button variant="outline-secondary" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" icon="download">
           Export Data
        </Button>
        {canCreate ? (
          <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100" icon="plus" onClick={crud.openCreate}>
             Tambah Guru
          </Button>
        ) : null}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Guru Aktif</div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{rows.length}</span>
            <span className="text-sm font-medium text-slate-500">Guru</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Wali Kelas</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">12</span>
            <span className="text-sm font-medium text-emerald-600">Penugasan</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Guru Piket Hari Ini</div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">4</span>
            <span className="text-sm font-medium text-slate-500">Orang</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Status Sertifikasi</div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600">85%</span>
            <span className="text-sm font-medium text-blue-600">Tersertifikasi</span>
          </div>
        </Card>
      </div>

      {/* Main Table Section */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <DataTable
          title="Direktori Guru"
          columns={COLUMNS}
          rows={rows}
          emptyMessage="Belum ada data guru"
          toolbar={<SearchInput value={search} onChange={setSearch} placeholder="Cari nama, NIP, atau email..." />}
          rowActions={rowActions}
          paginated
          pageSize={10}
        />
      </div>

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Guru' : 'Tambah Guru'}
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

export default TeacherTable;
