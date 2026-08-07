import { useState } from 'react';
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from '../studentAPI';
import { useGetClassesQuery } from '../../master/masterAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUserPermissions } from '../../auth/authSelectors';
import { TableView } from '../../../shared/components/TableView';
import { FormModal } from '../../../shared/components/FormModal';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

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

export function StudentTableView() {
  const permissions = useAppSelector(selectUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: response, isLoading, error } = useGetStudentsQuery();
  const { data: classResponse } = useGetClassesQuery();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const canCreate = permissions.includes('siswa.create');
  const canEdit = permissions.includes('siswa.edit');
  const canDelete = permissions.includes('siswa.delete');

  const classes = classResponse?.data || [];
  const fields = FIELDS.map((field) =>
    field.key === 'kelas_id'
      ? { ...field, options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })) }
      : field
  );

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editing?.id) {
        await updateStudent({ ...values, id: editing.id }).unwrap();
        setFeedback('Data siswa berhasil diperbarui.');
      } else {
        await createStudent(values).unwrap();
        setFeedback('Data siswa berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menyimpan data siswa.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus siswa "${row.nama_lengkap}"?`)) return;
    try {
      await deleteStudent(row.id).unwrap();
      setFeedback('Data siswa berhasil dihapus.');
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menghapus data siswa.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (isLoading) return <LoadingState message="Memuat data siswa..." />;
  if (error) return <ErrorState message="Gagal memuat data siswa. Pastikan backend tersedia." />;

  return (
    <>
      {feedback ? <div className="alert alert-info mb-3">{feedback}</div> : null}
      <TableView
        title="Data Siswa"
        icon="user-graduate"
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data siswa"
        onCreate={canCreate ? handleOpenCreate : undefined}
        onEdit={canEdit ? handleOpenEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />
      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Siswa' : 'Tambah Siswa'}
        fields={fields}
        initialValues={editing || {}}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
