import type {
  IAttendanceLog,
  IAttendanceStats,
  IQRCode,
  ITeacherPermitRecord,
} from '@/features/teacher-attendance/types/teacher-attendance.types'

import { useCallback, useEffect, useState } from 'react'

import {
  approvePermit,
  closeAttendanceSession,
  generateQRCode,
  getAttendanceLogs,
  getPendingPermits,
  rejectPermit,
} from '@/features/teacher-attendance/services/teacher-attendance-api'

interface UseTeacherAttendanceState {
  sessionId: string
  qrCode: IQRCode | null
  attendanceLogs: IAttendanceLog[]
  permitRecords: ITeacherPermitRecord[]
  attendanceStats: IAttendanceStats
  isSessionActive: boolean
  isLoading: boolean
  error: string | null
}

export function useTeacherAttendance(classroomId: number) {
  const [state, setState] = useState<UseTeacherAttendanceState>({
    sessionId: `session_${Date.now()}`,
    qrCode: null,
    attendanceLogs: [],
    permitRecords: [],
    attendanceStats: {
      present: 0,
      permission: 0,
      sick: 0,
      absent: 0,
    },
    isSessionActive: false,
    isLoading: false,
    error: null,
  })

  // Auto-start session on mount
  useEffect(() => {
    startSession()
  }, [])

  const startSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const qrCode = await generateQRCode(state.sessionId)
      const logs = await getAttendanceLogs(state.sessionId)
      const permits = await getPendingPermits(classroomId)

      const stats: IAttendanceStats = {
        present: logs.filter((l) => l.status === 'present').length,
        permission: logs.filter((l) => l.status === 'permission').length,
        sick: logs.filter((l) => l.status === 'sick').length,
        absent: logs.filter((l) => l.status === 'absent').length,
      }

      setState((prev) => ({
        ...prev,
        qrCode,
        attendanceLogs: logs,
        permitRecords: permits,
        attendanceStats: stats,
        isSessionActive: true,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to start session',
        isLoading: false,
      }))
    }
  }, [state.sessionId, classroomId])

  const regenerateQRCode = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const newSessionId = `session_${Date.now()}`
      const qrCode = await generateQRCode(newSessionId)
      setState((prev) => ({
        ...prev,
        sessionId: newSessionId,
        qrCode,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error ? err.message : 'Failed to regenerate QR code',
        isLoading: false,
      }))
    }
  }, [])

  const endSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await closeAttendanceSession(state.sessionId)
      setState((prev) => ({
        ...prev,
        isSessionActive: false,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to close session',
        isLoading: false,
      }))
    }
  }, [state.sessionId])

  const handleApprovePermit = useCallback(async (permitId: number) => {
    try {
      await approvePermit(permitId)
      setState((prev) => ({
        ...prev,
        permitRecords: prev.permitRecords.map((p) =>
          p.id === permitId ? { ...p, status: 'approved' } : p,
        ),
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to approve permit',
      }))
    }
  }, [])

  const handleRejectPermit = useCallback(async (permitId: number) => {
    try {
      await rejectPermit(permitId)
      setState((prev) => ({
        ...prev,
        permitRecords: prev.permitRecords.map((p) =>
          p.id === permitId ? { ...p, status: 'rejected' } : p,
        ),
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to reject permit',
      }))
    }
  }, [])

  return {
    ...state,
    startSession,
    regenerateQRCode,
    endSession,
    handleApprovePermit,
    handleRejectPermit,
  }
}
