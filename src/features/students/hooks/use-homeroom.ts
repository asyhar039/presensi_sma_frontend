import { useQuery } from '@tanstack/react-query'

import {
  homeroomQueryOptions,
  homeroomStudentDetailQueryOptions,
} from '@/features/students/lib/homeroom-query-options'

export function useHomeroom() {
  return useQuery(homeroomQueryOptions())
}

export function useHomeroomStudentDetail(id: number | null, enabled = true) {
  const options = homeroomStudentDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
