import { getStatusTone } from '../constants/status';

export function capitalize(value) {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export function getDisplayValue(value, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
}

export function getInitials(name, fallback = 'A') {
  if (!name) return fallback;
  return String(name).trim().charAt(0).toUpperCase();
}

export function getStatusBadgeClass(status) {
  return `bg-${getStatusTone(status)}`;
}
