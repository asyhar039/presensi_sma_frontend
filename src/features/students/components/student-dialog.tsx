import type { IStudent } from '@/features/students/types/student.types'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { DATE_FORMAT } from '@/constants/app'
import { useStudentStore } from '@/features/students/components/student-store'
import { useCreateStudent } from '@/features/students/hooks/use-create-student'
import { useStudentDetail } from '@/features/students/hooks/use-student-detail'
import { useUpdateStudent } from '@/features/students/hooks/use-update-student'
import { useUpdateStudentPassword } from '@/features/students/hooks/use-update-student-password'
import {
  STUDENT_GENDER_FORM_OPTIONS,
  STUDENT_STATUS_FORM_OPTIONS,
} from '@/features/students/lib/student-table'
import {
  type IStudentCreateSchema,
  type IStudentPasswordSchema,
  studentCreateSchema,
  studentPasswordSchema,
  studentSchema,
} from '@/features/students/schemas/student-schema'
import { useAppForm } from '@/hooks/use-form'
import { formatDate } from '@/utils/datetime'
import { formErrorHandler, getErrorMessage } from '@/utils/error'

function toNullableString(value: string | null | undefined): string {
  return value ?? ''
}

function toPayloadNullable(value: string | null | undefined) {
  if (value === undefined || value === null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function StudentForm({ initial }: { initial: IStudent | null }) {
  const closeDialog = useStudentStore((state) => state.closeDialog)
  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent(initial?.id ?? null)
  const isEdit = initial !== null

  const form = useAppForm({
    defaultValues: {
      identity_number: initial?.user.identity_number ?? '',
      name: initial?.user.name ?? '',
      email: initial?.user.email ?? '',
      phone_number: toNullableString(initial?.user.phone_number),
      gender: (initial?.gender.key ?? 'male') as IStudentCreateSchema['gender'],
      address: toNullableString(initial?.address),
      status: (initial?.status.key ??
        'active') as IStudentCreateSchema['status'],
      password: '',
      password_confirmation: '',
    } as IStudentCreateSchema,
    validators: {
      onChange: (isEdit
        ? studentSchema
        : studentCreateSchema) as typeof studentCreateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (initial) {
          await updateMutation.mutateAsync({
            identity_number: value.identity_number,
            name: value.name,
            email: value.email,
            phone_number: toPayloadNullable(value.phone_number),
            gender: value.gender,
            address: toPayloadNullable(value.address),
            status: value.status,
          })
        } else {
          await createMutation.mutateAsync({
            identity_number: value.identity_number,
            name: value.name,
            email: value.email,
            phone_number: toPayloadNullable(value.phone_number),
            gender: value.gender,
            address: toPayloadNullable(value.address),
            status: value.status,
            password: value.password,
            password_confirmation: value.password_confirmation,
          })
        }
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to save student.')
      }
    },
  })

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
            <form.AppField name="identity_number">
              {(field) => (
                <field.FormField<string>
                  label="Identity Number"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="text"
                      placeholder="e.g. 1234567890"
                      maxLength={64}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="name">
              {(field) => (
                <field.FormField<string>
                  label="Name"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="text"
                      placeholder="e.g. John Doe"
                      maxLength={255}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="email">
              {(field) => (
                <field.FormField<string>
                  label="Email"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="email"
                      placeholder="e.g. student@mail.com"
                      maxLength={255}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="phone_number">
              {(field) => (
                <field.FormField<string>
                  label="Phone Number"
                  children={({ isInvalid, onChange, onBlur, ...props }) => (
                    <Input
                      type="text"
                      placeholder="e.g. 081234567890"
                      maxLength={32}
                      onBlur={onBlur}
                      onChange={(event) => onChange(event.target.value)}
                      aria-invalid={isInvalid}
                      {...props}
                    />
                  )}
                />
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.AppField name="gender">
              {(field) => (
                <field.FormField<string>
                  label="Gender"
                  children={({ value, onChange }) => (
                    <Select
                      items={STUDENT_GENDER_FORM_OPTIONS}
                      value={value}
                      onValueChange={(next) =>
                        onChange(next as IStudentCreateSchema['gender'])
                      }
                    >
                      <SelectTrigger className="w-full" aria-label="Gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {STUDENT_GENDER_FORM_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </form.AppField>
            <form.AppField name="status">
              {(field) => (
                <field.FormField<string>
                  label="Status"
                  children={({ value, onChange }) => (
                    <Select
                      items={STUDENT_STATUS_FORM_OPTIONS}
                      value={value}
                      onValueChange={(next) =>
                        onChange(next as IStudentCreateSchema['status'])
                      }
                    >
                      <SelectTrigger className="w-full" aria-label="Status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STUDENT_STATUS_FORM_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="address">
            {(field) => (
              <field.FormField<string>
                label="Address"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Textarea
                    placeholder="Student address"
                    maxLength={128}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>

          {!isEdit && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <form.AppField name="password">
                {(field) => (
                  <field.FormField<string>
                    label="Password"
                    children={({ isInvalid, onChange, onBlur, ...props }) => (
                      <Input
                        type="password"
                        placeholder="Minimum 8 characters"
                        onBlur={onBlur}
                        onChange={(event) => onChange(event.target.value)}
                        aria-invalid={isInvalid}
                        {...props}
                      />
                    )}
                  />
                )}
              </form.AppField>
              <form.AppField name="password_confirmation">
                {(field) => (
                  <field.FormField<string>
                    label="Password Confirmation"
                    children={({ isInvalid, onChange, onBlur, ...props }) => (
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        onBlur={onBlur}
                        onChange={(event) => onChange(event.target.value)}
                        aria-invalid={isInvalid}
                        {...props}
                      />
                    )}
                  />
                )}
              </form.AppField>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <form.ButtonSubmit
              label={isEdit ? 'Save changes' : 'Create'}
              loadingLabel="Saving..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}

function StudentPasswordForm({ item }: { item: IStudent }) {
  const closeDialog = useStudentStore((state) => state.closeDialog)
  const passwordMutation = useUpdateStudentPassword(item.id)

  const form = useAppForm({
    defaultValues: {
      password: '',
      password_confirmation: '',
    } as IStudentPasswordSchema,
    validators: { onChange: studentPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await passwordMutation.mutateAsync({
          password: value.password,
          password_confirmation: value.password_confirmation,
        })
        closeDialog()
      } catch (error) {
        formErrorHandler(error, form, 'Failed to update password.')
      }
    },
  })

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
          <form.AppField name="password">
            {(field) => (
              <field.FormField<string>
                label="New Password"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>
          <form.AppField name="password_confirmation">
            {(field) => (
              <field.FormField<string>
                label="Password Confirmation"
                children={({ isInvalid, onChange, onBlur, ...props }) => (
                  <Input
                    type="password"
                    placeholder="Repeat new password"
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={isInvalid}
                    {...props}
                  />
                )}
              />
            )}
          </form.AppField>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <form.ButtonSubmit
              label="Update password"
              loadingLabel="Saving..."
              className="sm:w-auto"
            />
          </div>
        </FieldGroup>
      </form.AppForm>
    </form>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function StudentDetail({ item }: { item: IStudent }) {
  const detailQuery = useStudentDetail(item.id, true)
  const data = detailQuery.data ?? item

  useEffect(() => {
    if (detailQuery.isError) {
      toast.error(
        getErrorMessage(detailQuery.error, 'Failed to load student detail.'),
      )
    }
  }, [detailQuery.isError, detailQuery.error])

  if (detailQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-md border border-border px-4">
      <DetailRow label="Identity Number" value={data.user.identity_number} />
      <DetailRow label="Name" value={data.user.name} />
      <DetailRow label="Email" value={data.user.email} />
      <DetailRow label="Phone Number" value={data.user.phone_number || '-'} />
      <DetailRow label="Gender" value={data.gender.label || data.gender.key} />
      <DetailRow label="Address" value={data.address || '-'} />
      <DetailRow label="Status" value={data.status.label || data.status.key} />
      <DetailRow
        label="Created At"
        value={formatDate(data.created_at, DATE_FORMAT.DATE_TIME)}
      />
      <DetailRow
        label="Updated At"
        value={formatDate(data.updated_at, DATE_FORMAT.DATE_TIME)}
      />
    </div>
  )
}

const DIALOG_COPY = {
  create: {
    title: 'Create student',
    description: 'Fill in the data for the new student.',
  },
  edit: {
    title: 'Edit student',
    description: 'Update the data of this student.',
  },
  view: {
    title: 'Student detail',
    description: 'Profile and status of this student.',
  },
  password: {
    title: 'Reset password',
    description: 'Set a new password for this student.',
  },
} as const

export function StudentDialog() {
  const selected = useStudentStore((state) => state.selected)
  const mode = useStudentStore((state) => state.mode)
  const isDialogOpen = useStudentStore((state) => state.isDialogOpen)
  const closeDialog = useStudentStore((state) => state.closeDialog)

  if (!mode) return null
  const copy = DIALOG_COPY[mode]

  return (
    <ResponsiveDialog
      title={copy.title}
      description={copy.description}
      isOpen={isDialogOpen}
      onIsOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      {mode === 'view' && selected ? (
        <StudentDetail key={selected.id} item={selected} />
      ) : mode === 'password' && selected ? (
        <StudentPasswordForm key={selected.id} item={selected} />
      ) : (
        <StudentForm
          key={mode === 'edit' ? selected?.id : 'create'}
          initial={mode === 'edit' ? selected : null}
        />
      )}
    </ResponsiveDialog>
  )
}
