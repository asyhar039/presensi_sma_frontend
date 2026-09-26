import { IconFile, IconUpload, IconX } from '@tabler/icons-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/class-name'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
  disabled?: boolean
}

export function FileUploadDropzone({
  files,
  onFilesChange,
  maxSizeMB = 5,
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const validateFile = (file: File): string | null => {
    if (
      !acceptedTypes.some(
        (type) =>
          file.type === type || file.type.startsWith(type.split('/')[0]),
      )
    ) {
      return `Format file tidak didukung. Hanya ${acceptedTypes.join(', ')}`
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file maksimal ${maxSizeMB}MB`
    }
    return null
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of droppedFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of selectedFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
    }

    e.target.value = ''
  }

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50',
          isDragOver && 'border-primary bg-primary/5',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragOver(false)
        }}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && document.getElementById('file-input')?.click()
        }
      >
        <CardContent className="pt-6">
          <input
            id="file-input"
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <div className="text-center p-6">
            <IconUpload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-1">
              Tarik & lepas file di sini
            </p>
            <p className="text-xs text-muted-foreground">
              atau klik untuk memilih file (Maks. {maxSizeMB}MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border p-3 bg-muted/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <IconFile className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                disabled={disabled}
                aria-label={`Hapus ${file.name}`}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
