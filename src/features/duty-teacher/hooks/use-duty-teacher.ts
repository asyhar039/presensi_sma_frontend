import type {
  IDutyTeacherParams,
  IDutyTeacherStats,
  ILeaveRequest,
} from '@/features/duty-teacher/types/duty-teacher.types'

import { useCallback, useEffect, useState } from 'react'

import {
  approveLeaveRequest,
  getDutyTeacherStats,
  getLeaveRequests,
  rejectLeaveRequest,
  scanQRCode,
} from '@/features/duty-teacher/services/duty-teacher-api'

interface UseDutyTeacherState {
  leaveRequests: ILeaveRequest[]
  stats: IDutyTeacherStats
  isLoading: boolean
  error: string | null
  filters: IDutyTeacherParams
  currentPage: number
  totalPages: number
  isScanning: boolean
  scanError: string | null
}

export function useDutyTeacher() {
  const today = new Date().toISOString().split('T')[0]

  const [state, setState] = useState<UseDutyTeacherState>({
    leaveRequests: [],
    stats: {
      total_today: 0,
      pending_validation: 0,
      approved: 0,
      currently_away: 0,
    },
    isLoading: false,
    error: null,
    filters: { date: today, page: 1, per_page: 10 },
    currentPage: 1,
    totalPages: 0,
    isScanning: false,
    scanError: null,
  })

  // Load data on mount and when filters change
  useEffect(() => {
    loadData()
  }, [state.filters])

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const [requests, stats] = await Promise.all([
        getLeaveRequests(state.filters),
        getDutyTeacherStats(),
      ])

      setState((prev) => ({
        ...prev,
        leaveRequests: requests.items,
        stats,
        totalPages: requests.meta.total_pages,
        isLoading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load data',
        isLoading: false,
      }))
    }
  }, [state.filters])

  const updateFilters = useCallback(
    (newFilters: Partial<IDutyTeacherParams>) => {
      setState((prev) => {
        const cleaned = Object.fromEntries(
          Object.entries(newFilters).filter(([, v]) => v !== undefined),
        )
        return {
          ...prev,
          filters: { ...prev.filters, ...cleaned, page: 1 },
        }
      })
    },
    [],
  )

  const handleScanQR = useCallback(
    async (studentId: number, scanType: 'out' | 'in') => {
      setState((prev) => ({ ...prev, isScanning: true, scanError: null }))
      try {
        const updated = await scanQRCode(studentId, scanType)
        setState((prev) => ({
          ...prev,
          leaveRequests: prev.leaveRequests.map((r) =>
            r.student_id === studentId ? updated : r,
          ),
          isScanning: false,
        }))
      } catch (err) {
        setState((prev) => ({
          ...prev,
          scanError:
            err instanceof Error ? err.message : 'Failed to scan QR code',
          isScanning: false,
        }))
      }
    },
    [],
  )

  const handleApprove = useCallback(async (leaveRequestId: number) => {
    try {
      const updated = await approveLeaveRequest(leaveRequestId)
      setState((prev) => ({
        ...prev,
        leaveRequests: prev.leaveRequests.map((r) =>
          r.id === leaveRequestId ? updated : r,
        ),
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to approve',
      }))
    }
  }, [])

  const handleReject = useCallback(async (leaveRequestId: number) => {
    try {
      const updated = await rejectLeaveRequest(leaveRequestId)
      setState((prev) => ({
        ...prev,
        leaveRequests: prev.leaveRequests.map((r) =>
          r.id === leaveRequestId ? updated : r,
        ),
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to reject',
      }))
    }
  }, [])

  return {
    ...state,
    loadData,
    updateFilters,
    handleScanQR,
    handleApprove,
    handleReject,
  }
}
