import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { academicYearKeys } from '@/features/academic-years/lib/academic-year-query-options'
import { deleteAcademicYear } from '@/features/academic-years/services/academic-year-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAcademicYear,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      })
      toast.success('Academic year deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete academic year.'))
    },
  })
}
