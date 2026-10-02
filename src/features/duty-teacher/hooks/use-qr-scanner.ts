import jsQR from 'jsqr'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseQRScannerResult {
  isScanning: boolean
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  error: string | null
  scannedData: string | null
  startScanning: () => Promise<void>
  stopScanning: () => void
}

export function useQRScanner(
  onScan: (data: string) => void,
): UseQRScannerResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const scan = useCallback(() => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA
    ) {
      if (isScanning) {
        animationFrameRef.current = requestAnimationFrame(scan)
      }
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        setScannedData(code.data)
        onScan(code.data)
      }
    } catch (err) {
      console.error('QR scan error:', err)
    }

    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scan)
    }
  }, [isScanning, onScan])

  const startScanning = useCallback(async () => {
    setError(null)
    setScannedData(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        animationFrameRef.current = requestAnimationFrame(scan)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to access camera'
      setError(errorMessage)
      setIsScanning(false)
    }
  }, [scan])

  const stopScanning = useCallback(() => {
    setIsScanning(false)

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })

      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setScannedData(null)
  }, [])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  return {
    isScanning,
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    error,
    scannedData,
    startScanning,
    stopScanning,
  }
}
