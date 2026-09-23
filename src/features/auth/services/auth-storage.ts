import { LOCAL_STORAGE } from '@/constants/app'

export function getAccessToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}

export function setAccessToken(token: string): void {
  localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
}
