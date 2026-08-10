export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

export function isValidPhone(value) {
  return /^[0-9+\-\s()]{8,}$/.test(String(value || ''));
}
