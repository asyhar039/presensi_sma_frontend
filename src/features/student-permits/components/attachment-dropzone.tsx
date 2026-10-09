import { IconCloudUpload, IconFile, IconX } from '@tabler/icons-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/class-name'

const MAX_SIZE_BYTES = 2 * 1024 * 1024

type AttachmentDropzoneProps = {
  file: File | null
  onChange: (file: File | null) => void
  externalError?: string | null
  disabled?: boolean
}

function formatSize(bytes: number): string {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`
}

export function AttachmentDropzone({
  file,
  onChange,
  externalError,
  disabled,
}: AttachmentDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onChange(accepted[0])
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'application/pdf': ['.pdf'],
      },
      maxSize: MAX_SIZE_BYTES,
      multiple: false,
      disabled,
    })

  const rejectionMessage =
    fileRejections[0]?.errors[0]?.code === 'file-too-large'
      ? 'Maximum file size is 2 MB.'
      : (fileRejections[0]?.errors[0]?.message ?? null)
  const message = externalError ?? rejectionMessage

  return (
    <Field>
      <FieldLabel>Attachment</FieldLabel>
      <div
        {...getRootProps()}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-6 text-center outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-input hover:border-primary/50',
          disabled && 'cursor-not-allowed opacity-60',
          message && 'border-destructive',
        )}
      >
        <input {...getInputProps()} />
        <IconCloudUpload className="mb-1 size-8 text-muted-foreground" />
        <span className="text-sm font-medium">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag & drop a file here or click to browse'}
        </span>
        <span className="text-xs text-muted-foreground">
          JPG, PNG, or PDF up to 2 MB
        </span>
      </div>
      {file && (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <IconFile className="size-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
            onClick={(event) => {
              event.stopPropagation()
              onChange(null)
            }}
          >
            <IconX className="size-4" />
          </Button>
        </div>
      )}
      {message ? (
        <p className="text-sm text-destructive">{message}</p>
      ) : (
        <FieldDescription>Optional supporting document.</FieldDescription>
      )}
    </Field>
  )
}
