import { useEffect } from 'react';
import RenderIcon from '../../../utils/iconMap';

const SIZES = {
  sm: 'max-w-[300px]',
  default: 'max-w-[500px]',
  lg: 'max-w-[800px]',
};

const Modal = ({ open, title, size = 'default', onClose, children }) => {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1055] overflow-y-auto"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]">
        <div
          className={`pointer-events-auto my-4 w-full ${SIZES[size] || SIZES.default}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex w-full flex-col rounded-lg border border-[#dee2e6] bg-white shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)]">
            {title ? (
              <div className="flex items-center justify-between border-b border-[#dee2e6] px-4 py-4">
                <h5 className="mb-0 text-xl font-medium">{title}</h5>
                <button
                  type="button"
                  className="flex size-7 items-center justify-center rounded text-secondary hover:opacity-75"
                  aria-label="Tutup"
                  onClick={onClose}
                >
                  <RenderIcon name="xmark" className="h-4 w-4" />
                </button>
              </div>
            ) : null}
            <div className="relative flex-1 p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;