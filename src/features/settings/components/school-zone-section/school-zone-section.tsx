import type * as GeoJSON from 'geojson'
import type { MapMouseEvent } from 'maplibre-gl'
import type {
  ISchoolZone,
  SchoolZoneInput,
  SchoolZonePoint,
  SchoolZoneStatusFilter,
} from '@/features/settings/types/school-zone.types'

import {
  IconCheck,
  IconMapPin,
  IconMapPinPlus,
  IconPencil,
  IconRotateClockwise,
} from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import * as v from 'valibot'

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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapGeoJSON,
  MapMarker,
  type MapRef,
  Map as MapView,
  MarkerContent,
} from '@/components/ui/map'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  useCreateSchoolZone,
  useSchoolZones,
  useUpdateSchoolZone,
  useUpdateSchoolZoneStatus,
} from '@/features/settings/hooks/use-settings-zones'
import { schoolZoneSchema } from '@/features/settings/schemas/school-zone.schema'
import { cn } from '@/lib/class-name'

const DEFAULT_CENTER: [number, number] = [109.65, -7.65]

function toPolygon(
  points: SchoolZonePoint[],
): GeoJSON.Feature<GeoJSON.Polygon> | null {
  if (points.length < 3) return null
  const ring = points.map(([lat, lng]) => [lng, lat])
  ring.push([...ring[0]])
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [ring] },
  }
}

function centerOf(points: SchoolZonePoint[]): [number, number] {
  if (points.length === 0) return DEFAULT_CENTER
  return [
    points.reduce((sum, [, lng]) => sum + lng, 0) / points.length,
    points.reduce((sum, [lat]) => sum + lat, 0) / points.length,
  ]
}

type ZoneEditorProps = { initial: ISchoolZone | null; zones: ISchoolZone[] }
type ZoneEditorState = {
  name: string
  points: SchoolZonePoint[]
  isActive: boolean
}

function ZoneEditor({ initial, zones }: ZoneEditorProps) {
  const initialState: ZoneEditorState = initial
    ? {
        name: initial.name,
        points: initial.points,
        isActive: initial.is_active,
      }
    : { name: '', points: [], isActive: true }
  const [state, setState] = useState(initialState)
  const [drawing, setDrawing] = useState(initial === null)
  const [errors, setErrors] = useState<string[]>([])
  const [map, setMap] = useState<MapRef | null>(null)
  const createMutation = useCreateSchoolZone()
  const updateMutation = useUpdateSchoolZone()
  const statusMutation = useUpdateSchoolZoneStatus()
  const pending =
    createMutation.isPending ||
    updateMutation.isPending ||
    statusMutation.isPending
  const dirty =
    initial === null ||
    state.name !== initial.name ||
    state.isActive !== initial.is_active ||
    JSON.stringify(state.points) !== JSON.stringify(initial.points)
  const polygon = useMemo(() => toPolygon(state.points), [state.points])

  useEffect(() => {
    if (!map || !drawing) return
    const onClick = (event: MapMouseEvent) =>
      setState((current) => ({
        ...current,
        points: [...current.points, [event.lngLat.lat, event.lngLat.lng]],
      }))
    map.on('click', onClick)
    map.getCanvas().style.cursor = 'crosshair'
    return () => {
      map.off('click', onClick)
      map.getCanvas().style.cursor = ''
    }
  }, [map, drawing])

  const updatePoint = (index: number, point: SchoolZonePoint) =>
    setState((current) => ({
      ...current,
      points: current.points.map((item, itemIndex) =>
        itemIndex === index ? point : item,
      ),
    }))
  const removePoint = (index: number) =>
    setState((current) => ({
      ...current,
      points: current.points.filter((_, itemIndex) => itemIndex !== index),
    }))
  const insertAfter = (index: number) =>
    setState((current) => {
      const point = current.points[index]
      return {
        ...current,
        points: [
          ...current.points.slice(0, index + 1),
          point,
          ...current.points.slice(index + 1),
        ],
      }
    })

  const save = () => {
    const payload: SchoolZoneInput = {
      name: state.name.trim(),
      points: state.points,
      is_active: state.isActive,
    }
    const parsed = v.safeParse(schoolZoneSchema, payload)
    const messages = parsed.success
      ? []
      : parsed.issues.map((issue) => issue.message)
    const conflict = zones.some(
      (zone) =>
        zone.id !== initial?.id &&
        zone.name.toLowerCase() === payload.name.toLowerCase(),
    )
    if (conflict) messages.push('A zone with this name already exists.')
    setErrors(messages)
    if (messages.length > 0) return
    if (initial === null) createMutation.mutate(payload)
    else updateMutation.mutate({ id: initial.id, payload })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="zone-name">Zone name</Label>
          <Input
            id="zone-name"
            maxLength={32}
            value={state.name}
            onChange={(event) =>
              setState((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="e.g. North campus"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Label htmlFor="zone-active">Active</Label>
          <Switch
            id="zone-active"
            checked={state.isActive}
            disabled={statusMutation.isPending}
            onCheckedChange={(checked) => {
              setState((current) => ({ ...current, isActive: checked }))
              if (initial)
                statusMutation.mutate({ id: initial.id, isActive: checked })
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={drawing ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDrawing((value) => !value)}
        >
          {drawing ? (
            <IconCheck className="size-4" />
          ) : (
            <IconMapPinPlus className="size-4" />
          )}
          {drawing ? 'Drawing' : 'Draw points'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={state.points.length === 0}
          onClick={() =>
            setState((current) => ({
              ...current,
              points: current.points.slice(0, -1),
            }))
          }
        >
          Undo point
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={state.points.length === 0}
          onClick={() => setState((current) => ({ ...current, points: [] }))}
        >
          Clear
        </Button>
        <Badge variant="secondary">{state.points.length} points</Badge>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <MapView
          ref={setMap}
          center={centerOf(state.points)}
          zoom={state.points.length > 0 ? 15 : 12}
          className="h-105 w-full"
        >
          {zones
            .filter((zone) => zone.id !== initial?.id)
            .map((zone) => {
              const zonePolygon = toPolygon(zone.points)
              return zonePolygon ? (
                <MapGeoJSON
                  key={zone.id}
                  id={`zone-${zone.id}`}
                  data={zonePolygon}
                  fillPaint={{ 'fill-color': '#a1a1aa', 'fill-opacity': 0.16 }}
                  linePaint={{ 'line-color': '#71717a', 'line-width': 1.5 }}
                />
              ) : null
            })}
          {polygon && (
            <MapGeoJSON
              id="zone-draft"
              data={polygon}
              fillPaint={{ 'fill-color': '#2563eb', 'fill-opacity': 0.22 }}
              linePaint={{ 'line-color': '#2563eb', 'line-width': 2 }}
            />
          )}
          {state.points.map((point, index) => (
            <MapMarker
              key={`${point[0]}-${point[1]}-${index}`}
              longitude={point[1]}
              latitude={point[0]}
              draggable
              onDragEnd={({ lng, lat }) => updatePoint(index, [lat, lng])}
            >
              <MarkerContent>
                <button
                  type="button"
                  title={`Point ${index + 1}`}
                  onClick={() => removePoint(index)}
                  onDoubleClick={() => insertAfter(index)}
                  className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-primary-foreground shadow-lg"
                >
                  {index + 1}
                </button>
              </MarkerContent>
            </MapMarker>
          ))}
        </MapView>
      </div>
      <p className="text-xs text-muted-foreground">
        Click the map to add points. Drag a pin to adjust it. Double-click a pin
        to duplicate the point next to it; click a pin to remove it.
      </p>
      {errors.length > 0 && (
        <ul className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!dirty || pending}
          onClick={() => {
            setState(initialState)
            setErrors([])
          }}
        >
          <IconRotateClockwise className="size-4" />
          Reset
        </Button>
        <ButtonLoading
          size="sm"
          loading={pending}
          disabled={!dirty}
          onClick={save}
        >
          Save zone
        </ButtonLoading>
      </div>
    </div>
  )
}

export function SchoolZoneSection() {
  const [filter, setFilter] = useState<SchoolZoneStatusFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const query = useSchoolZones(filter)
  const zones = query.data ?? []
  const isCreating =
    selectedId === -1 || (selectedId === null && zones.length === 0)
  const selectedZone = isCreating
    ? null
    : (zones.find((zone) => zone.id === selectedId) ?? zones[0] ?? null)

  if (query.isPending)
    return (
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-[520px]" />
      </div>
    )
  if (query.isError)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconMapPin />
          </EmptyMedia>
          <EmptyTitle>Failed to load school zones</EmptyTitle>
          <EmptyDescription>
            We could not load school zones. Try again.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => query.refetch()}>
          <IconRotateClockwise className="size-4" />
          Retry
        </Button>
      </Empty>
    )

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>School zones</CardTitle>
          <CardDescription>
            {zones.length} zone{zones.length === 1 ? '' : 's'} in this view.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(['all', 'active', 'inactive'] as const).map((item) => (
              <Button
                key={item}
                type="button"
                size="sm"
                variant={filter === item ? 'secondary' : 'ghost'}
                onClick={() => setFilter(item)}
                className="flex-1 capitalize"
              >
                {item}
              </Button>
            ))}
          </div>
          {zones.length === 0 && (
            <Empty className="p-6">
              <EmptyHeader>
                <EmptyTitle>No matching zones</EmptyTitle>
                <EmptyDescription>
                  Change the filter or create a new zone.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => setSelectedId(zone.id)}
              className={cn(
                'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                zone.id === selectedZone?.id
                  ? 'border-primary/40 bg-primary/5 font-medium'
                  : 'border-border hover:bg-muted/60',
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <IconMapPin className="size-4 shrink-0" />
                <span className="truncate">{zone.name}</span>
              </span>
              <Badge variant={zone.is_active ? 'default' : 'outline'}>
                {zone.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setSelectedId(-1)}>
            <IconMapPinPlus className="size-4" />
            New zone
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPencil className="size-4 text-muted-foreground" />
            {isCreating || selectedId === -1
              ? 'Create school zone'
              : (selectedZone?.name ?? 'School zone')}
          </CardTitle>
          <CardDescription>
            Name the zone, then draw at least three boundary points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZoneEditor
            key={selectedZone?.id ?? selectedId ?? 'new'}
            initial={selectedZone}
            zones={zones}
          />
        </CardContent>
      </Card>
    </div>
  )
}
