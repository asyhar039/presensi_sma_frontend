import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useRef,
} from 'react'

export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    return effect()
  }, deps)
}
