import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api';

function getUserFriendlyMessage(error, fallback = 'Terjadi kesalahan.') {
  const message = error?.message || '';
  if (message.includes('Failed to fetch') || message.includes('fetch')) {
    return 'Backend sedang tidak tersedia. Pastikan server PHP berjalan di http://127.0.0.1:8000.';
  }
  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Sesi Anda telah berakhir. Silakan masuk kembali.';
  }
  return message || fallback;
}

export function useStudentPortal() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: 'info', text: 'Silakan masuk menggunakan nama lengkap dan NISN Anda.' });
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  const setBannerMessage = (text, type = 'info') => setBanner({ text, type });

  async function loadProfile() {
    try {
      const res = await apiRequest('/student/profile.php');
      if (res?.status === 'success') {
        setProfile(res.data || null);
        return true;
      }

      setBannerMessage(res?.message || 'Profil siswa tidak tersedia saat ini.', 'warning');
      return false;
    } catch (error) {
      setBannerMessage(getUserFriendlyMessage(error, 'Profil siswa tidak dapat dimuat saat ini.'), 'warning');
      return false;
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setBannerMessage('Memproses login...', 'info');

    try {
      const res = await apiRequest('/auth/student_login.php', {
        method: 'POST',
        body: JSON.stringify({ username: form.username, password: form.password })
      });

      if (res?.status === 'success') {
        const nextStudent = res.data?.student || null;
        setStudent(nextStudent);
        const profileLoaded = await loadProfile();
        if (profileLoaded) {
          setBannerMessage('Login berhasil. Anda dapat melihat profil dan riwayat absensi Anda.', 'success');
        }
      } else {
        setBannerMessage(res?.message || 'Login gagal. Periksa kembali nama lengkap dan NISN.', 'danger');
      }
    } catch (error) {
      setBannerMessage(getUserFriendlyMessage(error, 'Login gagal. Periksa kembali nama lengkap dan NISN.'), 'danger');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('/auth/logout.php');
    } catch {}
    setStudent(null);
    setProfile(null);
    setBannerMessage('Anda telah keluar. Silakan masuk kembali bila diperlukan.', 'info');
  }

  useEffect(() => {
    async function init() {
      try {
        const res = await apiRequest('/student/profile.php');
        if (res?.status === 'success') {
          setStudent(res.data?.student || null);
          setProfile(res.data || null);
          setBannerMessage('Sesi Anda aktif. Anda bisa melihat profil dan riwayat kehadiran.', 'success');
        } else {
          setStudent(null);
          setProfile(null);
          setBannerMessage(res?.message || 'Anda belum login. Silakan masuk terlebih dahulu.', 'info');
        }
      } catch (error) {
        setStudent(null);
        setProfile(null);
        setBannerMessage(getUserFriendlyMessage(error, 'Backend belum siap. Coba beberapa saat lagi.'), 'warning');
      } finally {
        setReady(true);
      }
    }

    init();
  }, []);

  return useMemo(() => ({
    form,
    setForm,
    student,
    loading,
    banner,
    profile,
    ready,
    handleLogin,
    handleLogout,
    setBannerMessage
  }), [banner, form, loading, profile, ready, student]);
}
