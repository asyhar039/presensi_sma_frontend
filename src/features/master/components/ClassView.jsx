import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../masterAPI';
import { useGetTeachersQuery } from '../../teacher/teacherAPI';
import { useResourcePermissions } from '../../../shared/hooks/useResourcePermissions';
import { useCrud } from '../../../shared/hooks/useCrud';
import { SectionCard } from '../../../shared/components/SectionCard';
import { CardGridView } from '../../../shared/components/CardGridView';
import { FormModal } from '../../../shared/components/FormModal';
import { FeedbackBanner } from '../../../shared/components/FeedbackBanner';
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
  const { canCreate, canEdit, canDelete } = useResourcePermissions('kelas');

  const { data: response, isLoading, error } = useGetClassesQuery();
  const { data: teacherResponse } = useGetTeachersQuery();
  const [createClass] = useCreateClassMutation();
  const [updateClass] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const crud = useCrud({
    create: createClass,
    update: updateClass,
    remove: deleteClass,
    confirmMessage: (row) => `Hapus kelas "${row.nama_kelas}"?`,
    messages: {
      updated: 'Data kelas berhasil diperbarui.',
      added: 'Data kelas berhasil ditambahkan.',
      deleted: 'Data kelas berhasil dihapus.',
      saveError: 'Terjadi kesalahan saat menyimpan data kelas.',
      deleteError: 'Terjadi kesalahan saat menghapus data kelas.',
    },
  });

  const teachers = teacherResponse?.data || [];
  const fields = FIELDS.map((field) =>
    field.key === 'guru_id'
      ? { ...field, options: teachers.map((t) => ({ value: t.id, label: t.nama_lengkap })) }
      : field
  );

  const items = response?.data || [];

  if (isLoading) return <LoadingState message="Memuat data kelas..." />;
  if (error) return <ErrorState message="Gagal memuat data kelas." />;

  return (
    <>
      <FeedbackBanner message={crud.feedback} />
      <SectionCard title="Data Kelas" icon="school">
        <div className="d-flex justify-content-end mb-3">
          {canCreate ? (
            <button className="btn btn-sm btn-primary" onClick={crud.openCreate}>
              <i className="fas fa-plus me-1"></i> Tambah
            </button>
          ) : null}
        </div>
        <CardGridView
          items={items}
          getKey={(item) => item?.id || item?.nama_kelas}
          renderTitle={(item) => item?.nama_kelas || '-'}
          renderSubtitle={(item) => `${item?.tingkat || '-'} - ${item?.jurusan || 'Umum'}`}
          renderMeta={(item) => `Wali Kelas: ${item?.guru_nama || '-'}`}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={crud.openEdit}
          onDelete={crud.removeRow}
          emptyMessage="Belum ada data kelas"
        />
      </SectionCard>
      <FormModal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Kelas' : 'Tambah Kelas'}
        fields={fields}
        initialValues={crud.editing || {}}
        onSubmit={crud.submit}
        onClose={crud.close}
      />
    </>
  );
}
