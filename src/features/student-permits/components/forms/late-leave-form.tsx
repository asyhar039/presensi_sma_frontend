import type { IStudentProfile } from '@/features/student-permits/types/permit.types'

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
import {
  LATE_LEAVE_REASONS,
  lateLeaveSchema,
} from '@/features/student-permits/schemas/late-leave-schema'
import { useAppForm } from '@/hooks/use-form'

interface LateLeaveFormProps {
  student: IStudentProfile
  onCancel: () => void
}

export function LateLeaveForm({ student, onCancel }: LateLeaveFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const today = new Date().toISOString().split('T')[0]

  const form = useAppForm({
    defaultValues: {
      expected_time: '07:00',
      arrival_time: '',
      reason_type: '',
      reason: '',
    },
    validators: {
      onChange: lateLeaveSchema,
    },
    onSubmit: async (value) => {
      try {
        console.log('Late Leave submitted:', { ...value, files, date: today })
        toast.success('Pengajuan izin terlambat berhasil dikirim!')
        form.reset()
        setFiles([])
      } catch {
        toast.error('Gagal mengirim pengajuan izin terlambat')
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
        <FieldGroup className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel>Nama Lengkap</FieldLabel>
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
            <Field>
              <FieldLabel>Tanggal Pengajuan</FieldLabel>
              <Input type="date" value={today} disabled className="bg-muted" />
            </Field>
          </div>

          {/* SECTION: DETAIL KETERLAMBATAN */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel>Jam Masuk Seharusnya</FieldLabel>
              <Input
                type="time"
                value="07:00"
                disabled
                className="bg-muted font-medium"
              />
            </Field>
            <form.AppField name="arrival_time">
              {(field) => (
                <Field>
                  <FieldLabel>Perkiraan Jam Datang *</FieldLabel>
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
            <form.AppField name="reason_type">
              {(field) => (
                <Field>
                  <FieldLabel>Alasan Terlambat *</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? '')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih alasan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LATE_LEAVE_REASONS.map((reason) => (
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
          </div>

          {/* SECTION: PENJELASAN & BUKTI */}
          <form.AppField name="reason">
            {(field) => (
              <Field>
                <FieldLabel>Penjelasan *</FieldLabel>
                <Textarea
                  placeholder="Berikan penjelasan singkat mengenai kendala yang dihadapi..."
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.AppField>

          <Field>
            <FieldLabel>Bukti Pendukung (Opsional)</FieldLabel>
            <FileUploadDropzone
              files={files}
              onFilesChange={setFiles}
              maxSizeMB={5}
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
            />
          </Field>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-4">
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
