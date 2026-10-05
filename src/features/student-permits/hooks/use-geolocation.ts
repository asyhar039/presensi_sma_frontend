import { useCallback, useEffect, useRef, useState } from 'react'

export type GeoStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'unsupported'

export interface IGeoPosition {
  latitude: number
  longitude: number
  accuracy: number
}

function toMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'You blocked location access. Please allow location permission in your browser settings, then try again.'
    case error.POSITION_UNAVAILABLE:
      return 'Your location is currently unavailable. Please turn on GPS or check your connection, then try again.'
    case error.TIMEOUT:
      return 'Getting your location timed out. Please try again in an area with a better signal.'
    default:
      return (
        error.message || 'We could not get your location. Please try again.'
      )
  }
}

export function useGeolocation(active: boolean) {
  const [status, setStatus] = useState<GeoStatus>('idle')
  const [position, setPosition] = useState<IGeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      setError(
        'Location is not supported by this browser. Please use a modern browser.',
      )
      return
    }
    setStatus('requesting')
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (result) => {
        if (!mountedRef.current) return
        setPosition({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
          accuracy: result.coords.accuracy,
        })
        setStatus('granted')
      },
      (failure) => {
        if (!mountedRef.current) return
        setStatus(
          failure.code === failure.PERMISSION_DENIED ? 'denied' : 'unavailable',
        )
        setError(toMessage(failure))
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    )
  }, [])

  useEffect(() => {
    if (active && status === 'idle') request()
  }, [active, status, request])

  return {
    status,
    position,
    error,
    request,
    isReady: status === 'granted' && position !== null,
  }
}
