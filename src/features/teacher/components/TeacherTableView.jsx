import { useState } from 'react';
import {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} from '../teacherAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUserPermissions } from '../../auth/authSelectors';
import { TableView } from '../../../shared/components/TableView';
import { FormModal } from '../../../shared/components/FormModal';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

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

export function TeacherTableView() {
  const permissions = useAppSelector(selectUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: response, isLoading, error } = useGetTeachersQuery();
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const canCreate = permissions.includes('guru.create');
  const canEdit = permissions.includes('guru.edit');
  const canDelete = permissions.includes('guru.delete');

  const fields = editing
    ? FIELDS.filter((f) => !['username', 'password'].includes(f.key))
    : FIELDS;

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
        await updateTeacher({ ...values, id: editing.id }).unwrap();
        setFeedback('Data guru berhasil diperbarui.');
      } else {
        await createTeacher(values).unwrap();
        setFeedback('Data guru berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menyimpan data guru.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus guru "${row.nama_lengkap}"?`)) return;
    try {
      await deleteTeacher(row.id).unwrap();
      setFeedback('Data guru berhasil dihapus.');
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menghapus data guru.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (isLoading) return <LoadingState message="Memuat data guru..." />;
  if (error) return <ErrorState message="Gagal memuat data guru." />;

  return (
    <>
      {feedback ? <div className="alert alert-info mb-3">{feedback}</div> : null}
      <TableView
        title="Data Guru"
        icon="chalkboard-teacher"
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data guru"
        onCreate={canCreate ? handleOpenCreate : undefined}
        onEdit={canEdit ? handleOpenEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />
      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Guru' : 'Tambah Guru'}
        fields={fields}
        initialValues={editing || {}}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
