export type IAuthUser = {
  id: string
  identity_number: string
  name: string
  email: string
  phone_number: string
  roles: string[]
  permissions: string[] | null
}

export type IAuthContext = {
  user: IAuthUser | null
  login: (user: IAuthUser) => void
  refetch: () => Promise<void>
  logout: () => Promise<void>
}
