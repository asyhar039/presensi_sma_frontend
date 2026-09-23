import type { UserRole } from '@/constants/roles'

export type IAuthUser = {
  id: string
  identity_number: string
  name: string
  email: string
  phone_number: string
  roles: string[]
  permissions: string[] | null
}

export type IauthRole = {
  role: UserRole
  roles: UserRole[]
  isAdmin: boolean
  isTeacher: boolean
  isStudent: boolean
}

export type IAuthContext = {
  user: IAuthUser | null
  role: IauthRole | null
  login: (user: IAuthUser) => void
  refetch: () => Promise<void>
  logout: () => Promise<void>
}
