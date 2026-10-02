import type { IStudentAttendanceScan } from '@/features/student-permits/types/student-attendance.types'

import { useCallback, useState } from 'react'

import { useQRScanner } from '@/features/duty-teacher/hooks/use-qr-scanner'
import { scanAttendanceQR } from '@/features/student-permits/services/student-attendance-api'

interface UseStudentAttendanceScannerState {
  isLoading: boolean
  error: string | null
  success: boolean
  scannedAttendance: IStudentAttendanceScan | null
}

export function useStudentAttendanceScanner(studentId: number) {
  const [state, setState] = useState<UseStudentAttendanceScannerState>({
    isLoading: false,
    error: null,
    success: false,
    scannedAttendance: null,
  })

  const handleQRScan = useCallback(
    async (qrData: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      try {
        const result = await scanAttendanceQR(qrData, studentId)

        if (result.success && result.data) {
          setState((prev) => ({
            ...prev,
            scannedAttendance: result.data ?? null,
            success: true,
            isLoading: false,
            error: null,
          }))
        } else {
          setState((prev) => ({
            ...prev,
            error: result.message || 'Failed to process attendance',
            isLoading: false,
            success: false,
          }))
        }
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Scan failed',
          isLoading: false,
          success: false,
        }))
      }
    },
    [studentId],
  )

  const {
    isScanning: cameraActive,
    videoRef,
    canvasRef,
    error: scannerError,
    startScanning,
    stopScanning,
  } = useQRScanner(handleQRScan)

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false,
      scannedAttendance: null,
    })
  }, [])

  return {
    ...state,
    cameraActive,
    videoRef,
    canvasRef,
    scannerError,
    startScanning,
    stopScanning,
    resetState,
    handleQRScan,
  }
}
