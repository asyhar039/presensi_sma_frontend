import { useState } from 'react';
import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../masterAPI';
import { useGetTeachersQuery } from '../../teacher/teacherAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUserPermissions } from '../../auth/authSelectors';
import { SectionCard } from '../../../shared/components/SectionCard';
import { FormModal } from '../../../shared/components/FormModal';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

const FIELDS = [
  { key: 'nama_kelas', label: 'Nama Kelas', required: true, placeholder: 'Contoh: X-A' },
  { key: 'tingkat', label: 'Tingkat', type: 'select', required: true, options: [
    { value: 'X', label: 'X (Sepuluh)' },
    { value: 'XI', label: 'XI (Sebelas)' },
    { value: 'XII', label: 'XII (Dua Belas)' },
  ] },
  { key: 'jurusan', label: 'Jurusan' },
  { key: 'guru_id', label: 'Wali Kelas', type: 'select' },
];

export function ClassView() {
  const permissions = useAppSelector(selectUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: response, isLoading, error } = useGetClassesQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const canCreate = permissions.includes('kelas.create');
  const canEdit = permissions.includes('kelas.edit');
  const canDelete = permissions.includes('kelas.delete');

  const teachers = teacherResponse?.data || [];
  const fields = FIELDS.map((field) =>
    field.key === 'guru_id'
      ? { ...field, options: teachers.map((t) => ({ value: t.id, label: t.nama_lengkap })) }
      : field
  );

  const items = response?.data || [];

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
        await updateClass({ ...values, id: editing.id }).unwrap();
        setFeedback('Data kelas berhasil diperbarui.');
      } else {
        await createClass(values).unwrap();
        setFeedback('Data kelas berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menyimpan data kelas.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus kelas "${row.nama_kelas}"?`)) return;
    try {
      await deleteClass(row.id).unwrap();
      setFeedback('Data kelas berhasil dihapus.');
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menghapus data kelas.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (isLoading) return <LoadingState message="Memuat data kelas..." />;
  if (error) return <ErrorState message="Gagal memuat data kelas." />;

  return (
    <>
      {feedback ? <div className="alert alert-info mb-3">{feedback}</div> : null}
      <SectionCard title="Data Kelas" icon="school">
        <div className="d-flex justify-content-end mb-3">
          {canCreate ? (
            <button className="btn btn-sm btn-primary" onClick={handleOpenCreate}>
              <i className="fas fa-plus me-1"></i> Tambah
            </button>
          ) : null}
        </div>
        <div className="row g-3">
          {items.length > 0 ? items.map((item) => (
            <div className="col-md-4" key={item?.id || item?.nama_kelas}>
              <div className="p-3 rounded-3 border">
                <div className="fw-bold">{item?.nama_kelas || '-'}</div>
                <div className="text-muted small">{item?.tingkat || '-'} - {item?.jurusan || 'Umum'}</div>
                <div className="text-muted small mt-2">Wali Kelas: {item?.guru_nama || '-'}</div>
                {(canEdit || canDelete) ? (
                  <div className="btn-group btn-group-sm mt-3">
                    {canEdit ? (
                      <button className="btn btn-outline-warning" onClick={() => handleOpenEdit(item)}>
                        <i className="fas fa-edit"></i>
                      </button>
                    ) : null}
                    {canDelete ? (
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(item)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          )) : <div className="text-muted">Belum ada data kelas</div>}
        </div>
      </SectionCard>
      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Kelas' : 'Tambah Kelas'}
        fields={fields}
        initialValues={editing || {}}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
