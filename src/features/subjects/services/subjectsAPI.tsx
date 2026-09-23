import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/services/api-client'

const API_BASE = '/mapels'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSubjects = async (
  params: Record<string, unknown> = {},
): Promise<any> => {
  const response = await apiClient.get(`${API_BASE}/index.php`, { params })
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSubject = async (data: any): Promise<any> => {
  const response = await apiClient.post(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSubject = async (data: any): Promise<any> => {
  const response = await apiClient.put(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteSubject = async (id: any): Promise<any> => {
  const response = await apiClient.delete(`${API_BASE}/index.php/${id}`)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetSubjectsQuery(params: Record<string, unknown> = {}): any {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => getSubjects(params),
    staleTime: 30_000,
  })
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })
}
