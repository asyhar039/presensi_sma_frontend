import {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '../scheduleAPI';
import { useGetClassesQuery, useGetSubjectsQuery } from '../../master/masterAPI';
import { useGetTeachersQuery } from '../../teacher/teacherAPI';
import { useResourcePermissions } from '../../../shared/hooks/useResourcePermissions';
import { useCrud } from '../../../shared/hooks/useCrud';
import { TableView } from '../../../shared/components/TableView';
import { FormModal } from '../../../shared/components/FormModal';
import { FeedbackBanner } from '../../../shared/components/FeedbackBanner';
import { LoadingState } from '../../../shared/components/LoadingState';
import { ErrorState } from '../../../shared/components/ErrorState';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const COLUMNS = [
  { key: 'hari', label: 'Hari', render: (row) => row.hari || '-' },
  { key: 'nama_kelas', label: 'Kelas', render: (row) => row.nama_kelas || '-' },
  { key: 'nama_mapel', label: 'Mata Pelajaran', render: (row) => row.nama_mapel || '-' },
  { key: 'guru_nama', label: 'Guru', render: (row) => row.guru_nama || '-' },
  { key: 'jam', label: 'Jam', render: (row) => `${row.jam_mulai || '-'} - ${row.jam_selesai || '-'}` },
];

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
  const { canCreate, canEdit, canDelete } = useResourcePermissions('jadwal');

  const { data: response, isLoading, error } = useGetSchedulesQuery();
  const { data: classResponse } = useGetClassesQuery();
  const { data: subjectResponse } = useGetSubjectsQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const crud = useCrud({
    create: createSchedule,
    update: updateSchedule,
    remove: deleteSchedule,
    confirmMessage: (row) => `Hapus jadwal ${row.hari} - ${row.nama_mapel}?`,
    messages: {
      updated: 'Jadwal berhasil diperbarui.',
      added: 'Jadwal berhasil ditambahkan.',
      deleted: 'Jadwal berhasil dihapus.',
      saveError: 'Terjadi kesalahan saat menyimpan jadwal.',
      deleteError: 'Terjadi kesalahan saat menghapus jadwal.',
    },
  });

  const fields = buildFields(
    classResponse?.data || [],
    subjectResponse?.data || [],
    teacherResponse?.data || []
  );

  if (isLoading) return <LoadingState message="Memuat jadwal pelajaran..." />;
  if (error) return <ErrorState message="Gagal memuat jadwal pelajaran." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <TableView
        title="Jadwal Pelajaran"
        icon="calendar-alt"
        canCreate={canCreate}
        canEdit={canEdit}
        canDelete={canDelete}
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data jadwal"
        onCreate={canCreate ? crud.openCreate : undefined}
        onEdit={canEdit ? crud.openEdit : undefined}
        onDelete={canDelete ? crud.removeRow : undefined}
      />
      <FormModal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Jadwal' : 'Tambah Jadwal'}
        fields={fields}
        initialValues={crud.editing || {}}
        onSubmit={crud.submit}
        onClose={crud.close}
      />
    </>
  );
}
