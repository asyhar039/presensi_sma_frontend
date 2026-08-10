import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from '../services/teachersAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import { Table } from '../../../components/ui/Table/Table';
import { Modal } from '../../../components/ui/Modal/Modal';
import { FeedbackBanner } from '../../../components/common/Feedback/FeedbackBanner';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';

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

  if (isLoading) return <Loading message="Memuat data guru..." />;
  if (error) return <ErrorMessage message="Gagal memuat data guru." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <Table
        title="Data Guru"
        icon="chalkboard-teacher"
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data guru"
        onCreate={canCreate ? crud.openCreate : undefined}
        onEdit={canEdit ? crud.openEdit : undefined}
        onDelete={canDelete ? crud.removeRow : undefined}
        paginated
      />
      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Guru' : 'Tambah Guru'}
        fields={fields}
        initialValues={crud.editing || {}}
        onSubmit={crud.submit}
        onClose={crud.close}
      />
    </>
  );
}
