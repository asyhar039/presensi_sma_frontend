import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, ChevronLeft, ChevronRight, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useGetSubjectsQuery } from '../../subjects/services/subjectsAPI';
import { useCreateTeacherMutation } from '../services/teachersAPI';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import PasswordInput from '../../../components/ui/Input/PasswordInput';
import Select from '../../../components/ui/Select/Select';
import Card from '../../../components/ui/Card/Card';
import Alert from '../../../components/feedback/Alert/Alert';

const initialFormData = {
  nip: '',
  nama_lengkap: '',
  jenis_kelamin: 'L',
  phone: '',
  email: '',
  alamat: '',
  employment_status: 'PNS',
  subject_id: '',
  class_id: '',
  is_homeroom: false,
  username: '',
  password: '',
  password_confirmation: '',
};

const AddTeacher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/guru';

  const { data: classResponse, isLoading: classesLoading } = useGetClassesQuery();
  const { data: subjectResponse, isLoading: subjectsLoading } = useGetSubjectsQuery();
  const [createTeacher, { isLoading: submitting }] = useCreateTeacherMutation();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const classes = classResponse?.data || [];
  const subjects = subjectResponse?.data || [];

  const validateField = (name, value) => {
    switch (name) {
      case 'nip':
        if (!value.trim()) return 'NIP / NUPTK wajib diisi';
        break;
      case 'nama_lengkap':
        if (!value.trim()) return 'Nama lengkap beserta gelar wajib diisi';
        break;
      case 'jenis_kelamin':
        if (!value) return 'Jenis kelamin wajib dipilih';
        break;
      case 'phone':
        if (!value.trim()) return 'Nomor WhatsApp / HP wajib diisi';
        break;
      case 'email':
        if (!value.trim()) return 'Email wajib diisi';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format email tidak valid';
        break;
      case 'alamat':
        if (!value.trim()) return 'Alamat lengkap wajib diisi';
        break;
      case 'username':
        if (!value.trim()) return 'Email / Username wajib diisi';
        break;
      case 'password':
        if (!value) return 'Password wajib diisi';
        if (value.length < 8) return 'Password minimal 8 karakter';
        break;
      case 'password_confirmation':
        if (!value) return 'Konfirmasi password wajib diisi';
        if (value !== formData.password) return 'Konfirmasi password tidak cocok';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(initialFormData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setTouched(Object.keys(initialFormData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await createTeacher({
        nip: formData.nip,
        name: formData.nama_lengkap,
        nama_lengkap: formData.nama_lengkap,
        gender: formData.jenis_kelamin,
        phone: formData.phone,
        email: formData.email,
        alamat: formData.alamat,
        username: formData.username || formData.email,
        password: formData.password,
        birth_date: '1990-01-01', // Fallback default value
      }).unwrap();

      setToast({ type: 'success', message: 'Data guru berhasil ditambahkan' });
      setTimeout(() => navigate(from), 1500);
    } catch (err) {
      const maintenance = isMaintenanceError(err);
      const message = getErrorMessage(err, 'Gagal menambahkan data guru');
      setToast({ type: 'error', message: maintenance ? `Mode Pratinjau: ${message}` : message });
    }
  };

  const handleCancel = () => {
    navigate(from);
  };

  const genderOptions = [
    { value: 'L', label: 'Laki-laki' },
    { value: 'P', label: 'Perempuan' },
  ];

  const employmentStatusOptions = [
    { value: 'PNS', label: 'PNS / ASN' },
    { value: 'PPPK', label: 'PPPK' },
    { value: 'GTT', label: 'Guru Tidak Tetap (GTT)' },
    { value: 'Honorer', label: 'Honorer' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Data Guru
        </button>
        <ChevronRight className="h-4 w-4 text-slate-400" />
        <span className="font-semibold text-slate-900">Tambah Guru Baru</span>
      </nav>

      {/* Toast Alert */}
      {toast && (
        <Alert
          variant={toast.type === 'success' ? 'success' : 'danger'}
          title={toast.type === 'success' ? 'Berhasil' : 'Gagal'}
          onDismiss={() => setToast(null)}
        >
          {toast.message}
        </Alert>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Identitas Guru */}
        <Card title="Identitas Guru" icon="user" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="NIP / NUPTK *"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              onBlur={() => handleBlur('nip')}
              placeholder="Contoh: 198507152010011002"
              error={errors.nip}
              required
            />
            <Input
              label="Nama Lengkap (beserta gelar) *"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              onBlur={() => handleBlur('nama_lengkap')}
              placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd"
              error={errors.nama_lengkap}
              required
            />
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold text-sm text-slate-700">Jenis Kelamin *</label>
              <div className="flex gap-6">
                {genderOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_kelamin"
                      value={opt.value}
                      checked={formData.jenis_kelamin === opt.value}
                      onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
                      onBlur={() => handleBlur('jenis_kelamin')}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              {touched.jenis_kelamin && errors.jenis_kelamin && (
                <p className="mt-1 text-sm text-danger">{errors.jenis_kelamin}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Section 2: Kontak & Alamat */}
        <Card title="Kontak & Alamat" icon="mail" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nomor WhatsApp / HP *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
              placeholder="Contoh: 081234567890"
              type="tel"
              error={errors.phone}
              required
            />
            <Input
              label="Email Pribadi *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="nama.guru@gmail.com"
              type="email"
              error={errors.email}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Alamat Lengkap *"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                onBlur={() => handleBlur('alamat')}
                placeholder="Jl. Pendidikan No. 123, Kelurahan, Kecamatan, Kota"
                error={errors.alamat}
                required
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Penugasan Akademik */}
        <Card title="Penugasan Akademik" icon="graduation-cap" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Status Kepegawaian"
              name="employment_status"
              value={formData.employment_status}
              onChange={handleChange}
              onBlur={() => handleBlur('employment_status')}
              options={employmentStatusOptions}
              placeholder="Pilih status"
            />
            <Select
              label="Mata Pelajaran Utama"
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              onBlur={() => handleBlur('subject_id')}
              placeholder="Pilih mata pelajaran"
              options={subjects.map((s) => ({ value: s.id || s.kode_mapel, label: s.nama_mapel }))}
              disabled={subjectsLoading}
            />
            <Select
              label="Kelas Mengajar"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              onBlur={() => handleBlur('class_id')}
              placeholder="Pilih kelas"
              options={classes.map((c) => ({ value: c.id, label: c.nama_kelas }))}
              disabled={classesLoading}
            />
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="is_homeroom"
                name="is_homeroom"
                checked={formData.is_homeroom}
                onChange={(e) => handleChange('is_homeroom', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="is_homeroom" className="text-sm font-medium text-slate-700 cursor-pointer">
                Tugaskan sebagai Wali Kelas
              </label>
            </div>
          </div>
        </Card>

        {/* Section 4: Keamanan & Akses */}
        <Card title="Keamanan & Akses" icon="lock" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Email / Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                placeholder="Digunakan untuk autentikasi login"
                error={errors.username}
                required
              />
            </div>
            <PasswordInput
              label="Password *"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Minimal 8 karakter"
              error={errors.password}
              required
            />
            <PasswordInput
              label="Konfirmasi Password *"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              onBlur={() => handleBlur('password_confirmation')}
              placeholder="Ketik ulang password"
              error={errors.password_confirmation}
              required
            />
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline-secondary"
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={handleCancel}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl text-white shadow-lg shadow-indigo-100 font-medium"
            disabled={submitting}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Data Guru'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
