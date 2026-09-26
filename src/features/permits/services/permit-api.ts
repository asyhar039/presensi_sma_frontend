import type {
  IPermitListResult,
  IPermitParams,
  IPermitRecord,
  IPermitStatistics,
} from '@/features/permits/types/permit.types'

import { api } from '@/services/api-client'

const MOCK_PERMITS: IPermitRecord[] = [
  {
    id: 1,
    student_id: 101,
    student: {
      id: 101,
      user: {
        id: 201,
        identity_number: '12345',
        name: 'Ahmad Fauzi',
        email: 'ahmad@example.com',
      },
    },
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'sick',
    date: '2026-09-25',
    duration: '1 Hari',
    reason: 'Demam tinggi dan beristirahat di rumah sesuai anjuran dokter.',
    document_url: 'https://example.com/doc1.pdf',
    status: 'pending',
    created_at: '2026-09-25T08:00:00Z',
    updated_at: '2026-09-25T08:00:00Z',
  },
  {
    id: 2,
    student_id: 102,
    student: {
      id: 102,
      user: {
        id: 202,
        identity_number: '12346',
        name: 'Siti Rahma',
        email: 'siti@example.com',
      },
    },
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'leave_school',
    date: '2026-09-25',
    duration: '2 Jam',
    reason: 'Menghadiri acara keluarga yang mendesak.',
    document_url: null,
    status: 'approved',
    created_at: '2026-09-25T09:30:00Z',
    updated_at: '2026-09-25T10:00:00Z',
  },
  {
    id: 3,
    student_id: 103,
    student: {
      id: 103,
      user: {
        id: 203,
        identity_number: '12347',
        name: 'Budi Santoso',
        email: 'budi@example.com',
      },
    },
    classroom_id: 1,
    classroom_name: 'XII IPA 1',
    type: 'leave_in',
    date: '2026-09-25',
    duration: '1 Jam',
    reason: 'Terlambat datang karena ban bocor di perjalanan.',
    document_url: null,
    status: 'rejected',
    created_at: '2026-09-25T07:15:00Z',
    updated_at: '2026-09-25T07:45:00Z',
  },
]

export async function getPermits(
  params: IPermitParams,
): Promise<IPermitListResult> {
  try {
    const res = await api.get<IPermitListResult>('/permits', { params })
    return res
  } catch {
    // Fallback to mock data if API is not yet available for UI slicing
    let filtered = [...MOCK_PERMITS]
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.student?.user?.name?.toLowerCase().includes(q) ||
          p.student?.user?.identity_number?.includes(q),
      )
    }
    if (params.type && params.type !== 'all') {
      filtered = filtered.filter((p) => p.type === params.type)
    }
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter((p) => p.status === params.status)
    }
    return {
      items: filtered,
      meta: {
        page: params.page ?? 1,
        per_page: params.per_page ?? 10,
        total: filtered.length,
        total_pages: 1,
      },
    }
  }
}

export async function getPermitStatistics(): Promise<IPermitStatistics> {
  try {
    return await api.get<IPermitStatistics>('/permits/statistics')
  } catch {
    return {
      total_today: 5,
      pending_validation: 2,
      sick_this_month: 12,
      leave_school_this_month: 8,
      leave_in_this_month: 4,
    }
  }
}
