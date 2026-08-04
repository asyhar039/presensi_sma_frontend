import { resolveApiBase } from './apiBase';

const API_BASE = resolveApiBase();

export async function apiRequest(endpoint, options = {}) {
  try {
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

    if (!response.ok) {
      const message = data?.message || `HTTP error: ${response.status}`;
      return { status: 'error', message, data: data?.data || null };
    }

    return data || { status: 'error', message: 'Respons kosong' };
  } catch (error) {
    return {
      status: 'error',
      message: error?.message || 'Tidak dapat terhubung ke backend.',
      data: null
    };
  }
}
