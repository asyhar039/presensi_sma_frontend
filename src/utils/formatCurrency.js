export function formatRupiah(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}
