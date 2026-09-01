import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-[150] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium shadow-md transition-all duration-300 ${
        isOnline
          ? 'bg-emerald-600 text-white'
          : 'bg-amber-600 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 shrink-0 animate-pulse" />
          <span>Koneksi internet kembali tersedia.</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>
            Anda sedang offline. Pastikan koneksi internet tersedia untuk menyimpan perubahan.
          </span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
