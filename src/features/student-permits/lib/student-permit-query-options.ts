import { queryOptions } from '@tanstack/react-query'

import {
  getPresenceInformation,
  getStudentInformation,
  getStudentLeaveRequests,
} from '@/features/student-permits/services/student-permit-api'

export const studentPermitKeys = {
  all: ['student-permits'] as const,
  information: () => [...studentPermitKeys.all, 'information'] as const,
  presence: () => [...studentPermitKeys.all, 'presence'] as const,
  leaveRequests: () => [...studentPermitKeys.all, 'leave-requests'] as const,
}

export const studentInformationQueryOptions = () =>
  queryOptions({
    queryKey: studentPermitKeys.information(),
    queryFn: getStudentInformation,
    staleTime: 60_000,
  })

export const presenceInformationQueryOptions = () =>
  queryOptions({
    queryKey: studentPermitKeys.presence(),
    queryFn: getPresenceInformation,
    staleTime: 30_000,
  })

export const studentLeaveRequestsQueryOptions = () =>
  queryOptions({
    queryKey: studentPermitKeys.leaveRequests(),
    queryFn: async () => {
      try {
        return await getStudentLeaveRequests()
      } catch {
        // Fallback mock data if API is not yet available
        return [
          {
            id: 123,
            key: 'LR-2026-123',
            type: { key: 'sick_leave', label: 'Sick Leave' },
            status: { key: 'pending', label: 'Pending' },
            start_date: '2026-10-08',
            end_date: '2026-10-09',
            range_date: ['2026-10-08', '2026-10-09'],
            date: null,
            time_out: null,
            time_in: null,
            exit_reason: null,
            destination: null,
            contact_person: 'Ibu',
            estimated_arrival_time: null,
            late_reason: null,
            notes: 'Demam tinggi dan perlu istirahat.',
            attachment: null,
            current_step: 'homeroom_teacher',
            requested_at: '2026-10-08T08:00:00Z',
          },
          {
            id: 124,
            key: 'LR-2026-124',
            type: { key: 'early_out', label: 'Early Leave' },
            status: { key: 'approved', label: 'Approved' },
            start_date: null,
            end_date: null,
            range_date: [],
            date: '2026-10-07',
            time_out: '10:00',
            time_in: '12:00',
            exit_reason: 'Acara keluarga mendesak',
            destination: 'Rumah sakit',
            contact_person: 'Ayah',
            estimated_arrival_time: null,
            late_reason: null,
            notes: null,
            attachment: null,
            current_step: 'completed',
            requested_at: '2026-10-07T09:00:00Z',
          },
        ]
      }
    },
    staleTime: 30_000,
  })
