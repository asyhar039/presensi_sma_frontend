import { Card } from '../../../components/ui/Card/Card';

export function AttendanceView() {
  return (
    <Card title="Absensi" icon="clipboard-check">
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Fitur input absensi siap dikembangkan lebih lanjut dengan daftar siswa dan form input per jadwal.
      </div>
    </Card>
  );
}
