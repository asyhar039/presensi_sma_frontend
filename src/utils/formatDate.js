const BULAN_NAMA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalIndo(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${BULAN_NAMA[d.getMonth()]} ${d.getFullYear()}`;
}

export function getBulanNama(bulan) {
  const index = Number(bulan);
  return BULAN_NAMA[index - 1] || bulan || '-';
}
