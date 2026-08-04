import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { loginUser, logoutUser } from '../services/auth';
import { menuItems } from '../constants/menu';

export function useAdminDashboard(user, setUser) {
  const [stats, setStats] = useState(null);
  const [activeView, setActiveView] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const hash = window.location.hash.replace('#', '');
    return menuItems.some((item) => item.key === hash) ? hash : 'dashboard';
  });
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ username: '', password: '' });
  const [siswa, setSiswa] = useState([]);
  const [guru, setGuru] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [laporan, setLaporan] = useState(null);

  useEffect(() => {
    const syncViewFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (menuItems.some((item) => item.key === hash)) {
        setActiveView(hash);
      }
    };

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);

    return () => window.removeEventListener('hashchange', syncViewFromHash);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeView;
    }
  }, [activeView]);

  useEffect(() => {
    if (activeView === 'laporan' && !laporan) {
      loadLaporan();
    }
  }, [activeView, laporan]);

  async function checkAuth() {
    try {
      const res = await apiRequest('/auth/me.php');
      if (res.status === 'success' && res.data?.user) {
        setUser(res.data.user);
        setMessage('');
        await Promise.all([loadStats(), loadMasterData()]);
      } else {
        setUser(null);
        setMessage(res.message || 'Sesi tidak aktif');
      }
    } catch (error) {
      setUser(null);
      setMessage(error.message || 'Gagal memeriksa sesi');
    }
  }

  async function loadStats() {
    try {
      const res = await apiRequest('/dashboard/stats.php');
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (error) {
      setMessage(error.message || 'Gagal memuat dashboard');
    }
  }

  async function loadMasterData() {
    try {
      const [siswaRes, guruRes, kelasRes, mapelRes, jadwalRes] = await Promise.all([
        apiRequest('/siswa/index.php'),
        apiRequest('/guru/index.php'),
        apiRequest('/kelas/index.php'),
        apiRequest('/mapel/index.php'),
        apiRequest('/jadwal/index.php')
      ]);

      if (siswaRes.status === 'success') setSiswa(siswaRes.data || []);
      if (guruRes.status === 'success') setGuru(guruRes.data || []);
      if (kelasRes.status === 'success') setKelas(kelasRes.data || []);
      if (mapelRes.status === 'success') setMapel(mapelRes.data || []);
      if (jadwalRes.status === 'success') setJadwal(jadwalRes.data || []);
    } catch (error) {
      setMessage(error.message || 'Gagal memuat data master');
    }
  }

  async function loadLaporan() {
    try {
      const res = await apiRequest('/absensi/laporan.php');
      if (res.status === 'success') {
        setLaporan(res.data);
      }
    } catch (error) {
      setMessage(error.message || 'Gagal memuat laporan');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await loginUser(form.username, form.password);

      if (res.status === 'success') {
        await checkAuth();
      } else {
        setMessage(res.message || 'Login gagal');
      }
    } catch (error) {
      setMessage(error.message || 'Login gagal. Periksa username dan password Anda.');
    }
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setStats(null);
    setSiswa([]);
    setGuru([]);
    setKelas([]);
    setMapel([]);
    setJadwal([]);
    setLaporan(null);
    setActiveView('dashboard');
    setMessage('');
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    stats,
    activeView,
    setActiveView,
    message,
    form,
    setForm,
    siswa,
    guru,
    kelas,
    mapel,
    jadwal,
    laporan,
    handleLogin,
    handleLogout,
    checkAuth,
    loadLaporan
  };
}
