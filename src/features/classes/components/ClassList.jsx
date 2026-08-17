import {
  useGetClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from '../services/classesAPI';
import { useGetTeachersQuery } from '../../teachers/services/teachersAPI';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import Button from '../../../components/ui/Button/Button';
import Card from '../../../components/ui/Card/Card';
import CardGrid from '../../../components/data-display/CardGrid/CardGrid';
import Modal from '../../../components/feedback/Modal/Modal';
import Form from '../../../components/feedback/Form/Form';
import ConfirmDialog from '../../../components/feedback/ConfirmDialog/ConfirmDialog';
import Loading from '../../../components/feedback/Loading/Loading';
import ErrorState from '../../../components/feedback/ErrorState/ErrorState';

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

const ClassList = () => {
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

  if (isLoading) return <Loading message="Memuat data kelas..." />;
  if (error) return <ErrorState message="Gagal memuat data kelas." />;

  return (
    <>
      <Card
        title="Data Kelas"
        icon="school"
        actions={canCreate ? <Button icon="plus" onClick={crud.openCreate}>Tambah</Button> : undefined}
      >
        <CardGrid
          items={items}
          getKey={(item) => item?.id || item?.nama_kelas}
          renderTitle={(item) => item?.nama_kelas || '-'}
          renderSubtitle={(item) => `${item?.tingkat || '-'} - ${item?.jurusan || 'Umum'}`}
          renderMeta={(item) => `Wali Kelas: ${item?.guru_nama || '-'}`}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={crud.openEdit}
          onDelete={crud.requestRemove}
          emptyMessage="Belum ada data kelas"
        />
      </Card>
      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Kelas' : 'Tambah Kelas'}
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
};

export default ClassList;