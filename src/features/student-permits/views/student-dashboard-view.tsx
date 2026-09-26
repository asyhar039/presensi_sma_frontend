import type { IStudentProfile } from '@/features/student-permits/types/permit.types'

import { IconLogout, IconQrcode } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ExitLeaveForm } from '@/features/student-permits/components/forms/exit-leave-form'
import { LateArrivalLeaveForm } from '@/features/student-permits/components/forms/late-arrival-leave-form'
import { SickLeaveForm } from '@/features/student-permits/components/forms/sick-leave-form'
import { LeaveTypeSelector } from '@/features/student-permits/components/leave-type-selector'
import { StudentProfileCard } from '@/features/student-permits/components/student-profile-card'

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

  const handleViewHistory = () => {
    toast.info('Fitur riwayat akan segera hadir')
  }

  const handleScanQR = () => {
    toast.info('Fitur scan QR akan segera hadir')
  }

  const handleLogout = () => {
    toast.info('Logout')
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

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Presensi Siswa Real-Time
            </h1>
            <p className="text-sm text-indigo-200">
              Monitor daily attendance, quickly scan student IDs, and manage
              leave requests in one central hub.
            </p>
          </div>
          <Button
            onClick={handleScanQR}
            className="bg-primary hover:bg-primary/90"
          >
            <IconQrcode className="mr-2 h-5 w-5" />
            Scan QR Absen
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="mb-1 text-xl font-semibold text-white">
            Pengajuan & Input Surat Izin
          </h2>
          <p className="text-sm text-indigo-200">
            Pencatatan resmi dispensasi, izin keluar, sakit, dan keterlambatan
            siswa
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="mb-3 text-base font-medium text-white">
                Data Siswa
              </h3>
              <StudentProfileCard
                student={MOCK_STUDENT}
                onViewHistory={handleViewHistory}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 text-base font-medium text-white">
              Detail Pengajuan Izin
            </h3>
            <Card>
              <CardContent className="pt-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Jenis Izin</FieldLabel>
                    <LeaveTypeSelector
                      value={activeTab}
                      onChange={(value) => setActiveTab(value)}
                    />
                  </Field>

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

                  {activeTab === 'leave_in' && <LateArrivalLeaveForm />}
                </FieldGroup>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <IconLogout className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  )
}
