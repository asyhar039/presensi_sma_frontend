import { useState } from 'react';
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '../masterAPI';
import { useGetTeachersQuery } from '../../teacher/teacherAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUserPermissions } from '../../auth/authSelectors';
import { SectionCard } from '../../../shared/components/SectionCard';
import { FormModal } from '../../../shared/components/FormModal';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

const FIELDS = [
  { key: 'nama_mapel', label: 'Nama Mata Pelajaran', required: true },
  { key: 'kode_mapel', label: 'Kode Mapel', required: true, placeholder: 'Contoh: MTK01' },
  { key: 'guru_id', label: 'Guru Pengampu', type: 'select', required: true },
];

export function SubjectView() {
  const permissions = useAppSelector(selectUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: response, isLoading, error } = useGetSubjectsQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  const canCreate = permissions.includes('mapel.create');
  const canEdit = permissions.includes('mapel.edit');
  const canDelete = permissions.includes('mapel.delete');

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
        await updateSubject({ ...values, id: editing.id }).unwrap();
        setFeedback('Data mata pelajaran berhasil diperbarui.');
      } else {
        await createSubject(values).unwrap();
        setFeedback('Data mata pelajaran berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menyimpan data mapel.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus mata pelajaran "${row.nama_mapel}"?`)) return;
    try {
      await deleteSubject(row.id).unwrap();
      setFeedback('Data mata pelajaran berhasil dihapus.');
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menghapus data mapel.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (isLoading) return <LoadingState message="Memuat mata pelajaran..." />;
  if (error) return <ErrorState message="Gagal memuat data mata pelajaran." />;

  return (
    <>
      {feedback ? <div className="alert alert-info mb-3">{feedback}</div> : null}
      <SectionCard title="Mata Pelajaran" icon="book-open">
        <div className="d-flex justify-content-end mb-3">
          {canCreate ? (
            <button className="btn btn-sm btn-primary" onClick={handleOpenCreate}>
              <i className="fas fa-plus me-1"></i> Tambah
            </button>
          ) : null}
        </div>
        <div className="row g-3">
          {items.length > 0 ? items.map((item) => (
            <div className="col-md-4" key={item?.id || item?.kode_mapel}>
              <div className="p-3 rounded-3 border">
                <div className="fw-bold">{item?.nama_mapel || '-'}</div>
                <div className="text-muted small">Kode: {item?.kode_mapel || '-'}</div>
                <div className="text-muted small mt-2">Pengampu: {item?.guru_nama || '-'}</div>
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
          )) : <div className="text-muted">Belum ada data mata pelajaran</div>}
        </div>
      </SectionCard>
      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        fields={fields}
        initialValues={editing || {}}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
