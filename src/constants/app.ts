// @ts-expect-error
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// General Key
export const LOCAL_STORAGE = {
  ACCESS_TOKEN: 'access_token',
}

// General API
export const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

// general constants

export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
} as const

export type ITheme = (typeof THEME)[keyof typeof THEME]

export const DATE_FORMAT = {
  DATE: 'DD MMMM YYYY',
  DATE_TIME: 'DD MMMM YYYY HH:mm:ss',
  TIME: 'HH:mm:ss',
} as const
