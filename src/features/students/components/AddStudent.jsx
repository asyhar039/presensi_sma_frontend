import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useGetClassesQuery } from '../../classes/services/classesAPI';
import { useCreateStudentMutation } from '../services/studentsAPI';
import { isMaintenanceError, getErrorMessage } from '../../../utils/errors';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import Select from '../../../components/ui/Select/Select';
import Card from '../../../components/ui/Card/Card';
import Alert from '../../../components/feedback/Alert/Alert';

const initialFormData = {
  kode_siswa: '',
  nis: '',
  nama_lengkap: '',
  jenis_kelamin: 'L',
  nomor_telepon: '',
  email: '',
  alamat: '',
  class_id: '',
  status: 'aktif',
  username: '',
  password: '',
  password_confirmation: '',
};

const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/siswa';

  const { data: classResponse, isLoading: classesLoading, error: classesError } = useGetClassesQuery();
  const [createStudent, { isLoading: submitting, isError, error }] = useCreateStudentMutation();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState(null);

  const classes = classResponse?.data || [];

  const validateField = (name, value) => {
    switch (name) {
      case 'nis':
        if (!value.trim()) return 'NIS wajib diisi';
        if (!/^\d+$/.test(value)) return 'NIS harus berupa angka';
        break;
      case 'nama_lengkap':
        if (!value.trim()) return 'Nama lengkap wajib diisi';
        break;
      case 'jenis_kelamin':
        if (!value) return 'Jenis kelamin wajib dipilih';
        break;
      case 'nomor_telepon':
        if (!value.trim()) return 'Nomor telepon wajib diisi';
        break;
      case 'class_id':
        if (!value) return 'Penempatan kelas wajib dipilih';
        break;
      case 'username':
        if (!value.trim()) return 'Email/Username wajib diisi';
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
      await createStudent({
        nis: formData.nis,
        nama_lengkap: formData.nama_lengkap,
        jenis_kelamin: formData.jenis_kelamin,
        nomor_telepon: formData.nomor_telepon,
        email: formData.email || undefined,
        alamat: formData.alamat || undefined,
        class_id: formData.class_id,
        status: formData.status,
        username: formData.username,
        password: formData.password,
      }).unwrap();

      setToast({ type: 'success', message: 'Data siswa berhasil ditambahkan' });
      setTimeout(() => navigate(from), 1500);
    } catch (err) {
      const maintenance = isMaintenanceError(err);
      const message = getErrorMessage(err, 'Gagal menambahkan data siswa');
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

  const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb removed because handled by global layout flow if needed, 
          but if you want to keep the "Back" style navigation, keep it below the header */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-muted hover:text-dark transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Data Siswa
        </button>
        <ChevronRight className="h-4 w-4 text-muted" />
        <span className="font-semibold text-dark">Tambah Data Siswa</span>
      </nav>

      {/* Toast */}
      {toast && (
        <Alert
          variant={toast.type === 'success' ? 'success' : 'danger'}
          title={toast.type === 'success' ? 'Berhasil' : 'Gagal'}
          onDismiss={() => setToast(null)}
        >
          {toast.message}
        </Alert>
      )}

      {/* Form Cards */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Card 1: Identitas Siswa */}
        <Card title="Identitas Siswa" icon="user" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Kode Siswa"
              name="kode_siswa"
              value={formData.kode_siswa}
              onChange={handleChange}
              onBlur={() => handleBlur('kode_siswa')}
              placeholder="Akan di-generate otomatis"
              disabled
              className="bg-gray-50"
            />
            <Input
              label="NIS *"
              name="nis"
              value={formData.nis}
              onChange={handleChange}
              onBlur={() => handleBlur('nis')}
              placeholder="Masukkan NIS"
              error={errors.nis}
              required
            />
            <Input
              label="Nama Lengkap *"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              onBlur={() => handleBlur('nama_lengkap')}
              placeholder="Masukkan nama lengkap"
              error={errors.nama_lengkap}
              required
            />
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">Jenis Kelamin *</label>
              <div className="flex gap-6">
                {genderOptions.map(opt => (
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
                    <span className="text-sm text-dark">{opt.label}</span>
                  </label>
                ))}
              </div>
              {touched.jenis_kelamin && errors.jenis_kelamin && (
                <p className="mt-1 text-sm text-danger">{errors.jenis_kelamin}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Card 2: Kontak & Alamat */}
        <Card title="Kontak & Alamat" icon="mail" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nomor WhatsApp/Telepon *"
              name="nomor_telepon"
              value={formData.nomor_telepon}
              onChange={handleChange}
              onBlur={() => handleBlur('nomor_telepon')}
              placeholder="Masukkan nomor telepon"
              type="tel"
              error={errors.nomor_telepon}
              required
            />
            <Input
              label="Email Siswa"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Masukkan email siswa"
              type="email"
              error={errors.email}
            />
            <div className="md:col-span-2">
              <Input
                label="Alamat Lengkap *"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                onBlur={() => handleBlur('alamat')}
                placeholder="Masukkan alamat lengkap"
                error={errors.alamat}
                required
              />
            </div>
          </div>
        </Card>

        {/* Card 3: Data Akademik */}
        <Card title="Data Akademik" icon="graduation-cap" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Penempatan Kelas *"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              onBlur={() => handleBlur('class_id')}
              placeholder="Pilih kelas"
              options={classes.map(c => ({ value: c.id, label: c.nama_kelas }))}
              error={errors.class_id}
              disabled={classesLoading}
              required
            />
            <Select
              label="Status Siswa"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={() => handleBlur('status')}
              placeholder="Pilih status"
              options={statusOptions}
              error={errors.status}
            />
          </div>
        </Card>

        {/* Card 4: Keamanan & Akses */}
        <Card title="Keamanan & Akses" icon="lock" className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Email / Username Siswa"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur('username')}
              placeholder="Masukkan email/username"
              type="email"
              error={errors.username}
              required
            />
            <Input
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Masukkan password"
              type="password"
              error={errors.password}
              required
            />
            <Input
              label="Konfirmasi Password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              onBlur={() => handleBlur('password_confirmation')}
              placeholder="Konfirmasi password"
              type="password"
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
            className="px-6 py-2.5"
            onClick={handleCancel}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl shadow-lg shadow-indigo-100"
            disabled={submitting || classesLoading}
          >
            {submitting ? 'Menyimpan...' : 'Simpan Data Siswa'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;