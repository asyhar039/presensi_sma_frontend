import type { IAcademicYearPayload } from '@/features/academic-years/types/academic-year.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { academicYearKeys } from '@/features/academic-years/lib/academic-year-query-options'
import { putAcademicYear } from '@/features/academic-years/services/academic-year-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateAcademicYear(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IAcademicYearPayload) =>
      putAcademicYear(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: academicYearKeys.detail(id),
        })
      }
      toast.success('Academic year updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update academic year.'))
    },
  })
}
