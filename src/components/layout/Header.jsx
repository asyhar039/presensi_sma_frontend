import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const ROUTE_TITLES = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.STUDENTS]: 'Data Siswa',
  [`${ROUTES.STUDENTS}/create`]: 'Tambah Data Siswa',
  [ROUTES.TEACHERS]: 'Data Guru',
  [`${ROUTES.TEACHERS}/create`]: 'Tambah Data Guru',
  [ROUTES.CLASSES]: 'Kelas',
  [ROUTES.SUBJECTS]: 'Mata Pelajaran',
  [ROUTES.SCHEDULES]: 'Jadwal',
  [ROUTES.ATTENDANCE]: 'Presensi',
  [ROUTES.REPORTS]: 'Laporan',
  [ROUTES.PROFILE]: 'Profil',
};

const ROUTE_DESCRIPTIONS = {
  [ROUTES.DASHBOARD]: 'Ringkasan aktivitas presensi dan kehadiran sekolah hari ini.',
  [ROUTES.STUDENTS]: 'Kelola data induk siswa, kontak orang tua, dan histori akumulasi kehadiran',
  [`${ROUTES.STUDENTS}/create`]: 'Lengkapi informasi di bawah ini untuk menambahkan data siswa baru ke dalam sistem.',
  [ROUTES.TEACHERS]: 'Kelola informasi guru, akun login, dan plotting kelas mengajar',
  [`${ROUTES.TEACHERS}/create`]: 'Lengkapi informasi di bawah ini untuk menambahkan data guru baru ke dalam sistem.',
  [ROUTES.CLASSES]: 'Atur pembagian kelas, penugasan wali kelas, dan informasi rombel',
  [ROUTES.SUBJECTS]: 'Kelola daftar mata pelajaran dan penugasan guru pengampu',
  [ROUTES.SCHEDULES]: 'Atur dan pantau alokasi jadwal pelajaran, ruang khusus, serta validasi bentrok',
  [ROUTES.ATTENDANCE]: 'Pantau data absensi harian dan rekapitulasi kehadiran siswa',
  [ROUTES.REPORTS]: 'Kelola dan ekspor data kehadiran siswa secara periodik',
  [ROUTES.PROFILE]: 'Kelola informasi biodata dan akun pribadi Anda',
};

const formatDate = (date) =>
  date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const title = ROUTE_TITLES[location.pathname] || 'Dashboard';
  const description = ROUTE_DESCRIPTIONS[location.pathname] || 'Selamat datang di sistem presensi sekolah.';
  const isDashboard = location.pathname === ROUTES.DASHBOARD;

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayName = user?.nama_lengkap || 'Super Admin';

  return (
    <header className="mb-7 ml-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card-bg p-6 shadow-sm sm:px-8 lg:ml-0 border border-card-border">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-dark sm:text-3xl mb-0">
          {isDashboard ? `Selamat Datang, ${displayName} 👋` : title}
        </h1>
        <p className="mt-1 text-sm text-muted mb-0">
          {isDashboard ? `${formatDate(currentDate)} • Jam Operasional: 06:30 - 15:30 WIB` : description}
        </p>
      </div>

      <Link 
        to={ROUTES.PROFILE}
        className="flex min-w-0 items-center gap-3 rounded-xl p-1.5 transition-colors duration-200 hover:bg-gray-50 border border-transparent hover:border-slate-100"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </Link>
    </header>
  );
};

export default Header;
