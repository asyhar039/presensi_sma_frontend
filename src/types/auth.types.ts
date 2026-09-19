import type { UserRole } from '@/constants/roles'

export type IAuthUser = {
  id: string
  identity_number: string
  name: string
  email: string
  phone_number: string
  role: UserRole
}

export type IauthRole = {
  role: UserRole
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
