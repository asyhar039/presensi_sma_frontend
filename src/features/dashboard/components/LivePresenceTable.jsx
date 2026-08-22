import { livePresenceData } from '../../../mocks/dashboardMock';
import RenderIcon from '../../../utils/iconMap';
import Badge from '../../../components/ui/Badge/Badge';

const STATUS_META = {
  hadir: { tone: 'success', label: 'Hadir' },
  terlambat: { tone: 'warning', label: 'Terlambat' },
  izin: { tone: 'info', label: 'Izin' },
  alpa: { tone: 'danger', label: 'Alpa' },
};

const LivePresenceRow = ({ student }) => {
  const meta = STATUS_META[student.status] || STATUS_META.alpa;
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand" aria-hidden="true">
            {student.initials}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-dark">{student.name}</div>
            <div className="truncate text-xs text-muted">{student.studentId}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted">{student.classSubject}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap text-muted">{student.scanTime}</td>
      <td className="px-4 py-3 text-right">
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </td>
    </tr>
  );
};

const LivePresenceTable = ({ data = livePresenceData }) => {
  return (
    <div className="rounded-lg border border-card-border bg-card-bg shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
        <div>
          <h5 className="mb-0.5 font-bold text-dark">Live Presensi Siswa Masuk</h5>
          <p className="mb-0 text-xs text-muted">Diperbarui secara realtime hari ini</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" aria-hidden="true"></span>
            <span className="relative inline-flex size-2 rounded-full bg-success" aria-hidden="true"></span>
          </span>
          Live
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-2.5 text-xs font-semibold text-muted">Nama Siswa</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-muted">Kelas / Mapel</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-muted">Waktu Scan</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <LivePresenceRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 text-right">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
        >
          <RenderIcon name="users" className="h-3.5 w-3.5" aria-hidden="true" />
          Lihat semua siswa
        </button>
      </div>
    </div>
  );
};

export { LivePresenceTable };
export default LivePresenceTable;