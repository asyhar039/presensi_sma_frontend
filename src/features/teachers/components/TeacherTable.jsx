import { useMemo, useState } from 'react';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from '../services/teachersAPI';
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

const COLUMNS = [
  { key: 'nama_lengkap', label: 'Nama' },
  { key: 'nip', label: 'NIP' },
  { key: 'email', label: 'Email' },
  { key: 'no_telp', label: 'No. Telp', render: (row) => row.no_telp || '-' },
];

export function TeacherTable() {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('guru');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading, error } = useGetTeachersQuery();
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

  const rowActions = [
    ...(canEdit ? [{ key: 'edit', icon: 'edit', variant: 'outline-warning', label: 'Edit', onClick: crud.openEdit }] : []),
    ...(canDelete ? [{ key: 'delete', icon: 'trash', variant: 'outline-danger', label: 'Hapus', onClick: crud.requestRemove }] : []),
  ];

  if (isLoading) return <Loading message="Memuat data guru..." />;
  if (error) return <ErrorState message="Gagal memuat data guru." />;

  return (
    <>
      <DataTable
        title="Data Guru"
        icon="chalkboard-teacher"
        columns={COLUMNS}
        rows={rows}
        emptyMessage="Belum ada data guru"
        headerActions={canCreate ? <Button icon="plus" onClick={crud.openCreate}>Tambah</Button> : undefined}
        toolbar={<SearchInput value={search} onChange={setSearch} placeholder="Cari nama, NIP, atau email..." />}
        rowActions={rowActions}
        paginated
      />
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
    </>
  );
}