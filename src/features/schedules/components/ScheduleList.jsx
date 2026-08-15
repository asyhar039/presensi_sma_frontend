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
import { Button } from '../../../components/ui/Button/Button';
import { DataTable } from '../../../components/data-display/DataTable/DataTable';
import { Modal } from '../../../components/feedback/Modal/Modal';
import { Form } from '../../../components/feedback/Form/Form';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog/ConfirmDialog';
import { Loading } from '../../../components/feedback/Loading/Loading';
import { ErrorState } from '../../../components/feedback/ErrorState/ErrorState';

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

  const rowActions = [
    ...(canEdit ? [{ key: 'edit', icon: 'edit', variant: 'outline-warning', label: 'Edit', onClick: crud.openEdit }] : []),
    ...(canDelete ? [{ key: 'delete', icon: 'trash', variant: 'outline-danger', label: 'Hapus', onClick: crud.requestRemove }] : []),
  ];

  if (isLoading) return <Loading message="Memuat jadwal pelajaran..." />;
  if (error) return <ErrorState message="Gagal memuat jadwal pelajaran." />;

  return (
    <>
      <DataTable
        title="Jadwal Pelajaran"
        icon="calendar-alt"
        columns={COLUMNS}
        rows={response?.data || []}
        emptyMessage="Belum ada data jadwal"
        headerActions={canCreate ? <Button icon="plus" onClick={crud.openCreate}>Tambah</Button> : undefined}
        rowActions={rowActions}
      />
      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Jadwal' : 'Tambah Jadwal'}
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