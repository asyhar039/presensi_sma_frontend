import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { academicYearKeys } from '@/features/academic-years/lib/academic-year-query-options'
import { postAcademicYear } from '@/features/academic-years/services/academic-year-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postAcademicYear,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      })
      toast.success('Academic year created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create academic year.'))
    },
  })
}
