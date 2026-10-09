import { useCallback, useState } from 'react'

export interface UseDisclosureReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: (toSet?: boolean) => void
}

export function useDisclosure(
  initialState: boolean = false,
): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialState)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const toggle = useCallback((toSet?: boolean) => {
    setIsOpen((prev) => (typeof toSet === 'boolean' ? toSet : !prev))
  }, [])

  return { isOpen, open, close, toggle }
}
