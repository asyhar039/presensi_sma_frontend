import { useMemo } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'

export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const breakpoints = useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop,
      current: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    }),
    [isMobile, isTablet, isDesktop],
  )

  return breakpoints
}

export function useDashboardBreakpoint() {
  return useMediaQuery('(min-width: 1024px)')
}

export function useMobileBreakpoint() {
  return useMediaQuery('(max-width: 767px)')
}
