import { CalendarDays, ChartNoAxesColumn, ClipboardCheck, FileClock, LayoutDashboard, LogOut, User, Users } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { PERMISSIONS } from '../constants/permissions';
import { ROLES } from '../constants/roles';

export const teacherNavigation = [
  { key: 'attendance', section: 'Presensi', label: 'Presensi', path: ROUTES.ATTENDANCE, icon: ClipboardCheck, permission: PERMISSIONS.ABSENSI_VIEW, roles: [ROLES.TEACHER] },
  { key: 'students', label: 'Data Siswa', path: ROUTES.STUDENTS, icon: Users, permission: PERMISSIONS.SISWA_VIEW, roles: [ROLES.TEACHER] },
  { key: 'schedules', label: 'Jadwal Mengajar', path: ROUTES.SCHEDULES, icon: CalendarDays, permission: PERMISSIONS.JADWAL_VIEW, roles: [ROLES.TEACHER] },
  { key: 'reports', label: 'Riwayat Presensi', path: ROUTES.REPORTS, icon: FileClock, permission: PERMISSIONS.LAPORAN_VIEW, roles: [ROLES.TEACHER] },
  { key: 'piket', section: 'Guru Piket', label: 'Izin Keluar', path: '#', icon: LogOut, permission: PERMISSIONS.ABSENSI_INPUT, roles: [ROLES.TEACHER], disabled: true },
  { key: 'wali-rekap', section: 'Wali Kelas', label: 'Rekap Presensi Kelas', path: '#', icon: ChartNoAxesColumn, permission: PERMISSIONS.LAPORAN_VIEW, roles: [ROLES.TEACHER], disabled: true },
  { key: 'wali-perizinan', label: 'Perizinan', path: '#', icon: FileClock, permission: PERMISSIONS.ABSENSI_INPUT, roles: [ROLES.TEACHER], disabled: true },
  { key: 'profile', section: 'Akun', label: 'Profil', path: ROUTES.PROFILE, icon: User, permission: PERMISSIONS.PROFIL_VIEW, roles: [ROLES.TEACHER] },
];

export const studentNavigation = [
  { key: 'dashboard', label: 'Beranda', path: ROUTES.DASHBOARD, icon: LayoutDashboard, permission: null, roles: [ROLES.STUDENT] },
  { key: 'profile', label: 'Profil Saya', path: ROUTES.PROFILE, icon: User, permission: PERMISSIONS.PROFIL_VIEW, roles: [ROLES.STUDENT] },
];
