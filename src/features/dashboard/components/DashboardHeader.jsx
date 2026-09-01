import { useMemo } from 'react';
import Card from '../../../components/ui/Card/Card';

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
    <Card className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-dark sm:text-3xl">
            Selamat Datang, {userName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            Jumat, 7 Agustus 2026 • Jam Operasional: 06:30 - 15:30 WIB
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
};

export { DashboardHeader };
export default DashboardHeader;
