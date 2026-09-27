import * as v from 'valibot'

export const LATE_LEAVE_REASONS = [
  { value: 'traffic', label: 'Macet / Kendaraan Bermasalah' },
  { value: 'weather', label: 'Kendala Cuaca / Bencana' },
  { value: 'family', label: 'Urusan Keluarga Pagi' },
  { value: 'other', label: 'Lainnya' },
] as const

export const lateLeaveSchema = v.pipe(
  v.object({
    expected_time: v.string(),
    arrival_time: v.pipe(
      v.string(),
      v.nonEmpty('Perkiraan jam datang wajib diisi'),
    ),
    reason_type: v.pipe(
      v.string(),
      v.nonEmpty('Alasan terlambat wajib dipilih'),
    ),
    reason: v.pipe(v.string(), v.nonEmpty('Penjelasan wajib diisi')),
  }),
  v.forward(
    v.partialCheck(
      [['expected_time'], ['arrival_time']],
      (input) => {
        if (!input.expected_time || !input.arrival_time) return true
        return input.arrival_time > input.expected_time
      },
      'Perkiraan jam datang harus lebih besar dari jam masuk seharusnya',
    ),
    ['arrival_time'],
  ),
)

export type LateLeaveFormOutput = v.InferOutput<typeof lateLeaveSchema>
