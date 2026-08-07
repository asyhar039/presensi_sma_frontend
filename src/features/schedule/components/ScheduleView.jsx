import { useState } from 'react';
import {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '../scheduleAPI';
import { useGetClassesQuery } from '../../master/masterAPI';
import { useGetSubjectsQuery } from '../../master/masterAPI';
import { useGetTeachersQuery } from '../../teacher/teacherAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUserPermissions } from '../../auth/authSelectors';
import { FormModal } from '../../../shared/components/FormModal';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

function buildFields(classes, subjects, teachers) {
  return [
    { key: 'kelas_id', label: 'Kelas', type: 'select', required: true, options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })) },
    { key: 'mata_pelajaran_id', label: 'Mata Pelajaran', type: 'select', required: true, options: subjects.map((s) => ({ value: s.id, label: s.nama_mapel })) },
    { key: 'guru_id', label: 'Guru', type: 'select', required: true, options: teachers.map((t) => ({ value: t.id, label: t.nama_lengkap })) },
    { key: 'hari', label: 'Hari', type: 'select', required: true, options: DAYS.map((d) => ({ value: d, label: d })) },
    { key: 'jam_mulai', label: 'Jam Mulai', type: 'time', required: true },
    { key: 'jam_selesai', label: 'Jam Selesai', type: 'time', required: true },
  ];
}

export function ScheduleView() {
  const permissions = useAppSelector(selectUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: response, isLoading, error } = useGetSchedulesQuery();
  const { data: classResponse } = useGetClassesQuery();
  const { data: subjectResponse } = useGetSubjectsQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const canCreate = permissions.includes('jadwal.create');
  const canEdit = permissions.includes('jadwal.edit');
  const canDelete = permissions.includes('jadwal.delete');

  const items = response?.data || [];
  const fields = buildFields(
    classResponse?.data || [],
    subjectResponse?.data || [],
    teacherResponse?.data || []
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
        await updateSchedule({ ...values, id: editing.id }).unwrap();
        setFeedback('Jadwal berhasil diperbarui.');
      } else {
        await createSchedule(values).unwrap();
        setFeedback('Jadwal berhasil ditambahkan.');
      }
      setModalOpen(false);
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menyimpan jadwal.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus jadwal ${row.hari} - ${row.nama_mapel}?`)) return;
    try {
      await deleteSchedule(row.id).unwrap();
      setFeedback('Jadwal berhasil dihapus.');
    } catch (e) {
      setFeedback(e?.data?.message || 'Terjadi kesalahan saat menghapus jadwal.');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  if (isLoading) return <LoadingState message="Memuat jadwal pelajaran..." />;
  if (error) return <ErrorState message="Gagal memuat jadwal pelajaran." />;

  return (
    <>
      {feedback ? <div className="alert alert-info mb-3">{feedback}</div> : null}
      <div className="card-custom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0"><i className="fas fa-calendar-alt text-primary me-2"></i> Jadwal Pelajaran</h5>
          {canCreate ? (
            <button className="btn btn-sm btn-primary" onClick={handleOpenCreate}>
              <i className="fas fa-plus me-1"></i> Tambah
            </button>
          ) : null}
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Hari</th><th>Kelas</th><th>Mata Pelajaran</th><th>Guru</th><th>Jam</th>
                {(canEdit || canDelete) ? <th className="text-end">Aksi</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item) => (
                <tr key={item?.id || item?.hari + item?.nama_kelas}>
                  <td>{item?.hari || '-'}</td>
                  <td>{item?.nama_kelas || '-'}</td>
                  <td>{item?.nama_mapel || '-'}</td>
                  <td>{item?.guru_nama || '-'}</td>
                  <td>{item?.jam_mulai || '-'} - {item?.jam_selesai || '-'}</td>
                  {(canEdit || canDelete) ? (
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {canEdit ? (
                          <button className="btn btn-outline-warning" title="Edit" onClick={() => handleOpenEdit(item)}>
                            <i className="fas fa-edit"></i>
                          </button>
                        ) : null}
                        {canDelete ? (
                          <button className="btn btn-outline-danger" title="Hapus" onClick={() => handleDelete(item)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        ) : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              )) : <tr><td colSpan={5 + ((canEdit || canDelete) ? 1 : 0)} className="text-muted">Belum ada data jadwal</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <FormModal
        open={modalOpen}
        title={editing ? 'Edit Jadwal' : 'Tambah Jadwal'}
        fields={fields}
        initialValues={editing || {}}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
