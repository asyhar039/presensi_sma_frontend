import { useMutation } from '@tanstack/react-query'

import { postLogin } from '@/features/auth/services/auth-api'
import { setAccessToken } from '@/features/auth/services/auth-storage'

export function useLogin() {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setAccessToken(data.token)
    },
  })
}
