import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from '../ui/Button/Button';
import Alert from '../feedback/Alert/Alert';

const PwaReloadPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-sm">
      <Alert variant="warning" className="shadow-lg">
        <div className="mb-2 font-bold">Versi Baru Tersedia!</div>
        <div className="mb-3 text-sm">Ada pembaruan sistem presensi. Klik perbarui untuk mendapatkan versi terbaru.</div>
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => updateServiceWorker(true)}>
            Perbarui Sekarang
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setNeedRefresh(false)}>
            Nanti Saja
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default PwaReloadPrompt;
