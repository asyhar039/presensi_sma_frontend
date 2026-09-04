import { useMemo, useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, AlertTriangle, Plus, Printer, Download, ChevronDown, BookOpen } from 'lucide-react';
import { useResourcePermissions } from '../../../hooks/useResourcePermissions';
import { useCrud } from '../../../hooks/useCrud';
import {
  useGetSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from '../services/schedulesAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useGetSubjectsQuery } from '../../subjects/services/subjectsAPI';
import { useGetTeachersQuery } from '../../teachers/services/teachersAPI';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';
import Button from '../../../components/ui/Button/Button';
import Card from '../../../components/ui/Card/Card';
import Modal from '../../../components/feedback/Modal/Modal';
import Form from '../../../components/feedback/Form/Form';
import ConfirmDialog from '../../../components/feedback/ConfirmDialog/ConfirmDialog';
import Loading from '../../../components/feedback/Loading/Loading';
import ErrorState from '../../../components/feedback/ErrorState/ErrorState';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const HOURS = [
  { ke: 1, time: '07:00 - 07:45' },
  { ke: 2, time: '07:45 - 08:30' },
  { ke: 3, time: '08:30 - 09:15' },
  { ke: 'ISTIRAHAT', time: '09:15 - 09:30', isBreak: true },
  { ke: 4, time: '09:30 - 10:15' },
  { ke: 5, time: '10:15 - 11:00' },
];

const buildFields = (classes, subjects, teachers) => {
  return [
    { key: 'kelas_id', label: 'Kelas', type: 'select', required: true, options: classes.map((c) => ({ value: c.id, label: c.nama_kelas })) },
    { key: 'mata_pelajaran_id', label: 'Mata Pelajaran', type: 'select', required: true, options: subjects.map((s) => ({ value: s.id, label: s.nama_mapel })) },
    { key: 'guru_id', label: 'Guru', type: 'select', required: true, options: teachers.map((t) => ({ value: t.id, label: t.nama_lengkap })) },
    { key: 'hari', label: 'Hari', type: 'select', required: true, options: DAYS.map((d) => ({ value: d, label: d })) },
    { key: 'jam_mulai', label: 'Jam Mulai', type: 'time', required: true },
    { key: 'jam_selesai', label: 'Jam Selesai', type: 'time', required: true },
  ];
};

const ScheduleList = () => {
  const { canCreate, canEdit, canDelete } = useResourcePermissions('jadwal');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('ganjil');
  const [viewMode, setViewMode] = useState('mingguan'); // 'mingguan' | 'harian'

  const { data: response, isLoading, error, refetch } = useGetSchedulesQuery();
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

  const classes = classResponse?.data || [];
  const subjects = subjectResponse?.data || [];
  const teachers = teacherResponse?.data || [];
  const schedules = response?.data || [];

  const fields = buildFields(classes, subjects, teachers);

  if (isLoading) return <Loading message="Memuat jadwal pelajaran..." />;
  if (error) {
    const maintenance = isMaintenanceError(error);
    return (
      <ErrorState
        maintenance={maintenance}
        message={getErrorMessage(error, "Gagal memuat jadwal pelajaran. Silakan coba beberapa saat lagi.")}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Jam / Minggu</div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">1,420</span>
            <span className="text-sm font-medium text-emerald-600">92% Terisi</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Kelas Terjadwal</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">36</span>
            <span className="text-sm font-medium text-slate-500">Kelas</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Ruang Khusus Aktif</div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">8</span>
            <span className="text-sm font-medium text-slate-500">Lab / Ruangan</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Status Jadwal</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">0 Bentrok</span>
            <span className="text-sm font-medium text-emerald-600">Optimal</span>
          </div>
        </Card>
      </div>

      {/* Filter & View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-600"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nama_kelas}</option>
            ))}
          </select>

          <select
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-600"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="ganjil">Semester Ganjil</option>
            <option value="genap">Semester Genap</option>
          </select>
        </div>

        <div className="flex items-center rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('mingguan')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${viewMode === 'mingguan' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setViewMode('harian')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${viewMode === 'harian' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Harian
          </button>
        </div>
      </div>

      {/* Schedule Grid Matrix */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <th className="pb-4 pr-4 w-36">Jam / Waktu</th>
              {DAYS.map((day) => (
                <th key={day} className="pb-4 px-4 text-slate-900">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {HOURS.map((hour, idx) => (
              hour.isBreak ? (
                <tr key={idx} className="bg-slate-50/80">
                  <td className="py-3 pr-4 font-bold text-slate-500 text-xs">
                    ISTIRAHAT
                    <span className="block font-normal text-[11px] text-slate-400">{hour.time}</span>
                  </td>
                  <td colSpan={5} className="py-3 px-4 text-center font-semibold text-slate-400 text-xs tracking-wider uppercase">
                    Istirahat
                  </td>
                </tr>
              ) : (
                <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 pr-4 align-top">
                    <span className="font-bold text-slate-900 block">Ke-{hour.ke}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">{hour.time}</span>
                  </td>
                  {DAYS.map((day) => {
                    const match = schedules.find((s) => s.hari === day);
                    return (
                      <td key={day} className="py-4 px-3 align-top">
                        {match ? (
                          <div className="flex flex-col gap-1.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 shadow-sm transition-all hover:bg-indigo-50">
                            <span className="font-bold text-indigo-900 text-sm">{match.nama_mapel}</span>
                            <span className="text-xs font-medium text-slate-700">{match.guru_nama}</span>
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                              <span className="rounded-md bg-indigo-100/60 px-1.5 py-0.5 font-bold text-indigo-700">{match.nama_kelas}</span>
                              <span>Ruang 101</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={crud.openCreate}
                            className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all min-h-[100px]"
                          >
                            <Plus className="h-5 w-5" />
                            <span className="text-xs font-semibold">Tambah Slot</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={crud.modalOpen}
        title={crud.editing ? 'Edit Jadwal' : 'Tambah Slot Jadwal'}
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
    </div>
  );
};

export default ScheduleList;
