import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUploadDropzone } from '@/features/student-permits/components/file-upload-dropzone'
import { permitApplicationSchema } from '@/features/student-permits/schemas/permit-application'
import { useAppForm } from '@/hooks/use-form'

interface SickLeaveFormProps {
  files: File[]
  setFiles: (files: File[]) => void
  startDate: string
  endDate: string
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  totalDays: number
}

export function SickLeaveForm({
  files,
  setFiles,
  setStartDate,
  setEndDate,
  totalDays,
}: SickLeaveFormProps) {
  const form = useAppForm({
    defaultValues: {
      type: 'sick',
      start_date: '',
      end_date: '',
      reason: '',
    },
    validators: {
      onChange: permitApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Sick Leave submitted:', value, files)
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

  const handleCancel = () => {
    form.reset()
    setFiles([])
    setStartDate('')
    setEndDate('')
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        <FieldGroup>
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
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <FieldError errors={field.state.meta.errors} />
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
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.AppField>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
            <p className="mb-2 text-sm text-blue-700 dark:text-blue-300">
              Pilih rentang tanggal sesuai surat keterangan dokter
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.AppField>

          <Field>
            <FieldLabel>Lampiran Surat Dokter (PDF, JPG, PNG)</FieldLabel>
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
              onClick={handleCancel}
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
  )
}
