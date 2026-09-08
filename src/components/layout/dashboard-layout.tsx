import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/context/auth-context'
import { useDisclosure } from '@/hooks/use-disclosure'
import { getNavigation } from '@/utils/role'
import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, role } = useAuth()
  const navigation = getNavigation(role)
  const { isOpen, open, close, toggle } = useDisclosure()

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      <aside className="sticky top-0 hidden h-svh w-72 shrink-0 border-r border-sidebar-border lg:block">
        <DashboardSidebar
          groups={navigation}
          userName={user.name}
          identityNumber={user.identity_number}
        />
      </aside>

      <Sheet open={isOpen} onOpenChange={toggle}>
        <SheetContent
          side="left"
          className="w-80 max-w-[85vw] gap-0 border-sidebar-border bg-sidebar p-0"
          aria-label="Dashboard navigation"
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar
            groups={navigation}
            userName={user.name}
            identityNumber={user.identity_number}
            onNavigate={() => close()}
            className="h-full"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenuClick={() => open()} />
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
