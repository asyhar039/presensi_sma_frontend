import * as v from 'valibot'

export const EXIT_LEAVE_REASONS = [
  { value: 'medical', label: 'Keperluan Medis / Berobat' },
  { value: 'family', label: 'Urusan Keluarga Mendesak' },
  { value: 'competition', label: 'Lomba / Kegiatan Sekolah' },
  { value: 'other', label: 'Lainnya' },
] as const

export const exitLeaveSchema = v.pipe(
  v.object({
    departure_time: v.pipe(v.string(), v.nonEmpty('Jam keluar wajib diisi')),
    return_time: v.pipe(
      v.string(),
      v.nonEmpty('Perkiraan jam kembali wajib diisi'),
    ),
    reason_type: v.pipe(v.string(), v.nonEmpty('Alasan keluar wajib dipilih')),
    destination: v.pipe(v.string(), v.nonEmpty('Tujuan / lokasi wajib diisi')),
    reason: v.pipe(v.string(), v.nonEmpty('Keterangan wajib diisi')),
    emergency_contact: v.optional(v.string()),
  }),
  v.forward(
    v.partialCheck(
      [['departure_time'], ['return_time']],
      (input) => {
        if (!input.departure_time || !input.return_time) return true
        return input.return_time > input.departure_time
      },
      'Perkiraan jam kembali harus lebih besar dari jam keluar',
    ),
    ['return_time'],
  ),
)

export type ExitLeaveFormValues = v.InferOutput<typeof exitLeaveSchema>
