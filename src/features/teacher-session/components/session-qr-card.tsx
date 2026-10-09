import type { IPresenceCurrent } from '@/features/teacher-session/types/teacher-session.types'

import { IconPlayerPlay, IconRefresh, IconSquare } from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

import { ButtonLoading } from '@/components/composite/button-loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SessionQrCardProps = {
  session: IPresenceCurrent
  onStart: () => void
  onStop: () => void
  onRefresh: () => void
  starting: boolean
  stopping: boolean
  refreshing: boolean
}

function useCountdown(expiresAt: string | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!expiresAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [expiresAt])
  if (!expiresAt) return null
  const s = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - now) / 1000),
  )
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium">{children}</div>
    </div>
  )
}

export function SessionQrCard({
  session,
  onStart,
  onStop,
  onRefresh,
  starting,
  stopping,
  refreshing,
}: SessionQrCardProps) {
  const countdown = useCountdown(session.qr_expires_at)
  const sched = session.schedule
  const canStart =
    !session.has_session && session.is_within_time && !session.is_stopped
  const liveQr = session.is_started && !session.is_stopped && session.qr_value

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Class QR Code
          {session.is_stopped ? (
            <Badge variant="destructive">Stopped</Badge>
          ) : session.is_started ? (
            <Badge className="bg-green-600">Live</Badge>
          ) : session.has_session ? (
            <Badge variant="secondary">Ready</Badge>
          ) : (
            <Badge variant="outline">Idle</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {sched
            ? `${sched.classroom.name} • ${sched.start_time}–${sched.end_time}`
            : "Today's slot"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sched && (
          <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3">
            <Field label="Teacher">{sched.teacher.name}</Field>
            <Field label="Day">{sched.day}</Field>
            <Field label="Subjects">
              {sched.subjects.map((s) => s.name).join(', ') || '-'}
            </Field>
            <Field label="Time">
              {sched.start_time}–{sched.end_time}
            </Field>
          </div>
        )}
        {liveQr ? (
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-xl border bg-white p-4">
              <QRCodeSVG value={session.qr_value as string} size={200} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={session.qr_expired ? 'destructive' : 'secondary'}>
                Expires in {countdown ?? '--:--'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
              >
                <IconRefresh className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
            <p className="break-all text-center font-mono text-xs text-muted-foreground">
              {session.qr_value}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border-dashed border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {session.is_stopped
                ? 'Session stopped. Starting is blocked for today.'
                : session.is_started
                  ? 'QR unavailable. Refresh to rotate the key.'
                  : 'Start the session to generate the QR code for students to scan.'}
            </p>
            {session.is_started && !session.is_stopped && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
              >
                <IconRefresh className={refreshing ? 'animate-spin' : ''} />
                Refresh QR
              </Button>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          {!session.is_started && !session.is_stopped && (
            <ButtonLoading
              className="flex-1"
              loading={starting}
              disabled={!canStart}
              onClick={onStart}
            >
              <IconPlayerPlay />
              Start Session
            </ButtonLoading>
          )}
          {session.is_started && !session.is_stopped && (
            <ButtonLoading
              className="flex-1"
              variant="destructive"
              loading={stopping}
              onClick={onStop}
            >
              <IconSquare />
              Stop Session
            </ButtonLoading>
          )}
        </div>
        {!session.is_within_time && !session.is_stopped && (
          <p className="text-xs text-muted-foreground">
            Outside the class time window — controls are disabled.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
