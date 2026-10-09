import type { IPresenceCurrent } from '@/features/teacher-session/types/teacher-session.types'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { teacherSessionKeys } from '@/features/teacher-session/lib/teacher-session-query-options'

export function usePresenceRealtime(
  channel: string | null,
  sessionId: number | null,
) {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!channel || !sessionId) return
    const echo = (
      window as unknown as {
        Echo?: {
          channel: (c: string) => {
            listen: (e: string, cb: (d: unknown) => void) => unknown
            stopListening?: (e: string) => void
          }
          leave?: (c: string) => void
        }
      }
    ).Echo
    if (!echo) return
    // ponytail: native Echo binding only; add laravel-echo dep when backend publishes Reverb key.
    const sub = echo.channel(channel)
    const handler = (data: unknown) => {
      queryClient.setQueryData<IPresenceCurrent>(
        teacherSessionKeys.current(),
        (old) => {
          if (!old) return old
          const d = data as Partial<{
            feed: IPresenceCurrent['feed']
            analytics: IPresenceCurrent['analytics']
          }>
          return {
            ...old,
            feed: d.feed ?? old.feed,
            analytics: d.analytics ?? old.analytics,
          }
        },
      )
    }
    sub.listen('.presence.scanned', handler)
    return () => {
      sub.stopListening?.('.presence.scanned')
      echo.leave?.(channel)
    }
  }, [channel, sessionId, queryClient])
}
