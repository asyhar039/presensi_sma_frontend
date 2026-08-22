import { useGetDashboardStatsQuery } from '../services/dashboardAPI';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSelectors';
import Alert from '../../../components/feedback/Alert/Alert';
import { isMaintenanceError } from '../../../utils/errors';
import DashboardHeader from './DashboardHeader';
import StatCardsRow from './StatCardsRow';
import LivePresenceTable from './LivePresenceTable';
import PresenceComposition from './PresenceComposition';

const DashboardView = () => {
  const { error } = useGetDashboardStatsQuery();
  const user = useAppSelector(selectUser);

  const offline = Boolean(error);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader userName={user?.nama_lengkap || 'Administrator'} />

      {offline ? (
        <Alert
          variant="warning"
          icon="exclamation-triangle"
          title={isMaintenanceError(error) ? 'Mode Pratinjau' : 'Data Belum Sinkron'}
        >
          <div className="text-sm">
            {isMaintenanceError(error)
              ? 'Service sedang dalam pemeliharaan. Data di bawah adalah simulasi pratinjau atau data yang tersimpan sebelumnya.'
              : 'Gagal memuat data terbaru. Menampilkan data yang tersedia.'}
          </div>
        </Alert>
      ) : null}

      <section aria-label="Ringkasan Statistik">
        <StatCardsRow />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2" aria-label="Live Presensi Siswa">
          <LivePresenceTable />
        </section>
        <section aria-label="Komposisi Presensi">
          <PresenceComposition />
        </section>
      </div>
    </div>
  );
};

export default DashboardView;