import type { IStudentProfile } from '@/features/student-permits/types/permit.types'

import { IconMapPin } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadDropzone } from '@/features/student-permits/components/file-upload-dropzone'
import { EXIT_LEAVE_REASONS } from '@/features/student-permits/schemas/exit-leave-schema'
import { useAppForm } from '@/hooks/use-form'

interface ExitLeaveFormProps {
  student: IStudentProfile
  onCancel: () => void
}

export function ExitLeaveForm({ student, onCancel }: ExitLeaveFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const today = new Date().toISOString().split('T')[0]

  const form = useAppForm({
    defaultValues: {
      departure_time: '',
      return_time: '',
      reason_type: '',
      destination: '',
      reason: '',
      emergency_contact: '',
    },
    onSubmit: async (value) => {
      try {
        console.log('Exit Leave submitted:', { ...value, files, date: today })
        toast.success('Pengajuan izin keluar berhasil dikirim!')
        form.reset()
        setFiles([])
      } catch {
        toast.error('Gagal mengirim pengajuan izin keluar')
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Nama Pemohon</FieldLabel>
              <Input value={student.name} disabled className="bg-muted" />
            </Field>
            <Field>
              <FieldLabel>Kelas</FieldLabel>
              <Input
                value={student.classroom_name}
                disabled
                className="bg-muted"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel>Tanggal</FieldLabel>
              <Input type="date" value={today} disabled className="bg-muted" />
            </Field>
            <form.AppField name="departure_time">
              {(field) => (
                <Field>
                  <FieldLabel>Jam Keluar *</FieldLabel>
                  <Input
                    type="time"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
            <form.AppField name="return_time">
              {(field) => (
                <Field>
                  <FieldLabel>Perkiraan Kembali *</FieldLabel>
                  <Input
                    type="time"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="reason_type">
              {(field) => (
                <Field>
                  <FieldLabel>Alasan Keluar *</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? '')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih alasan keluar" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXIT_LEAVE_REASONS.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
            <form.AppField name="destination">
              {(field) => (
                <Field>
                  <FieldLabel>Tujuan / Lokasi *</FieldLabel>
                  <div className="relative">
                    <Input
                      placeholder="Contoh: Rumah Sakit Permata"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                      className="pl-9"
                    />
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
          </div>

          <form.AppField name="reason">
            {(field) => (
              <Field>
                <FieldLabel>Keterangan *</FieldLabel>
                <Textarea
                  placeholder="Jelaskan secara detail keperluan keluar Anda..."
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.AppField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="emergency_contact">
              {(field) => (
                <Field>
                  <FieldLabel>Kontak Darurat (Opsional)</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
          </div>

          <Field>
            <FieldLabel>Lampiran Bukti (Opsional)</FieldLabel>
            <FileUploadDropzone
              files={files}
              onFilesChange={setFiles}
              maxSizeMB={5}
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
                setFiles([])
                onCancel()
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <form.ButtonSubmit
              label="Kirim Pengajuan"
              className="flex-1 bg-primary text-primary-foreground"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}
