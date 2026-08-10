import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../services/studentsAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import { Table } from '../../../components/ui/Table/Table';
import { Modal } from '../../../components/ui/Modal/Modal';
import { FeedbackBanner } from '../../../components/common/Feedback/FeedbackBanner';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';

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

  if (isLoading) return <Loading message="Memuat data siswa..." />;
  if (error) return <ErrorMessage message="Gagal memuat data siswa. Pastikan backend tersedia." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <Table
        title="Data Siswa"
        icon="user-graduate"
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data siswa"
        onCreate={canCreate ? crud.openCreate : undefined}
        onEdit={canEdit ? crud.openEdit : undefined}
        onDelete={canDelete ? crud.removeRow : undefined}
        paginated
      />
      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Siswa' : 'Tambah Siswa'}
        fields={fields}
        initialValues={crud.editing || {}}
        onSubmit={crud.submit}
        onClose={crud.close}
      />
    </>
  );
}
