import { FALLBACK_MESSAGE } from '@/constants/app'

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  MUST_BE_LOGGED_IN: 'You must be logged in to access this page.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INTERNAL_ERROR: 'Something went wrong on our end. Please try again later.',
}

export function getAuthErrorMessage(code: string | undefined): string {
  if (!code) return FALLBACK_MESSAGE
  return AUTH_ERROR_MESSAGES[code] || FALLBACK_MESSAGE
}
