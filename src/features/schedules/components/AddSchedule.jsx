import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  AlignLeft, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useGetSubjectsQuery } from '../../subjects/services/subjectsAPI';
import { useGetTeachersQuery } from '../../teachers/services/teachersAPI';
import { useCreateScheduleMutation } from '../services/schedulesAPI';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import Select from '../../../components/ui/Select/Select';
import Card from '../../../components/ui/Card/Card';
import Alert from '../../../components/feedback/Alert/Alert';
import { ROUTES } from '../../../constants/routes';

const DAYS = [
  { value: 'Senin', label: 'Senin' },
  { value: 'Selasa', label: 'Selasa' },
  { value: 'Rabu', label: 'Rabu' },
  { value: 'Kamis', label: 'Kamis' },
  { value: 'Jumat', label: 'Jumat' },
  { value: 'Sabtu', label: 'Sabtu' },
];

const initialFormData = {
  mata_pelajaran_id: '',
  guru_id: '',
  kelas_id: '',
  hari: '',
  jam_mulai: '',
  jam_selesai: '',
  ruangan: '',
  catatan: '',
};

const AddSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.SCHEDULES;

  const { data: subjectResponse, isLoading: subjectsLoading } = useGetSubjectsQuery();
  const { data: teacherResponse, isLoading: teachersLoading } = useGetTeachersQuery();
  const { data: classResponse, isLoading: classesLoading } = useGetClassesQuery();
  
  const [createSchedule, { isLoading: submitting }] = useCreateScheduleMutation();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const subjects = subjectResponse?.data || [];
  const teachers = teacherResponse?.data || [];
  const classes = classResponse?.data || [];

  const validateField = (name, value) => {
    switch (name) {
      case 'mata_pelajaran_id':
        if (!value) return 'Mata pelajaran wajib dipilih';
        break;
      case 'guru_id':
        if (!value) return 'Guru pengampu wajib dipilih';
        break;
      case 'kelas_id':
        if (!value) return 'Kelas wajib dipilih';
        break;
      case 'hari':
        if (!value) return 'Hari wajib dipilih';
        break;
      case 'jam_mulai':
        if (!value) return 'Waktu mulai wajib diisi';
        break;
      case 'jam_selesai':
        if (!value) return 'Waktu selesai wajib diisi';
        break;
      case 'ruangan':
        if (!value) return 'Ruangan wajib dipilih';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(initialFormData).forEach(key => {
      if (key === 'catatan') return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await createSchedule(formData).unwrap();
      setToast({ type: 'success', message: 'Jadwal pelajaran berhasil ditambahkan!' });
      setTimeout(() => navigate(ROUTES.SCHEDULES), 2000);
    } catch (err) {
      setToast({ 
        type: 'error', 
        message: getErrorMessage(err, 'Gagal menambahkan jadwal. Silakan coba lagi.') 
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm font-medium text-slate-500">
          <li>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SCHEDULES)}
              className="hover:text-indigo-600 transition-colors text-slate-500 hover:text-indigo-600 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            >
              Jadwal Pelajaran
            </button>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Tambah Slot Jadwal</span>
          </li>
        </ol>
      </nav>

      {toast && (
        <Alert 
          variant={toast.type === 'success' ? 'success' : 'danger'}
          className="animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900">Informasi Akademik</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label="Mata Pelajaran *"
                name="mata_pelajaran_id"
                placeholder="Pilih Mata Pelajaran..."
                options={subjects.map(s => ({ value: s.id, label: s.nama_mapel }))}
                value={formData.mata_pelajaran_id}
                onChange={(_, val) => handleChange('mata_pelajaran_id', val)}
                onBlur={() => handleBlur('mata_pelajaran_id')}
                error={errors.mata_pelajaran_id}
              />
              <Select
                label="Guru Pengampu *"
                name="guru_id"
                placeholder="Pilih Guru..."
                options={teachers.map(t => ({ value: t.id, label: t.nama_lengkap }))}
                value={formData.guru_id}
                onChange={(_, val) => handleChange('guru_id', val)}
                onBlur={() => handleBlur('guru_id')}
                error={errors.guru_id}
              />
            </div>
            <Select
              label="Kelas *"
              name="kelas_id"
              placeholder="Pilih Kelas..."
              options={classes.map(c => ({ value: c.id, label: c.nama_kelas }))}
              value={formData.kelas_id}
              onChange={(_, val) => handleChange('kelas_id', val)}
              onBlur={() => handleBlur('kelas_id')}
              error={errors.kelas_id}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900">Waktu & Lokasi</h2>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Hari *"
              name="hari"
              placeholder="Pilih Hari..."
              options={DAYS}
              value={formData.hari}
              onChange={(_, val) => handleChange('hari', val)}
              onBlur={() => handleBlur('hari')}
              error={errors.hari}
            />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-slate-700">Waktu Mulai *</label>
                <Input
                  name="jam_mulai"
                  type="time"
                  value={formData.jam_mulai}
                  onChange={(_, val) => handleChange('jam_mulai', val)}
                  onBlur={() => handleBlur('jam_mulai')}
                  error={errors.jam_mulai}
                />
              </div>
              <div>
                <label className="mb-2 block font-semibold text-slate-700">Waktu Selesai *</label>
                <Input
                  name="jam_selesai"
                  type="time"
                  value={formData.jam_selesai}
                  onChange={(_, val) => handleChange('jam_selesai', val)}
                  onBlur={() => handleBlur('jam_selesai')}
                  error={errors.jam_selesai}
                />
              </div>
            </div>

            <Select
              label="Ruangan *"
              name="ruangan"
              placeholder="Pilih Ruangan..."
              options={[
                { value: 'Ruang 101', label: 'Ruang 101' },
                { value: 'Ruang 102', label: 'Ruang 102' },
                { value: 'Lab Komputer', label: 'Lab Komputer' },
                { value: 'Lab Bahasa', label: 'Lab Bahasa' },
                { value: 'Aula', label: 'Aula' },
              ]}
              value={formData.ruangan}
              onChange={(_, val) => handleChange('ruangan', val)}
              onBlur={() => handleBlur('ruangan')}
              error={errors.ruangan}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlignLeft className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900">Keterangan Tambahan</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Catatan (Opsional)</label>
            <textarea
              name="catatan"
              className="block w-full appearance-none border border-[#dee2e6] rounded-md bg-white px-3.5 py-2 text-base text-dark transition placeholder:text-muted focus:outline-none focus:ring-4 focus:border-[#86b7fe] focus:ring-primary/25 disabled:bg-input-bg min-h-[120px]"
              placeholder="Masukkan catatan tambahan jika diperlukan..."
              value={formData.catatan}
              onChange={(e) => handleChange('catatan', e.target.value)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(ROUTES.SCHEDULES)}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            loading={submitting}
          >
            Simpan Jadwal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSchedule;
