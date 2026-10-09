import type { ApiPaginateResponse, ApiResponse } from '@/types/api.types'

import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

import { API_BASE_URL } from '@/constants/app'
import { getAccessToken } from '@/features/auth/services/auth-storage'
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NetworkError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
  UnprocessableEntityError,
} from '@/lib/api-errors'

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
  paramsSerializer: {
    indexes: null,
  },
})

instance.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<UnknownCredentialOptions>>) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data?.data ?? null
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        'An error occurred'

      switch (status) {
        case 400:
          throw new BadRequestError(message, data)
        case 401:
          throw new UnauthorizedError(message, data)
        case 403:
          throw new ForbiddenError(message, data)
        case 404:
          throw new NotFoundError(message, data)
        case 422:
          throw new UnprocessableEntityError(message, data)
        case 500:
          throw new InternalServerError(message, data)
        default:
          throw new ApiError(status, message, data)
      }
    }

    if (error.request) {
      throw new NetworkError('No response received from the server.')
    }

    throw new UnknownError(
      error.message ||
        'An unknown error occurred while making the API request.',
    )
  },
)

async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  const response = await promise
  return response.data.data
}

async function unwrapPaginate<T>(
  promise: Promise<{ data: ApiPaginateResponse<T> }>,
): Promise<ApiPaginateResponse<T>> {
  const response = await promise
  return response.data
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.get<ApiResponse<T>>(url, config)),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.post<ApiResponse<T>>(url, body, config)),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.put<ApiResponse<T>>(url, body, config)),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.patch<ApiResponse<T>>(url, body, config)),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrap<T>(instance.delete<ApiResponse<T>>(url, config)),
  paginate: <T>(url: string, config?: AxiosRequestConfig) =>
    unwrapPaginate<T>(instance.get<ApiPaginateResponse<T>>(url, config)),
}

export { instance as apiClient }
