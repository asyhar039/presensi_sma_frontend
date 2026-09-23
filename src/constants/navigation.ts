import type { TablerIcon } from '@tabler/icons-react'

import {
  IconBook,
  IconCalendar,
  IconCalendarTime,
  IconChalkboardTeacher,
  IconClipboardCheck,
  IconClipboardData,
  IconDoor,
  IconFileCheck,
  IconHistory,
  IconLayoutDashboard,
  IconQrcode,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'

import { ROLES, type UserRole } from '@/constants/roles'

export type DashboardNavItem = {
  title: string
  href: string
  icon: TablerIcon
}

export type DashboardNavGroup = {
  title: string
  items: DashboardNavItem[]
}

export const DASHBOARD_NAVIGATION: Record<UserRole, DashboardNavGroup[]> = {
  [ROLES.ADMIN]: [
    {
      title: 'Main Menu',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Student',
          href: '/dashboard/students',
          icon: IconUsers,
        },
        {
          title: 'Teacher',
          href: '/dashboard/teachers',
          icon: IconClipboardData,
        },
        {
          title: 'Subject',
          href: '/dashboard/subjects',
          icon: IconBook,
        },
        {
          title: 'Academic Year',
          href: '/dashboard/academic-years',
          icon: IconCalendarTime,
        },
        {
          title: 'Schedule',
          href: '/dashboard/schedules',
          icon: IconCalendar,
        },
        {
          title: 'Room',
          href: '/dashboard/rooms',
          icon: IconDoor,
        },
        {
          title: 'ClassRoom',
          href: '/dashboard/classrooms',
          icon: IconChalkboardTeacher,
        },
      ],
    },
    {
      title: 'Others',
      items: [
        {
          title: 'Report',
          href: '/dashboard/reports',
          icon: IconReportAnalytics,
        },
        {
          title: 'Settings',
          href: '/dashboard/settings',
          icon: IconSettings,
        },
      ],
    },
  ],
  [ROLES.TEACHER]: [
    {
      title: 'Main Menu',
      items: [{ title: 'Attendance', href: '/dashboard', icon: IconQrcode }],
    },
    {
      title: 'Teaching',
      items: [
        { title: 'Student Data', href: '/dashboard/students', icon: IconUsers },
        {
          title: 'Teaching Schedule',
          href: '/dashboard/schedules',
          icon: IconCalendar,
        },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        {
          title: 'Attendance History',
          href: '/dashboard/attendance-history',
          icon: IconHistory,
        },
        {
          title: 'Class Attendance Summary',
          href: '/dashboard/attendance-summary',
          icon: IconClipboardCheck,
        },
        {
          title: 'Permits',
          href: '/dashboard/permits',
          icon: IconFileCheck,
        },
      ],
    },
  ],
  [ROLES.STUDENT]: [
    {
      title: 'Main Menu',
      items: [{ title: 'Attendance', href: '/dashboard', icon: IconQrcode }],
    },
  ],
}

export function isActiveNavItem(pathname: string, href: string): boolean {
  if (pathname === href) return true
  return href !== '/dashboard' && pathname.startsWith(href)
}
