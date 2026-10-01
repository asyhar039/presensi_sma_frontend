import type { IStudentProfile } from '@/features/student-permits/types/permit.types'

import { IconLogout, IconQrcode } from '@tabler/icons-react'
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useAuth } from '@/context/auth-context'
import { ExitLeaveForm } from '@/features/student-permits/components/forms/exit-leave-form'
import { LateLeaveForm } from '@/features/student-permits/components/forms/late-leave-form'
import { SickLeaveForm } from '@/features/student-permits/components/forms/sick-leave-form'
import { LeaveTypeSelector } from '@/features/student-permits/components/leave-type-selector'
import { StudentProfileCard } from '@/features/student-permits/components/student-profile-card'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { delay } from '@/utils/time'

const MOCK_STUDENT: IStudentProfile = {
  id: 1,
  identity_number: '3040507012',
  name: 'Andi',
  email: 'andi@example.com',
  classroom_id: 1,
  classroom_name: 'XI IPA 1',
  homeroom_teacher: 'Dra. Siti Aminah',
}

export function StudentDashboardView() {
  const [files, setFiles] = useState<File[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeTab, setActiveTab] = useState<
    'sick' | 'leave_school' | 'leave_in'
  >('sick')

  const navigate = useNavigate()
  const { logout } = useAuth()
  const confirm = useConfirmationStore((state) => state.show)

  const handleViewHistory = () => {
    navigate({ to: '/dashboard/student/attendance-history' })
  }

  const handleScanQR = () => {
    toast.info('Fitur scan QR akan segera hadir')
  }

  const handleLogout = async () => {
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
        toast.success('Logged out successfully')
        await navigate({ to: '/login', replace: true })
      },
    })
  }

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startDateObj = new Date(start)
    const endDateObj = new Date(end)
    const diff = endDateObj.getTime() - startDateObj.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const totalDays = calculateDays(startDate, endDate)

  const handleCancel = () => {
    setFiles([])
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800">
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="cloud-pattern"
              x="0"
              y="0"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="30" fill="white" opacity="0.3" />
              <circle cx="100" cy="100" r="40" fill="white" opacity="0.2" />
              <circle cx="150" cy="50" r="25" fill="white" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cloud-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen w-full bg-[#0B132B] py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Presensi Siswa Real-Time
              </h1>
            </div>
            <Button
              onClick={handleScanQR}
              className="bg-primary hover:bg-primary/90"
            >
              <IconQrcode className="mr-2 h-5 w-5" />
              Scan QR Absen
            </Button>
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-xl font-bold text-foreground">
                Pengajuan & Input Surat Izin
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Pencatatan resmi dispensasi, izin keluar, sakit, dan
                keterlambatan siswa
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <StudentProfileCard
                    student={MOCK_STUDENT}
                    onViewHistory={handleViewHistory}
                  />
                  <div className="mt-6 flex justify-start">
                    <Button
                      variant="ghost"
                      onClick={() => void handleLogout()}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <IconLogout className="mr-2 h-4 w-4" />
                      Keluar
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="space-y-6">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Jenis Izin</FieldLabel>
                        <LeaveTypeSelector
                          value={activeTab}
                          onChange={(value) => setActiveTab(value)}
                        />
                      </Field>
                    </FieldGroup>

                    {activeTab === 'sick' && (
                      <SickLeaveForm
                        files={files}
                        setFiles={setFiles}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        totalDays={totalDays}
                      />
                    )}

                    {activeTab === 'leave_school' && (
                      <ExitLeaveForm
                        student={MOCK_STUDENT}
                        onCancel={handleCancel}
                      />
                    )}

                    {activeTab === 'leave_in' && (
                      <LateLeaveForm
                        student={MOCK_STUDENT}
                        onCancel={handleCancel}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
