import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/services/api-client'

const API_BASE = '/teachers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTeachers = async (
  params: Record<string, unknown> = {},
): Promise<any> => {
  const response = await apiClient.get(`${API_BASE}/index.php`, { params })
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTeacher = async (data: any): Promise<any> => {
  const response = await apiClient.post(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateTeacher = async (data: any): Promise<any> => {
  const response = await apiClient.put(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteTeacher = async (id: any): Promise<any> => {
  const response = await apiClient.delete(`${API_BASE}/index.php/${id}`)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetTeachersQuery(params: Record<string, unknown> = {}): any {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => getTeachers(params),
    staleTime: 30_000,
  })
}

export function useCreateTeacherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}

export function useUpdateTeacherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}

export function useDeleteTeacherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })
}
