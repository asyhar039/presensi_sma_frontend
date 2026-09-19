import type { IauthRole as IAuthRole } from '@/types/auth.types'

import {
  DASHBOARD_NAVIGATION,
  type DashboardNavGroup,
} from '@/constants/navigation'
import { ROLES, type UserRole } from '@/constants/roles'

export function parseRole(role: UserRole = ROLES.STUDENT): IAuthRole | null {
  return {
    role,
    isAdmin: role === ROLES.ADMIN,
    isTeacher: role === ROLES.TEACHER,
    isStudent: role === ROLES.STUDENT,
  }
}

export function getNavigation(role?: IAuthRole | null): DashboardNavGroup[] {
  if (!role) return []
  return DASHBOARD_NAVIGATION[role?.role] ?? []
}
