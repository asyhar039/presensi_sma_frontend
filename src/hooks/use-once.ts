import { useEffect, useRef } from 'react'

export function useOnce(effect: () => void, cleanup?: () => void): void {
  const hasRun = useRef(false)

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true
      effect()
    }

    return () => {
      cleanup?.()
    }
  }, [effect, cleanup])
}
