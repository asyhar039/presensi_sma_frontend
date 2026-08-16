export const ATTENDANCE_STATUS = {
  HADIR: 'Hadir',
  IZIN: 'Izin',
  SAKIT: 'Sakit',
  ALFA: 'Alfa',
};

export const ATTENDANCE_LABELS = Object.values(ATTENDANCE_STATUS);

export const ATTENDANCE_TONES = {
  hadir: 'success',
  izin: 'info',
  sakit: 'warning',
  alfa: 'danger',
};

export function getStatusTone(status) {
  return ATTENDANCE_TONES[String(status || '').toLowerCase()] || 'secondary';
}