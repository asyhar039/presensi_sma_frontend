import { useState } from 'react';
import { Building2, Sliders, Bell, Laptop, Save, Eye, EyeOff } from 'lucide-react';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';
import PasswordInput from '../../../components/ui/Input/PasswordInput';
import Button from '../../../components/ui/Button/Button';
import Alert from '../../../components/feedback/Alert/Alert';

const initialSettings = {
  nama_sekolah: 'SMA Negeri 1 Google',
  npsn: '20101234',
  alamat_sekolah: 'Jl. Pendidikan No. 45, Jakarta Selatan',
  jam_masuk: '06:45',
  jam_pulang: '15:30',
};

const initialPasswordData = {
  current_password: '',
  new_password: '',
  confirm_password: '',
};

const NAV_ITEMS = [
  {
    id: 'umum',
    title: 'Umum & Sekolah',
    description: 'Informasi sekolah & jam kerja',
    icon: Building2,
  },
  {
    id: 'keamanan',
    title: 'Toleransi & Kebijakan', // Placeholder, akan kita ganti dengan Keamanan sesuai desain
    description: 'Atur batas waktu & denda',
    icon: Sliders,
  },
  {
    id: 'notifikasi',
    title: 'Notifikasi',
    description: 'WhatsApp & Email gateway',
    icon: Bell,
  },
  {
    id: 'sistem',
    title: 'Sistem & PWA',
    description: 'Mode offline & sync',
    icon: Laptop,
  },
];

// Update nav item for security
NAV_ITEMS[1] = {
    id: 'keamanan',
    title: 'Keamanan Akun',
    description: 'Kelola kredensial keamanan',
    icon: Sliders,
};

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('keamanan'); // Set default to keamanan to match screenshot
  const [formData, setFormData] = useState(initialSettings);
  const [passwordData, setPasswordData] = useState(initialPasswordData);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSubmitting] = useState(false);

  const handlePasswordChange = (name, value) => {
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ type: 'success', message: 'Password berhasil diperbarui (Simulasi UI State)' });
    }, 500);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ type: 'success', message: 'Pengaturan berhasil diperbarui (Simulasi UI State)' });
    }, 500);
  };


  return (
    <div className="flex flex-col gap-6">
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

      {/* Main Grid: Nav Cards & Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Navigation Sidebar Cards */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-start gap-4 rounded-2xl p-4 text-left transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-8">
          {activeTab === 'umum' ? (
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900">Pengaturan Umum Sekolah</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Informasi dasar yang akan tampil pada kop surat dan laporan
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Nama Sekolah *"
                  name="nama_sekolah"
                  value={formData.nama_sekolah}
                  onChange={handleChange}
                  placeholder="Masukkan nama sekolah"
                  required
                />

                <Input
                  label="NPSN *"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  placeholder="Masukkan NPSN sekolah"
                  required
                />

                <Input
                  label="Alamat Sekolah *"
                  name="alamat_sekolah"
                  value={formData.alamat_sekolah}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap sekolah"
                  required
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Jam Masuk Utama *"
                    name="jam_masuk"
                    type="time"
                    value={formData.jam_masuk}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Jam Pulang Utama *"
                    name="jam_pulang"
                    type="time"
                    value={formData.jam_pulang}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl text-white shadow-lg shadow-indigo-100 font-medium"
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    Simpan Pengaturan
                  </Button>
                </div>
              </form>
            </Card>
          ) : activeTab === 'keamanan' ? (
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-extrabold text-slate-900">Ubah Password Admin</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Masukkan password lama dan password baru untuk mengubah kredensial admin
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <PasswordInput
                  label="Password Saat Ini *"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password saat ini"
                  required
                />

                <PasswordInput
                  label="Password Baru *"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Minimal 8 karakter"
                  required
                />

                <PasswordInput
                  label="Konfirmasi Password Baru *"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Ketik ulang password baru"
                  required
                />

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl text-white shadow-lg shadow-indigo-100 font-medium"
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    Simpan Password
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            /* Placeholder untuk section lainnya */
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <div className="flex flex-col items-center justify-center py-10">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                  <Sliders className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Section {NAV_ITEMS.find((n) => n.id === activeTab)?.title}
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  Konfigurasi untuk bagian ini dalam tahap pengembangan dan dapat dikustomisasi lebih lanjut.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
