export function getDisplayValue(value, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
}

export function getInitials(name, fallback = 'A') {
  if (!name) return fallback;
  return String(name).trim().charAt(0).toUpperCase();
}

export function getStatusBadgeClass(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'hadir') return 'bg-success';
  if (normalized === 'izin') return 'bg-info';
  if (normalized === 'sakit') return 'bg-warning';
  if (normalized === 'alfa') return 'bg-danger';
  return 'bg-secondary';
}
