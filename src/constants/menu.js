import { getFilteredNavigation } from '../config/navigation';

export const menuItems = [
  { 
    key: 'profil', 
    label: 'Profil Siswa', 
    icon: 'user',
    permission: 'profil.view'
  },
  { 
    key: 'dashboard', 
    label: 'Dashboard', 
    icon: 'chart-pie',
    permission: 'dashboard.view'
  },
  { 
    key: 'siswa', 
    label: 'Data Siswa', 
    icon: 'user-graduate',
    permission: 'siswa.view'
  },
  { 
    key: 'guru', 
    label: 'Data Guru', 
    icon: 'chalkboard-teacher',
    permission: 'guru.view'
  },
  { 
    key: 'kelas', 
    label: 'Data Kelas', 
    icon: 'school',
    permission: 'kelas.view'
  },
  { 
    key: 'mapel', 
    label: 'Mata Pelajaran', 
    icon: 'book-open',
    permission: 'mapel.view'
  },
  { 
    key: 'jadwal', 
    label: 'Jadwal', 
    icon: 'calendar-alt',
    permission: 'jadwal.view'
  },
  { 
    key: 'absensi', 
    label: 'Absensi', 
    icon: 'clipboard-check',
    permission: 'absensi.view'
  },
  { 
    key: 'laporan', 
    label: 'Laporan', 
    icon: 'file-invoice',
    permission: 'laporan.view'
  }
];

export function getFilteredMenuItems(permissions) {
  if (!permissions) return [];
  return menuItems.filter(item => 
    permissions.includes(item.permission)
  );
}

export function getFilteredMenuItemsByRole(permissions, role) {
  return getFilteredNavigation(permissions, role);
}
