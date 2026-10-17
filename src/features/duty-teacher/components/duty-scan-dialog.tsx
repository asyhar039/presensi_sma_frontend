import type { DutyDecision } from '@/features/duty-teacher/types/duty-teacher.types'

import { IconQrcode } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import jsQR from 'jsqr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ButtonLoading } from '@/components/composite/button-loading'
import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { dutyKeys } from '@/features/duty-teacher/lib/duty-teacher-query-options'
import { decideDutyLeaveRequestByKey } from '@/features/duty-teacher/services/duty-teacher-api'
import { useCameraDevices } from '@/features/student-permits/hooks/use-device-permissions'
import { getErrorMessage } from '@/utils/error'

interface DutyScanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CameraPanelProps {
  active: boolean
  onDetected: (key: string) => void
}

interface DecisionFormProps {
  requestKey: string
  onKeyChange: (key: string) => void
  onDecided: () => void
}

export function DutyScanDialog({ open, onOpenChange }: DutyScanDialogProps) {
  const [requestKey, setRequestKey] = useState('')

  const handleClose = (next: boolean) => {
    if (!next) setRequestKey('')
    onOpenChange(next)
  }

  return (
    <ResponsiveDialog
      title="Scan early-out request"
      description="Point the camera at the student's QR code, then approve or reject."
      isOpen={open}
      onIsOpenChange={handleClose}
    >
      <div className="space-y-4 px-4 pb-4 md:px-0 md:pb-0">
        <CameraPanel active={open} onDetected={setRequestKey} />
        <DecisionForm
          requestKey={requestKey}
          onKeyChange={setRequestKey}
          onDecided={() => handleClose(false)}
        />
      </div>
    </ResponsiveDialog>
  )
}

function CameraPanel({ active, onDetected }: CameraPanelProps) {
  const camera = useCameraDevices(active)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scanning, setScanning] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)
  const detectedRef = useRef(false)

  useEffect(() => {
    if (!active) {
      setScanning(false)
      if (videoRef.current) videoRef.current.srcObject = null
      return
    }
    if (camera.status === 'granted' && camera.stream && videoRef.current) {
      if (videoRef.current.srcObject !== camera.stream) {
        videoRef.current.srcObject = camera.stream
        void videoRef.current.play().catch(() => {})
      }
      setScanning(true)
    }
  }, [active, camera.status, camera.stream])

  const switchCamera = useCallback(
    async (nextId: string) => {
      camera.setDeviceId(nextId)
      const stream = await camera.request(nextId)
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream
        void videoRef.current.play().catch(() => {})
      }
      setScanning(true)
    },
    [camera],
  )

  useEffect(() => {
    detectedRef.current = false
    setDetected(null)
  }, [active])

  useEffect(() => {
    if (!scanning) return
    let frame = 0
    const tick = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const found = jsQR(image.data, image.width, image.height)
          if (found?.data && !detectedRef.current) {
            detectedRef.current = true
            const value = found.data.trim()
            setDetected(value)
            setScanning(false)
            onDetected(value)
            toast.success('QR code detected.')
            return
          }
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [scanning, onDetected])

  if (camera.status !== 'granted') {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border px-3 py-2.5 text-sm">
          <p className="font-medium">
            {camera.status === 'denied'
              ? 'Camera access was denied'
              : 'Checking camera devices...'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {camera.error ??
              'We are requesting camera permission to list your devices.'}
          </p>
        </div>
        {camera.status === 'denied' || camera.status === 'unsupported' ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => void camera.request(camera.deviceId || undefined)}
          >
            Retry Camera Access
          </Button>
        ) : (
          <Skeleton className="h-56 w-full" />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {camera.devices.length > 1 && (
        <Select
          value={camera.deviceId}
          onValueChange={(v) => v && void switchCamera(v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a camera..." />
          </SelectTrigger>
          <SelectContent>
            {camera.devices.map((d) => (
              <SelectItem key={d.deviceId} value={d.deviceId}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="relative overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-56 w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          detectedRef.current = false
          setDetected(null)
          setScanning((v) => !v)
        }}
      >
        {scanning
          ? 'Stop Scanning'
          : detected
            ? 'Scan Again'
            : 'Start Scanning'}
      </Button>
      {scanning && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          Point the camera at the QR code...
        </div>
      )}
    </div>
  )
}

function DecisionForm({
  requestKey,
  onKeyChange,
  onDecided,
}: DecisionFormProps) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState('')

  const decide = useMutation({
    mutationFn: (decision: DutyDecision) =>
      decideDutyLeaveRequestByKey(requestKey.trim(), {
        decision,
        notes: notes.trim() ? notes.trim().slice(0, 255) : undefined,
      }),
    onSuccess: (_d, decision) => {
      toast.success(
        decision === 'approved' ? 'Request approved.' : 'Request rejected.',
      )
      queryClient.invalidateQueries({ queryKey: dutyKeys.lists() })
      setNotes('')
      onDecided()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return (
    <div className="space-y-3 border-t pt-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <IconQrcode className="size-4" />
        Scanned request
      </div>
      <Input
        placeholder="Request key from QR code..."
        value={requestKey}
        onChange={(e) => onKeyChange(e.target.value)}
      />
      <Textarea
        placeholder="Decision notes (optional, max 255 chars)"
        maxLength={255}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ButtonLoading
          variant="destructive"
          loading={decide.isPending && decide.variables === 'rejected'}
          disabled={!requestKey.trim()}
          onClick={() => decide.mutate('rejected')}
        >
          Reject
        </ButtonLoading>
        <ButtonLoading
          loading={decide.isPending && decide.variables === 'approved'}
          disabled={!requestKey.trim()}
          onClick={() => decide.mutate('approved')}
        >
          Approve
        </ButtonLoading>
      </div>
      {!requestKey.trim() && (
        <p className="text-xs text-muted-foreground">
          Scan a QR code or type the request key to enable decisions.
        </p>
      )}
    </div>
  )
}
