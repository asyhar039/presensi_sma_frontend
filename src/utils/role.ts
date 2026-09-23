import type { IauthRole } from '@/types/auth.types'

import {
  DASHBOARD_NAVIGATION,
  type DashboardNavGroup,
} from '@/constants/navigation'
import { ROLES, type UserRole } from '@/constants/roles'

const VALID_ROLES = new Set<string>(Object.values(ROLES))

export function parseRole(value?: string[] | null): IauthRole | null {
  if (!value || value.length === 0) return null

  const roleSet = new Set<UserRole>()
  let primaryRole: UserRole | null = null

  for (const item of value) {
    if (!item) continue
    const normalized = item.toLowerCase().trim()
    if (VALID_ROLES.has(normalized)) {
      const roleVal = normalized as UserRole
      roleSet.add(roleVal)
      if (!primaryRole) primaryRole = roleVal
    }
  }

  const role = primaryRole ?? ROLES.STUDENT

  return {
    role,
    roles: Array.from(roleSet),
    isAdmin: roleSet.has(ROLES.ADMIN),
    isTeacher: roleSet.has(ROLES.TEACHER),
    isStudent: roleSet.has(ROLES.STUDENT),
  }
}

export function getNavigation(role?: IauthRole | null): DashboardNavGroup[] {
  if (!role) return []
  return DASHBOARD_NAVIGATION[role?.role] ?? []
}
