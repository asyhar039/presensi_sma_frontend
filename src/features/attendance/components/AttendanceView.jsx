import Card from '../../../components/ui/Card/Card';
import Alert from '../../../components/feedback/Alert/Alert';

const AttendanceView = () => {
  return (
    <Card title="Absensi" icon="clipboard-check">
      <Alert variant="info" icon="info-circle">
        Fitur input absensi siap dikembangkan lebih lanjut dengan daftar siswa dan form input per jadwal.
      </Alert>
    </Card>
  );
};

export default AttendanceView;