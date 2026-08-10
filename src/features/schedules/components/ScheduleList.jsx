import {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '../services/schedulesAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useGetSubjectsQuery } from '../../subjects/services/subjectsAPI';
import { useGetTeachersQuery } from '../../teachers/services/teachersAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import { Table } from '../../../components/ui/Table/Table';
import { Modal } from '../../../components/ui/Modal/Modal';
import { FeedbackBanner } from '../../../components/common/Feedback/FeedbackBanner';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';

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

export function ScheduleList() {
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

  if (isLoading) return <Loading message="Memuat jadwal pelajaran..." />;
  if (error) return <ErrorMessage message="Gagal memuat jadwal pelajaran." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <Table
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
      <Modal
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
