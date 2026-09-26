import type {
  IStudentProfile,
  PermitType,
} from '@/features/student-permits/types/permit.types'

import { IconLogout, IconQrcode } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadDropzone } from '@/features/student-permits/components/file-upload-dropzone'
import { LateArrivalLeaveForm } from '@/features/student-permits/components/forms/late-arrival-leave-form'
import { OutOfSchoolLeaveForm } from '@/features/student-permits/components/forms/out-of-school-leave-form'
import { LeaveTypeSelector } from '@/features/student-permits/components/leave-type-selector'
import { StudentProfileCard } from '@/features/student-permits/components/student-profile-card'
import { permitApplicationSchema } from '@/features/student-permits/schemas/permit-application'
import { useAppForm } from '@/hooks/use-form'

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
  const [activeTab, setActiveTab] = useState<PermitType>('sick')

  const form = useAppForm({
    defaultValues: {
      type: 'sick' as PermitType,
      start_date: '',
      end_date: '',
      reason: '',
    },
    validators: {
      onChange: permitApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Form submitted:', value, files)
        toast.success('Permohonan izin berhasil diterbitkan!')
        form.reset()
        setFiles([])
        setStartDate('')
        setEndDate('')
      } catch {
        toast.error('Gagal menyimpan permohonan')
      }
    },
  })

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
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault()
                    form.handleSubmit()
                  }}
                >
                  <form.AppForm>
                    <FieldGroup>
                      <form.AppField name="type">
                        {(field) => (
                          <Field>
                            <FieldLabel>Jenis Izin</FieldLabel>
                            <LeaveTypeSelector
                              value={activeTab}
                              onChange={(value) => {
                                field.handleChange(value)
                                setActiveTab(value)
                              }}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        )}
                      </form.AppField>

                      {activeTab === 'sick' && (
                        <>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <form.AppField name="start_date">
                              {(field) => (
                                <Field>
                                  <FieldLabel>Tanggal Mulai Izin</FieldLabel>
                                  <Input
                                    type="date"
                                    value={field.state.value}
                                    onChange={(e) => {
                                      field.handleChange(e.target.value)
                                      setStartDate(e.target.value)
                                    }}
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                </Field>
                              )}
                            </form.AppField>

                            <form.AppField name="end_date">
                              {(field) => (
                                <Field>
                                  <FieldLabel>Tanggal Selesai Izin</FieldLabel>
                                  <Input
                                    type="date"
                                    value={field.state.value}
                                    onChange={(e) => {
                                      field.handleChange(e.target.value)
                                      setEndDate(e.target.value)
                                    }}
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                </Field>
                              )}
                            </form.AppField>
                          </div>

                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                            <p className="mb-2 text-sm text-blue-700 dark:text-blue-300">
                              Pilih rentang tanggal sesuai surat keterangan
                              dokter
                            </p>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              Total: {totalDays} Hari
                            </Badge>
                          </div>

                          <form.AppField name="reason">
                            {(field) => (
                              <Field>
                                <FieldLabel>Keterangan / Diagnosa</FieldLabel>
                                <Textarea
                                  placeholder="Masukkan detail keterangan sakit..."
                                  rows={4}
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  aria-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                />
                                <FieldError errors={field.state.meta.errors} />
                              </Field>
                            )}
                          </form.AppField>

                          <Field>
                            <FieldLabel>
                              Lampiran Surat Dokter (PDF, JPG, PNG)
                            </FieldLabel>
                            <FileUploadDropzone
                              files={files}
                              onFilesChange={setFiles}
                              maxSizeMB={5}
                              acceptedTypes={[
                                'application/pdf',
                                'image/jpeg',
                                'image/png',
                              ]}
                            />
                          </Field>
                        </>
                      )}

                      {activeTab === 'leave_school' && <OutOfSchoolLeaveForm />}
                      {activeTab === 'leave_in' && <LateArrivalLeaveForm />}

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            form.reset()
                            setFiles([])
                            setStartDate('')
                            setEndDate('')
                          }}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <form.ButtonSubmit
                          label="Simpan & Terbitkan Surat Izin"
                          className="flex-1"
                        />
                      </div>
                    </FieldGroup>
                  </form.AppForm>
                </form>
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
