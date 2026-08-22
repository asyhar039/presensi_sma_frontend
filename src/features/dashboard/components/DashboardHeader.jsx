import { useMemo } from 'react';

const formatDate = (date) =>
  date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatTime = (date) =>
  date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

const DashboardHeader = ({ userName = 'Administrator' }) => {
  const now = useMemo(() => new Date(), []);

  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-dark sm:text-3xl">
          Selamat Datang, {userName} 👋
        </h1>
        <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"></span>
            <span className="relative inline-flex size-2 rounded-full bg-success"></span>
          </span>
          Sistem Aktif
        </p>
      </div>
      <div className="translate-y-1 text-left sm:text-right">
        <time dateTime={now.toISOString()} className="block text-sm font-semibold text-dark">
          {formatDate(now)}
        </time>
        <span className="mt-0.5 block text-xs text-muted">{formatTime(now)} WIB • Jam Operasional</span>
      </div>
    </header>
  );
};

export { DashboardHeader };
export default DashboardHeader;