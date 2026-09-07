import { deepEqual } from '@tanstack/react-router'
import { useRef } from 'react'

export function useDeepCompare<T>(value: T): T {
  const ref = useRef<T>(value)
  if (!deepEqual(ref.current, value)) {
    ref.current = value
  }

  return ref.current
}
