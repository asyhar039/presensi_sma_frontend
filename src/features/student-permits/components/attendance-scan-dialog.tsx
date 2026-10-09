import {
  IconCamera,
  IconKeyboard,
  IconLocation,
  IconQrcode,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import jsQR from 'jsqr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ButtonLoading } from '@/components/composite/button-loading'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import { useCameraDevices } from '@/features/student-permits/hooks/use-device-permissions'
import {
  type IGeoPosition,
  useGeolocation,
} from '@/features/student-permits/hooks/use-geolocation'
import { scanPresence } from '@/features/student-permits/services/presence-scan-api'
import { cn } from '@/lib/class-name'
import { getErrorMessage } from '@/utils/error'

type AttendanceScanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttendanceScanDialog({
  open,
  onOpenChange,
}: AttendanceScanDialogProps) {
  const geo = useGeolocation(open)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconQrcode className="size-5" />
            Scan Attendance QR
          </DialogTitle>
          <DialogDescription>
            We need your location first to verify attendance.
          </DialogDescription>
        </DialogHeader>
        {!geo.isReady ? (
          <LocationGate geo={geo} />
        ) : (
          <ScanTabs position={geo.position as IGeoPosition} active={open} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function LocationGate({ geo }: { geo: ReturnType<typeof useGeolocation> }) {
  const requesting = geo.status === 'requesting'
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {requesting ? <Spinner /> : <IconLocation />}
        </EmptyMedia>
        <EmptyTitle>
          {geo.status === 'unsupported'
            ? 'Location is not supported'
            : geo.status === 'denied' || geo.status === 'unavailable'
              ? 'Location permission required'
              : requesting
                ? 'Requesting your location...'
                : 'Location permission required'}
        </EmptyTitle>
        <EmptyDescription>
          {geo.error ??
            (requesting
              ? 'Please allow location access in the browser prompt.'
              : 'Attendance scanning needs your location. Allow access to continue.')}
        </EmptyDescription>
      </EmptyHeader>
      {geo.status !== 'unsupported' && geo.status !== 'requesting' && (
        <Button type="button" onClick={geo.request}>
          <IconLocation className="size-4" />
          {geo.status === 'idle' ? 'Allow Location Access' : 'Try Again'}
        </Button>
      )}
    </Empty>
  )
}

function ScanTabs({
  position,
  active,
}: {
  position: IGeoPosition
  active: boolean
}) {
  const [tab, setTab] = useState('manual')
  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as string)}>
      <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg bg-muted/80 p-1">
        <TabsTab
          value="manual"
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
            'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60',
            tab === 'manual' &&
              'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80 hover:bg-white',
          )}
        >
          <IconKeyboard className="size-4" />
          Manual
        </TabsTab>
        <TabsTab
          value="camera"
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
            'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60',
            tab === 'camera' &&
              'bg-white text-slate-900 font-semibold shadow-sm border border-slate-200/80 hover:bg-white',
          )}
        >
          <IconCamera className="size-4" />
          Camera
        </TabsTab>
      </TabsList>
      <TabsPanel value="manual">
        <ManualPanel position={position} />
      </TabsPanel>
      <TabsPanel value="camera">
        <CameraPanel active={active && tab === 'camera'} position={position} />
      </TabsPanel>
    </Tabs>
  )
}

function ManualPanel({ position }: { position: IGeoPosition }) {
  const [code, setCode] = useState('')
  const scan = useMutation({
    mutationFn: () =>
      scanPresence({
        key: code.trim(),
        latitude: position.latitude,
        longitude: position.longitude,
      }),
    onSuccess: (res) => {
      toast.success(
        res.inside_zone
          ? 'Presence recorded successfully.'
          : 'Presence recorded outside the school zone.',
      )
      setCode('')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  const submit = () => {
    if (!code.trim() || scan.isPending) return
    scan.mutate()
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="qr-code">
          QR Code <span className="text-destructive">*</span>
        </label>
        <Input
          id="qr-code"
          placeholder="Enter the code shown by your teacher..."
          value={code}
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit()
          }}
        />
      </div>
      <ButtonLoading
        type="button"
        className="w-full"
        loading={scan.isPending}
        disabled={!code.trim()}
        onClick={submit}
      >
        Submit Attendance
      </ButtonLoading>
      <p className="text-xs text-muted-foreground">
        Location locked: {position.latitude.toFixed(5)},{' '}
        {position.longitude.toFixed(5)} (±{Math.round(position.accuracy)} m).
      </p>
    </div>
  )
}

function CameraPanel({
  active,
  position,
}: {
  active: boolean
  position: IGeoPosition
}) {
  const camera = useCameraDevices(active)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scanning, setScanning] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)

  // Attach stream to video element when stream is available or video mounts
  useEffect(() => {
    if (!active) {
      setScanning(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      return
    }

    if (camera.status === 'granted' && camera.stream && videoRef.current) {
      if (videoRef.current.srcObject !== camera.stream) {
        videoRef.current.srcObject = camera.stream
        void videoRef.current.play().catch(() => {
          // Autoplay policy or video not ready
        })
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
    if (!scanning) return
    let frame = 0
    const tick = async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const context = canvas.getContext('2d')
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          const image = context.getImageData(0, 0, canvas.width, canvas.height)
          const found = jsQR(image.data, image.width, image.height)
          if (found?.data) {
            setDetected(found.data)
            setScanning(false)
            try {
              const res = await scanPresence({
                key: found.data.trim(),
                latitude: position.latitude,
                longitude: position.longitude,
              })
              toast.success(
                res.inside_zone
                  ? 'Presence recorded successfully.'
                  : 'Presence recorded outside the school zone.',
              )
            } catch (e) {
              toast.error(getErrorMessage(e))
            }
            return
          }
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [scanning, position])

  if (camera.status !== 'granted') {
    return (
      <div className="space-y-3 pt-1">
        <div className="rounded-lg border px-3 py-2.5 text-sm">
          <p className="flex items-center gap-2 font-medium">
            {camera.status === 'denied'
              ? 'Camera access was denied'
              : 'Checking camera devices...'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {camera.status === 'denied'
              ? (camera.error ??
                'Please allow camera access in your browser settings, then retry.')
              : camera.status === 'unsupported'
                ? (camera.error ?? 'This browser cannot access the camera.')
                : 'We are requesting camera permission to list your devices.'}
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
    <div className="space-y-3 pt-1">
      {camera.devices.length > 1 && (
        <div className="space-y-1.5">
          <span className="text-sm font-medium">Camera</span>
          <Select
            value={camera.deviceId}
            onValueChange={(value) => value && void switchCamera(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a camera..." />
            </SelectTrigger>
            <SelectContent>
              {camera.devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        {camera.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 text-center">
            <p className="text-sm text-white">{camera.error}</p>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          setDetected(null)
          setScanning((value) => !value)
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
      {detected && (
        <p className="rounded-lg border bg-muted/50 px-3 py-2 text-sm">
          Detected code: <strong className="break-all">{detected}</strong>
        </p>
      )}
    </div>
  )
}
