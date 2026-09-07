import { useSyncExternalStore } from 'react'

type QueryState = {
  mql: MediaQueryList
  subs: Set<() => void>
  cleanup: () => void
}

const queries = new Map<string, QueryState>()

function getQueryState(query: string): QueryState {
  let state = queries.get(query)

  if (!state) {
    const mql = window.matchMedia(query)
    const subs = new Set<() => void>()
    const handler = () => {
      for (const cb of subs) {
        cb()
      }
    }

    mql.addEventListener('change', handler)

    state = {
      mql,
      subs,
      cleanup: () => {
        mql.removeEventListener('change', handler)
      },
    }
    queries.set(query, state)
  }

  return state
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const state = getQueryState(query)
      state.subs.add(callback)

      return () => {
        state.subs.delete(callback)
        if (state.subs.size === 0) {
          state.cleanup()
          queries.delete(query)
        }
      }
    },
    () => getQueryState(query).mql.matches,
  )
}
