import { useCallback, useEffect, useRef, useState } from 'react'

export type PermissionState =
  | 'unknown'
  | 'idle'
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported'

export function useGeolocationPermission(active: boolean) {
  const [status, setStatus] = useState<PermissionState>('unknown')
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      setError('Geolocation is not supported by this browser.')
      return
    }
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords)
        setStatus('granted')
      },
      (positionError) => {
        setStatus(
          positionError.code === positionError.PERMISSION_DENIED
            ? 'denied'
            : 'prompt',
        )
        setError(positionError.message || 'Unable to access your location.')
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }, [])

  useEffect(() => {
    if (!active) return
    let cancelled = false
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (cancelled) return
          setStatus(result.state as PermissionState)
          if (result.state === 'granted') request()
        })
        .catch(() => request())
    } else {
      request()
    }
    return () => {
      cancelled = true
    }
  }, [active, request])

  return { status, coords, error, request }
}

export interface ICameraDevice {
  deviceId: string
  label: string
}

export function useCameraDevices(active: boolean) {
  const [devices, setDevices] = useState<ICameraDevice[]>([])
  const [deviceId, setDeviceId] = useState<string>('')
  const [status, setStatus] = useState<PermissionState>('idle')
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
  }, [])

  const listDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      const cameras = all
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
        }))
      setDevices(cameras)
      setDeviceId((current) => current || cameras[0]?.deviceId || '')
    } catch {
      setError('Unable to list camera devices.')
    }
  }, [])

  const request = useCallback(
    async (selectedId?: string) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        setError('Camera is not supported by this browser.')
        return null
      }
      try {
        setError(null)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedId
            ? { deviceId: { exact: selectedId } }
            : { facingMode: 'environment' },
        })
        stop()
        streamRef.current = stream
        setStatus('granted')
        await listDevices()
        return stream
      } catch (requestError) {
        setStatus('denied')
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Camera access was denied.',
        )
        return null
      }
    },
    [listDevices, stop],
  )

  useEffect(() => {
    if (!active) {
      stop()
      return
    }
    void request()
    return stop
  }, [active, request, stop])

  return { devices, deviceId, setDeviceId, status, error, request, stop }
}
