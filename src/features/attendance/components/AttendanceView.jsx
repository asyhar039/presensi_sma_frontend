import { LoadingState } from '../../../shared/components/LoadingState';

export function AttendanceView() {
  return (
    <div className="card-custom">
      <h5 className="fw-bold mb-3"><i className="fas fa-clipboard-check text-primary me-2"></i> Absensi</h5>
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Fitur input absensi siap dikembangkan lebih lanjut dengan daftar siswa dan form input per jadwal.
      </div>
    </div>
  );
}
