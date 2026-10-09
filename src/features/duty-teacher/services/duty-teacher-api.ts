import type {
  DataTableApiParams,
  DataTableListResult,
} from '@/components/data-table'
import type {
  IDecideLeavePayload,
  IDutyLeaveDetail,
  IDutyLeaveRow,
  IDutyStatus,
} from '@/features/duty-teacher/types/duty-teacher.types'

import { api } from '@/services/api-client'

export async function getDutyStatus(): Promise<IDutyStatus> {
  return api.get<IDutyStatus>('/duty/status')
}

export async function getDutyLeaveRequests(
  params: DataTableApiParams,
): Promise<DataTableListResult<IDutyLeaveRow>> {
  const res = await api.paginate<IDutyLeaveRow>('/duty/leave-requests', {
    params,
  })
  return {
    items: res.data,
    meta: {
      page: res.meta.page,
      per_page: res.meta.limit,
      total: res.meta.total,
      total_pages: res.meta.total_pages,
    },
  }
}

export async function getDutyLeaveRequestDetail(
  leaveRequestId: number,
): Promise<IDutyLeaveDetail> {
  return api.get<IDutyLeaveDetail>(`/duty/leave-requests/${leaveRequestId}`)
}

export async function decideDutyLeaveRequest(
  leaveRequestId: number,
  kind: 'early-out' | 'late-arrival',
  payload: IDecideLeavePayload,
): Promise<null> {
  return api.post<null>(
    `/duty/leave-requests/${leaveRequestId}/${kind}/decision`,
    payload,
  )
}
