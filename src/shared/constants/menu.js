import { PERMISSIONS } from './permissions';

export const menuItems = [
  { 
    key: 'profil', 
    label: 'Profil Siswa', 
    icon: 'user',
    permission: PERMISSIONS.PROFIL_VIEW
  },
  { 
    key: 'dashboard', 
    label: 'Dashboard', 
    icon: 'chart-pie',
    permission: PERMISSIONS.DASHBOARD_VIEW
  },
  { 
    key: 'siswa', 
    label: 'Data Siswa', 
    icon: 'user-graduate',
    permission: PERMISSIONS.SISWA_VIEW
  },
  { 
    key: 'guru', 
    label: 'Data Guru', 
    icon: 'chalkboard-teacher',
    permission: PERMISSIONS.GURU_VIEW
  },
  { 
    key: 'kelas', 
    label: 'Data Kelas', 
    icon: 'school',
    permission: PERMISSIONS.KELAS_VIEW
  },
  { 
    key: 'mapel', 
    label: 'Mata Pelajaran', 
    icon: 'book-open',
    permission: PERMISSIONS.MAPEL_VIEW
  },
  { 
    key: 'jadwal', 
    label: 'Jadwal', 
    icon: 'calendar-alt',
    permission: PERMISSIONS.JADWAL_VIEW
  },
  { 
    key: 'absensi', 
    label: 'Absensi', 
    icon: 'clipboard-check',
    permission: PERMISSIONS.ABSENSI_VIEW
  },
  { 
    key: 'laporan', 
    label: 'Laporan', 
    icon: 'file-invoice',
    permission: PERMISSIONS.LAPORAN_VIEW
  }
];

export function getFilteredMenuItems(permissions) {
  if (!permissions) return [];
  return menuItems.filter(item => 
    permissions.includes(item.permission)
  );
}
