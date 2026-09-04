export function resolveApiBase(location = typeof window !== 'undefined' ? window.location : {}) {
  const envBase = import.meta?.env?.VITE_API_BASE;
  if (envBase) {
    return envBase.endsWith('/') ? envBase.slice(0, -1) : envBase;
  }

  const pathname = location.pathname || '';
  const origin = location.origin || '';
  const hostname = (location.hostname || '').toLowerCase();
  const isLocalDev = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || ['3000', '3003', '3004'].includes(location.port || '');

  if (pathname.includes('/Presensi/')) {
    return `${origin}/backendpresent/presensi_sma_backend/api`;
  }

  if (isLocalDev) {
    return '/api';
  }

  return '/api';
}
