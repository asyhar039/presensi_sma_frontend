import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '../services/subjectsAPI';
import { useGetTeachersQuery } from '../../teachers/services/teachersAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import { Button } from '../../../components/ui/Button/Button';
import { Card } from '../../../components/ui/Card/Card';
import { CardGrid } from '../../../components/common/CardGrid/CardGrid';
import { Modal } from '../../../components/ui/Modal/Modal';
import { FeedbackBanner } from '../../../components/common/Feedback/FeedbackBanner';
import { Loading } from '../../../components/common/Loading/Loading';
import { ErrorMessage } from '../../../components/common/ErrorMessage/ErrorMessage';

const FIELDS = [
  { key: 'nama_mapel', label: 'Nama Mata Pelajaran', required: true },
  { key: 'kode_mapel', label: 'Kode Mapel', required: true, placeholder: 'Contoh: MTK01' },
  { key: 'guru_id', label: 'Guru Pengampu', type: 'select', required: true },
];

export function SubjectList() {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('mapel');

  const { data: response, isLoading, error } = useGetSubjectsQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  const crud = useCrud({
    create: createSubject,
    update: updateSubject,
    remove: deleteSubject,
    confirmMessage: (row) => `Hapus mata pelajaran "${row.nama_mapel}"?`,
    messages: {
      updated: 'Data mata pelajaran berhasil diperbarui.',
      added: 'Data mata pelajaran berhasil ditambahkan.',
      deleted: 'Data mata pelajaran berhasil dihapus.',
      saveError: 'Terjadi kesalahan saat menyimpan data mapel.',
      deleteError: 'Terjadi kesalahan saat menghapus data mapel.',
    },
  });

  const teachers = teacherResponse?.data || [];
  const fields = FIELDS.map((field) =>
    field.key === 'guru_id'
      ? { ...field, options: teachers.map((t) => ({ value: t.id, label: t.nama_lengkap })) }
      : field
  );

  const items = response?.data || [];

  if (isLoading) return <Loading message="Memuat mata pelajaran..." />;
  if (error) return <ErrorMessage message="Gagal memuat data mata pelajaran." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <Card title="Mata Pelajaran" icon="book-open">
        <div className="d-flex justify-content-end mb-3">
          {canCreate ? (
            <Button icon="plus" onClick={crud.openCreate}>Tambah</Button>
          ) : null}
        </div>
        <CardGrid
          items={items}
          getKey={(item) => item?.id || item?.kode_mapel}
          renderTitle={(item) => item?.nama_mapel || '-'}
          renderSubtitle={(item) => `Kode: ${item?.kode_mapel || '-'}`}
          renderMeta={(item) => `Pengampu: ${item?.guru_nama || '-'}`}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={crud.openEdit}
          onDelete={crud.removeRow}
          emptyMessage="Belum ada data mata pelajaran"
        />
      </Card>
      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
        fields={fields}
        initialValues={crud.editing || {}}
        onSubmit={crud.submit}
        onClose={crud.close}
      />
    </>
  );
}
