import { useMemo, useState } from 'react';
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../services/studentsAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useDebounce } from '../../../hooks/useDebounce';
import { useCrud } from '../../../hooks/useCrud';
import { Button } from '../../../components/ui/Button/Button';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { DataTable } from '../../../components/data-display/DataTable/DataTable';
import { Modal } from '../../../components/feedback/Modal/Modal';
import { Form } from '../../../components/feedback/Form/Form';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog/ConfirmDialog';
import { Loading } from '../../../components/feedback/Loading/Loading';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';

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

const COLUMNS = [
  { key: 'nisn', label: 'NISN' },
  { key: 'nama_lengkap', label: 'Nama' },
  { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
  { key: 'nama_kelas', label: 'Kelas', render: (row) => row.nama_kelas || '-' },
  { key: 'no_telp', label: 'No. Telp', render: (row) => row.no_telp || '-' },
];

export function StudentTable() {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('siswa');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading, error } = useGetStudentsQuery();
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

  const rowActions = [
    ...(canEdit ? [{ key: 'edit', icon: 'edit', variant: 'outline-warning', label: 'Edit', onClick: crud.openEdit }] : []),
    ...(canDelete ? [{ key: 'delete', icon: 'trash', variant: 'outline-danger', label: 'Hapus', onClick: crud.requestRemove }] : []),
  ];

  if (isLoading) return <Loading message="Memuat data siswa..." />;
  if (error) return <ErrorState message="Gagal memuat data siswa. Pastikan backend tersedia." />;

  return (
    <>
      <DataTable
        title="Data Siswa"
        icon="user-graduate"
        columns={COLUMNS}
        rows={rows}
        emptyMessage="Belum ada data siswa"
        headerActions={canCreate ? <Button icon="plus" onClick={crud.openCreate}>Tambah</Button> : undefined}
        toolbar={<SearchInput value={search} onChange={setSearch} placeholder="Cari nama, NISN, atau kelas..." />}
        rowActions={rowActions}
        paginated
      />
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
    </>
  );
}