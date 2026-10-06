import { queryOptions } from '@tanstack/react-query'

import {
  getPresenceInformation,
  getStudentInformation,
} from '@/features/student-permits/services/student-permit-api'

export const studentPermitKeys = {
  all: ['student-permits'] as const,
  information: () => [...studentPermitKeys.all, 'information'] as const,
  presence: () => [...studentPermitKeys.all, 'presence'] as const,
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
