export function getErrorMessage(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  if (!error) return fallback;

  // Handles RTK Query / Axios error objects
  if (error?.data?.message) {
    return error.data.message;
  }

  // Network or offline errors
  if (error?.status === 'FETCH_ERROR' || error?.name === 'TypeError') {
    return 'Layanan sedang tidak dapat dijangkau. Silakan periksa koneksi internet Anda atau coba lagi nanti.';
  }

  if (error?.status === 'PARSING_ERROR') {
    return 'Gagal memproses respon dari server. Layanan mungkin sedang dalam pemeliharaan.';
  }

  if (error?.status === 'TIMEOUT_ERROR') {
    return 'Waktu permintaan habis. Silakan coba beberapa saat lagi.';
  }

  // HTTP status codes
  const status = Number(error?.status);

  if (status === 401) {
    return 'Sesi login telah berakhir atau kredensial tidak valid. Silakan login kembali.';
  }

  if (status === 403) {
    return 'Anda tidak memiliki hak akses untuk membuka halaman atau fitur ini.';
  }

  if (status === 404) {
    return 'Data atau layanan yang Anda minta tidak ditemukan.';
  }

  if (status === 502 || status === 503 || status === 504) {
    return 'Layanan sedang dalam pemeliharaan sistem. Silakan coba beberapa saat lagi.';
  }

  if (status >= 500) {
    return 'Terjadi gangguan pada server. Silakan coba beberapa saat lagi.';
  }

  return fallback;
}

export function isMaintenanceError(error) {
  if (!error) return false;
  const status = Number(error?.status);
  return (
    error?.status === 'FETCH_ERROR' ||
    error?.status === 'PARSING_ERROR' ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}
