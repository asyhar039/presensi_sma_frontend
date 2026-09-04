import { useMemo, useState } from 'react';
import { Calendar, Printer, Download, ChevronDown, Check, MoreHorizontal } from 'lucide-react';
import { useGetAttendanceReportQuery } from '../services/reportsAPI';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useGetSubjectsQuery } from '../../subjects/services/subjectsAPI';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectAttendanceFilters } from '../../attendance/attendanceSelectors';
import { setFilters, resetFilters } from '../../attendance/attendanceSlice';
import Button from '../../../components/ui/Button/Button';
import Card from '../../../components/ui/Card/Card';
import Avatar from '../../../components/ui/Avatar/Avatar';
import Loading from '../../../components/feedback/Loading/Loading';
import ErrorState from '../../../components/feedback/ErrorState/ErrorState';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';

const DAYS_HEADER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ReportView = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectAttendanceFilters);
  const { data: classResponse } = useGetClassesQuery();
  const { data: subjectResponse } = useGetSubjectsQuery();
  const { data: response, isLoading, error, refetch } = useGetAttendanceReportQuery(filters);

  const [selectedMonth, setSelectedMonth] = useState('Agustus 2023');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const classes = classResponse?.data || [];
  const subjects = subjectResponse?.data || [];

  const handleReset = () => {
    dispatch(resetFilters());
    setSelectedClass('all');
    setSelectedSubject('all');
  };

  if (isLoading) return <Loading message="Memuat laporan absensi..." />;
  if (error) {
    const maintenance = isMaintenanceError(error);
    return (
      <ErrorState
        maintenance={maintenance}
        message={getErrorMessage(error, "Fitur laporan sedang dikembangkan atau layanan tidak tersedia.")}
        onRetry={refetch}
      />
    );
  }

  const studentsReport = [
    {
      id: 'SIS-001',
      name: 'Ahmad Wijaya',
      nisn: '1029384756',
      attendanceDays: ['H', 'H', 'H', 'H', 'H', '-', '-', 'I', 'H', 'H'],
      h: 8,
      i: 1,
      s: 0,
      a: 0,
      percentage: 88,
    },
    {
      id: 'SIS-002',
      name: 'Budi Kurniawan',
      nisn: '1029384757',
      attendanceDays: ['H', 'H', 'S', 'S', 'H', '-', '-', 'H', 'A', 'H'],
      h: 5,
      i: 0,
      s: 2,
      a: 1,
      percentage: 55,
    },
    {
      id: 'SIS-003',
      name: 'Citra Lestari',
      nisn: '1029384758',
      attendanceDays: ['H', 'H', 'H', 'H', 'H', '-', '-', 'H', 'H', 'H'],
      h: 8,
      i: 0,
      s: 0,
      a: 0,
      percentage: 100,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Hari Efektif</div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">20</span>
            <span className="text-sm font-medium text-slate-500">Hari</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Rata-rata Kehadiran</div>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">+2.1%</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">95.8%</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Siswa Alpa &gt;3 Hari</div>
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">Perhatian</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">4</span>
            <span className="text-sm font-medium text-slate-500">Siswa</span>
          </div>
        </Card>

        <Card className="border-none shadow-sm p-5 flex flex-col justify-between h-full bg-white rounded-3xl">
          <div className="flex items-start justify-between">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase">Kelas Terdisiplin</div>
            <span className="text-sm font-bold text-indigo-600">98.4%</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900">XII MIPA 2</span>
          </div>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Bulan & Tahun</span>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="Agustus 2023">Agustus 2023</option>
              <option value="September 2023">September 2023</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Kelas</span>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 outline-none"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.nama_kelas}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Mata Pelajaran</span>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 outline-none"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">Semua Mapel</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.nama_mapel}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Status Kehadiran</span>
            <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700">
              Multi-Status Dipilih (3) <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline-secondary" onClick={handleReset} className="rounded-xl border-slate-200 text-slate-700">
            Reset
          </Button>
          <Button variant="primary" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none px-5">
            Terapkan
          </Button>
        </div>
      </div>

      {/* Report Table Matrix */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <th className="pb-4 pr-4">Nama Siswa / NISN</th>
              {DAYS_HEADER.map((d) => (
                <th key={d} className="pb-4 px-2 text-center text-slate-600">{d}</th>
              ))}
              <th className="pb-4 px-2 text-center text-slate-900">H</th>
              <th className="pb-4 px-2 text-center text-slate-900">I</th>
              <th className="pb-4 px-2 text-center text-slate-900">S</th>
              <th className="pb-4 px-2 text-center text-rose-600">A</th>
              <th className="pb-4 px-4 text-left text-slate-900">% Kehadiran</th>
              <th className="pb-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {studentsReport.map((student, idx) => (
              <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} size={36} className="bg-indigo-100 text-indigo-700 font-bold" />
                    <div>
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-400">{student.nisn}</div>
                    </div>
                  </div>
                </td>
                {student.attendanceDays.map((status, dayIdx) => (
                  <td key={dayIdx} className="py-4 px-2 text-center">
                    {status === 'H' ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : status === 'S' ? (
                      <span className="font-bold text-amber-500">S</span>
                    ) : status === 'I' ? (
                      <span className="font-bold text-indigo-500">I</span>
                    ) : status === 'A' ? (
                      <span className="font-bold text-rose-500">A</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                ))}
                <td className="py-4 px-2 text-center font-bold text-slate-900">{student.h}</td>
                <td className="py-4 px-2 text-center font-bold text-slate-600">{student.i}</td>
                <td className="py-4 px-2 text-center font-bold text-slate-600">{student.s}</td>
                <td className="py-4 px-2 text-center font-bold text-rose-600 bg-rose-50/30 rounded-lg">{student.a}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${student.percentage < 75 ? 'bg-rose-500' : 'bg-indigo-600'}`}
                        style={{ width: `${student.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{student.percentage}%</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                    <MoreHorizontal className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-medium text-slate-500">Menampilkan 1-3 dari 36 siswa</span>
          <div className="flex items-center gap-1">
            <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              &lt;
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
              1
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50">
              3
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
