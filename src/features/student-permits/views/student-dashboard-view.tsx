import type {
  ILeaveRequestResult,
  LeaveRequestType,
} from '@/features/student-permits/types/permit.types'

import {
  IconHistory,
  IconInfoCircle,
  IconLogout,
  IconQrcode,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsPanel } from '@/components/ui/tabs'
import { useAuth } from '@/context/auth-context'
import { AttendanceScanDialog } from '@/features/student-permits/components/attendance-scan-dialog'
import { EarlyOutForm } from '@/features/student-permits/components/early-out-form'
import { LateArrivalForm } from '@/features/student-permits/components/late-arrival-form'
import { LeaveRequestResultDialog } from '@/features/student-permits/components/leave-request-result-dialog'
import { LeaveTypeTabs } from '@/features/student-permits/components/leave-type-tabs'
import { PermitError } from '@/features/student-permits/components/permit-feedback'
import { SickLeaveForm } from '@/features/student-permits/components/sick-leave-form'
import { StudentInfoCard } from '@/features/student-permits/components/student-info-card'
import {
  presenceInformationQueryOptions,
  studentInformationQueryOptions,
} from '@/features/student-permits/lib/student-permit-query-options'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { delay } from '@/utils/time'

type ResultState = {
  type: LeaveRequestType
  result: ILeaveRequestResult
}

export function StudentDashboardView() {
  const [tab, setTab] = useState<LeaveRequestType>('sick_leave')
  const [scanOpen, setScanOpen] = useState(false)
  const [resultState, setResultState] = useState<ResultState | null>(null)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const confirm = useConfirmationStore((state) => state.show)

  const infoQuery = useQuery(studentInformationQueryOptions())
  const presenceQuery = useQuery(presenceInformationQueryOptions())

  const handleLogout = () => {
    confirm({
      icon: IconLogout,
      title: 'Confirm Logout',
      description: 'Are you sure you want to log out?',
      actionLabel: 'Log out',
      actionVariant: 'destructive',
      cancelLabel: 'Cancel',
      onAction: async (props) => {
        props.close()
        await logout()
        await delay(100)
        toast.success('Logged out successfully.')
        await navigate({ to: '/login', replace: true })
      },
    })
  }

  const handleSuccess =
    (type: LeaveRequestType) => (result: ILeaveRequestResult) => {
      setResultState({ type, result })
    }

  const goHistory = () => {
    setResultState(null)
    void navigate({ to: '/dashboard/student/attendance-history' })
  }

  const presence = presenceQuery.data
  const alreadyEarlyOut = presence?.has_early_out ?? false
  const alreadyLateArrival = presence?.has_late_arrival ?? false

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-sm text-muted-foreground">
            Submit sick leave, early leave, or late arrival requests.
          </p>
        </div>
        <Button
          onClick={() => setScanOpen(true)}
          disabled={presenceQuery.isPending}
          className="w-full sm:w-auto"
        >
          {presenceQuery.isPending ? (
            <Skeleton className="h-4 w-20 bg-primary-foreground/30" />
          ) : (
            <>
              <IconQrcode className="size-4" />
              Scan QR
            </>
          )}
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <StudentInfoCard
            info={infoQuery.data}
            isLoading={infoQuery.isPending}
            isError={infoQuery.isError}
            error={infoQuery.error}
            onRetry={() => void infoQuery.refetch()}
          />
          <Card>
            <CardContent className="flex flex-col gap-2 p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  void navigate({ to: '/dashboard/student/attendance-history' })
                }
              >
                <IconHistory className="size-4" />
                View My History
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <IconLogout className="size-4" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>New Request</CardTitle>
            <CardDescription>
              {presence && presence.public_holidays.length > 0
                ? `Upcoming holidays: ${presence.public_holidays
                    .slice(0, 2)
                    .map((holiday) => holiday.name)
                    .join(', ')}.`
                : 'Choose a request type below.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {presenceQuery.isPending ? (
              <div className="space-y-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : presenceQuery.isError || !presence ? (
              <PermitError
                message="We could not load request settings. Please check your connection and try again."
                action={{
                  label: 'Retry',
                  onClick: () => void presenceQuery.refetch(),
                }}
              />
            ) : (
              <Tabs
                value={tab}
                onValueChange={(value) => setTab(value as LeaveRequestType)}
              >
                <LeaveTypeTabs />
                <TabsPanel value="sick_leave">
                  <SickLeaveForm
                    presence={presence}
                    onSuccess={handleSuccess('sick_leave')}
                  />
                </TabsPanel>
                <TabsPanel value="early_out">
                  {alreadyEarlyOut ? (
                    <AlreadySubmitted kind="early leave" />
                  ) : (
                    <EarlyOutForm
                      presence={presence}
                      onSuccess={handleSuccess('early_out')}
                    />
                  )}
                </TabsPanel>
                <TabsPanel value="late_arrival">
                  {alreadyLateArrival ? (
                    <AlreadySubmitted kind="late arrival" />
                  ) : (
                    <LateArrivalForm
                      presence={presence}
                      onSuccess={handleSuccess('late_arrival')}
                    />
                  )}
                </TabsPanel>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <AttendanceScanDialog open={scanOpen} onOpenChange={setScanOpen} />

      {resultState && (
        <LeaveRequestResultDialog
          type={resultState.type}
          result={resultState.result}
          onClose={() => setResultState(null)}
          onViewHistory={goHistory}
        />
      )}
    </div>
  )
}

function AlreadySubmitted({ kind }: { kind: string }) {
  const navigate = useNavigate()
  return (
    <div className="relative overflow-hidden rounded-lg border p-8 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-muted/60 backdrop-blur-[1px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-sm space-y-3">
        <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <IconInfoCircle className="size-5" />
        </span>
        <p className="font-semibold">
          You already submitted an {kind} request today.
        </p>
        <p className="text-sm text-muted-foreground">
          Only one {kind} request is allowed per day. Check history for more
          details.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void navigate({ to: '/dashboard/student/attendance-history' })
          }
        >
          <IconHistory className="size-4" />
          Check History
        </Button>
      </div>
    </div>
  )
}
