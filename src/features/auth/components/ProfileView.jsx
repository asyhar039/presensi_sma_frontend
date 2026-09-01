import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../authSelectors';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';

const ProfileView = () => {
  const user = useAppSelector(selectUser);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <Card className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
        <h4 className="mb-0 text-xl font-bold text-text-main">
          Profil {user?.role === 'super_admin' ? 'Super Admin' : 'Guru'}
        </h4>
      </Card>

      {/* Profile Form Card */}
      <Card title="Biodata Pribadi" className="mb-6 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm sm:p-8">
        <form className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nama Lengkap"
              name="nama_lengkap"
              value={user?.nama_lengkap || ''}
              placeholder="Masukkan nama lengkap"
              readOnly
            />
            <Input
              label="NIP"
              name="nip"
              value={user?.nip || '19850312 201001 1 008'}
              placeholder="NIP"
              disabled
              className="bg-gray-100"
            />
            <Input
              label="Nomor WhatsApp"
              name="phone"
              value={user?.phone || '081234567890'}
              placeholder="Masukkan nomor WhatsApp"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={user?.email || ''}
              placeholder="Masukkan alamat email"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary/90 md:w-auto"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileView;
