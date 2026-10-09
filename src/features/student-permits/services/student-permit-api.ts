import type {
  ILeaveRequestResult,
  IPresenceInformation,
  IStudentInformation,
} from '@/features/student-permits/types/permit.types'

import { api } from '@/services/api-client'

export function getStudentInformation() {
  return api.get<IStudentInformation>('/student/information')
}

export function getPresenceInformation() {
  return api.get<IPresenceInformation>('/student/presence')
}

export function postSickLeave(formData: FormData) {
  return api.post<ILeaveRequestResult>(
    '/student/leave-requests/sick-leave',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}

export function postEarlyOut(formData: FormData) {
  return api.post<ILeaveRequestResult>(
    '/student/leave-requests/early-out',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}

export function getStudentLeaveRequests() {
  return api.get<ILeaveRequestResult[]>('/student/leave-requests')
}

export function postLateArrival(formData: FormData) {
  return api.post<ILeaveRequestResult>(
    '/student/leave-requests/late-arrival',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
}
