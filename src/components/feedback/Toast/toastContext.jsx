import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Alert from '../Alert/Alert';

const ToastContext = createContext(null);

let nextId = 0;

const ToastContainer = ({ toasts = [], onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[2000] flex w-[min(92vw,380px)] flex-col gap-2">
      {toasts.map((toast) => (
        <Alert key={toast.id} variant={toast.variant} onDismiss={() => onDismiss(toast.id)}>
          {toast.message}
        </Alert>
      ))}
    </div>
  );
}

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
  }, []);

  const push = useCallback((message, variant = 'info', options = {}) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    timersRef.current[id] = setTimeout(() => dismiss(id), options.duration ?? 3500);
  }, [dismiss]);

  const toast = useMemo(() => ({
    show: (message, variant, options) => push(message, variant, options),
    info: (message, options) => push(message, 'info', options),
    success: (message, options) => push(message, 'success', options),
    warning: (message, options) => push(message, 'warning', options),
    error: (message, options) => push(message, 'danger', options),
    dismiss,
  }), [push, dismiss]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast harus dipakai di dalam <ToastProvider>.');
  return context;
}