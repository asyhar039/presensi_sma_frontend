import { useCallback, useEffect, useRef, useState } from 'react'

export function useDebounceRef<T>(defaultValue: T, delay: number = 500) {
  const [value, setValue] = useState<T>(defaultValue)
  const ref = useRef<T>(defaultValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onChange = useCallback(
    (newValue: T) => {
      ref.current = newValue

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setValue(ref.current)
      }, delay)
    },
    [delay],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    value,
    setValue,
    onChange,
    ref,
  }
}
