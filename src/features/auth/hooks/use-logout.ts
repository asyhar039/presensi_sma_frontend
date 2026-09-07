import { useMutation } from '@tanstack/react-query'

import { postLogout } from '@/features/auth/services/auth-api'

export function useLogout() {
  return useMutation({
    mutationFn: postLogout,
  })
}
