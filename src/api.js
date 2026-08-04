const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body && !options.headers?.['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { status: 'error', message: text || 'Respons tidak valid' };
  }

  if (!response.ok && data.status !== 'error') {
    throw new Error(data.message || `HTTP error: ${response.status}`);
  }

  return data || { status: 'error', message: 'Respons kosong' };
}
