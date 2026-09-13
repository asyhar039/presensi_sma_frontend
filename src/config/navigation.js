import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ChartNoAxesColumn,
  User,
  School,
  BookOpen,
  ClipboardCheck,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { PERMISSIONS } from '../constants/permissions';
import { ROLES } from '../constants/roles';

export const navigationItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    permission: PERMISSIONS.DASHBOARD_VIEW,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    key: 'siswa',
    label: 'Data Siswa',
    path: ROUTES.STUDENTS,
    icon: Users,
    permission: PERMISSIONS.SISWA_VIEW,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    key: 'guru',
    label: 'Data Guru',
    path: ROUTES.TEACHERS,
    icon: GraduationCap,
    permission: PERMISSIONS.GURU_VIEW,
    roles: [ROLES.ADMIN],
  },
  {
    key: 'jadwal',
    label: 'Jadwal',
    path: ROUTES.SCHEDULES,
    icon: CalendarDays,
    permission: PERMISSIONS.JADWAL_VIEW,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    key: 'laporan',
    label: 'Laporan',
    path: ROUTES.REPORTS,
    icon: ChartNoAxesColumn,
    permission: PERMISSIONS.LAPORAN_VIEW,
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
];

export function getFilteredNavigation(permissions = [], role = null, items = navigationItems) {
  return items.filter((item) => {
    if (role && item.roles && !item.roles.includes(role)) {
      return false;
    }
    if (item.permission && Array.isArray(permissions)) {
      return permissions.includes(item.permission);
    }
    return true;
  });
}
