import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/services/api-client'

const API_BASE = '/classes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getClasses = async (
  params: Record<string, unknown> = {},
): Promise<any> => {
  const response = await apiClient.get(`${API_BASE}/index.php`, { params })
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createClass = async (data: any): Promise<any> => {
  const response = await apiClient.post(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateClass = async (data: any): Promise<any> => {
  const response = await apiClient.put(`${API_BASE}/index.php`, data)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteClass = async (id: any): Promise<any> => {
  const response = await apiClient.delete(`${API_BASE}/index.php/${id}`)
  return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useGetClassesQuery(params: Record<string, unknown> = {}): any {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => getClasses(params),
    staleTime: 30_000,
  })
}

export function useCreateClassMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useUpdateClassMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useDeleteClassMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}
