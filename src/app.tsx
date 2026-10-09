import { ConfirmationDialog } from '@/components/composite/confirmation-dialog'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/auth-context'
import { QueryProvider } from '@/provider/query-provider'
import { RouterProvider } from '@/provider/router-provider'
import { ThemeProvider } from '@/provider/theme-provider'

export function App() {
  return (
    <>
      <Toaster />
      <ConfirmationDialog />
      <ThemeProvider />
      <QueryProvider>
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </QueryProvider>
    </>
  )
}

export default App
