import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type ITheme, THEME } from '@/constants/app'
import { disableTransitionTemporary } from '@/utils/animation'

interface ThemeState {
  theme: ITheme
  set: (theme: ITheme) => void
  toggle: () => void
}

function applyTheme(theme: ITheme) {
  const root = document.documentElement
  root.classList.toggle(THEME.DARK, theme === THEME.DARK)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: THEME.LIGHT,
      set: (theme) => set({ theme }),
      toggle: () =>
        set(({ theme }) => ({
          theme: theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
        })),
    }),
    {
      name: 'theme',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name) as ITheme | null
          const theme = value === THEME.DARK ? THEME.DARK : THEME.LIGHT
          applyTheme(theme)
          return { state: { theme } }
        },
        setItem: (name, { state: { theme } }) => {
          const enable = disableTransitionTemporary()
          localStorage.setItem(name, theme)
          applyTheme(theme)
          queueMicrotask(enable)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)
