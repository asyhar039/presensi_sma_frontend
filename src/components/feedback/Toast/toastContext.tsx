import { createContext, useContext } from 'react'
import { toast } from 'sonner'

const ToastContext = createContext<{ toast: typeof toast } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)?.toast || toast
}
