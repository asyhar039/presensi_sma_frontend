import { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Copy, QrCode } from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import StatusBadge from '../../../components/data-display/StatusBadge/StatusBadge';

const previewLogs = [
  { no: 1, name: 'Ahmad Dhani', nis: '12345', time: '07:02', status: 'Hadir' },
  { no: 2, name: 'Budi Santoso', nis: '12346', time: '07:05', status: 'Hadir' },
  { no: 3, name: 'Citra Kirana', nis: '12347', time: '-', status: 'Menunggu' },
  { no: 4, name: 'Dina Pratiwi', nis: '12348', time: '-', status: 'Menunggu' },
];

const AttendanceView = () => {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60 + 24);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 15 * 60 + 24));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Card className="flex min-h-[320px] flex-col items-center justify-center border border-slate-200 bg-slate-50/60 p-6 shadow-sm">
            <div className="flex size-40 items-center justify-center border-2 border-dashed border-slate-300 bg-white text-slate-500 shadow-inner sm:size-48">
              <div className="flex flex-col items-center gap-2 text-center">
                <QrCode className="size-24 text-slate-700" strokeWidth={1.25} />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">QR Preview</span>
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
              <Clock3 className="h-4 w-4" />Berlaku hingga&nbsp; {minutes}:{seconds}
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Placeholder slicing. QR aktif menunggu integrasi backend.</p>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline-primary" icon="rotate" className="h-14 border-slate-300 bg-white text-xs text-slate-700">Generate QR Baru</Button>
            <Button variant="outline-danger" icon="times" className="h-14 border-slate-300 bg-white text-xs text-slate-700">Tutup Presensi</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status Kehadiran</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <strong className="text-3xl font-extrabold text-slate-900">30</strong>
                  <span className="text-sm text-slate-500">/ 36 Siswa Sudah Presensi</span>
                </div>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl border-2 border-indigo-500 text-sm font-bold text-indigo-600">83%</div>
            </div>
          </Card>

          <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><CheckCircle2 className="h-5 w-5 text-indigo-600" />Log Presensi Real-time</h2>
              <span className="inline-flex items-center gap-1.5 rounded bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600"><span className="size-1.5 rounded-full bg-indigo-500" />Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr><th className="px-5 py-3 font-semibold">No</th><th className="px-3 py-3 font-semibold">Nama Siswa</th><th className="px-3 py-3 font-semibold">NIS</th><th className="px-3 py-3 font-semibold">Waktu Scan</th><th className="px-3 py-3 font-semibold">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewLogs.map((row) => (
                    <tr key={row.no} className="text-slate-700">
                      <td className="px-5 py-3 text-slate-400">{row.no}</td><td className="px-3 py-3 font-medium text-slate-800">{row.name}</td><td className="px-3 py-3">{row.nis}</td><td className="px-3 py-3">{row.time}</td><td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="flex w-full items-center justify-center gap-2 border-t border-slate-200 px-5 py-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"><Copy className="h-3.5 w-3.5" />Lihat Semua Data (36 Siswa)</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;