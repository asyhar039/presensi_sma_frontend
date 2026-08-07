export function getErrorMessage(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  if (error?.data?.message) return error.data.message;
  if (error?.status === 'FETCH_ERROR') return 'Backend tidak tersedia. Pastikan server backend berjalan.';
  if (error?.status === 401) return 'Username atau password salah';
  return fallback;
}
