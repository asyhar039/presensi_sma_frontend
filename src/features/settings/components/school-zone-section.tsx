import type * as GeoJSON from 'geojson'
import type { MapMouseEvent } from 'maplibre-gl'
import type {
  ISchoolZone,
  SchoolZonePoint,
} from '@/features/settings/types/settings.types'

import {
  IconCheck,
  IconMapPin,
  IconMapPinPlus,
  IconPencil,
  IconRotateClockwise,
  IconTrash,
} from '@tabler/icons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
import {
  useDeleteSchoolZone,
  useSaveSchoolZones,
  useSchoolZones,
} from '@/features/settings/hooks/use-settings-zones'
import { schoolZoneSchema } from '@/features/settings/schemas/settings-schema'
import { cn } from '@/lib/class-name'
import { useConfirmationStore } from '@/stores/confirmation-store'

const DEFAULT_CENTER: [number, number] = [109.65, -7.65]
const NEW_ZONE_KEY = '__new__'

function toPolygonFeature(
  points: SchoolZonePoint[],
  properties: GeoJSON.GeoJsonProperties = {},
): GeoJSON.Feature<GeoJSON.Polygon> | null {
  if (points.length < 3) return null
  const ring = points.map(([lat, lng]) => [lng, lat])
  ring.push([...ring[0]])
  return {
    type: 'Feature',
    properties,
    geometry: { type: 'Polygon', coordinates: [ring] },
  }
}

function centerOf(points: SchoolZonePoint[]): [number, number] {
  if (points.length === 0) return DEFAULT_CENTER
  const lat =
    points.reduce((sum, [pointLat]) => sum + pointLat, 0) / points.length
  const lng =
    points.reduce((sum, [, pointLng]) => sum + pointLng, 0) / points.length
  return [lng, lat]
}

function ZoneEditor({
  initial,
  originalName,
  others,
}: {
  initial: ISchoolZone
  originalName: string | null
  others: ISchoolZone[]
}) {
  const saveMutation = useSaveSchoolZones()
  const deleteMutation = useDeleteSchoolZone()
  const showConfirmation = useConfirmationStore((state) => state.show)

  const [name, setName] = useState(initial.name)
  const [points, setPoints] = useState<SchoolZonePoint[]>(initial.points)
  const [drawing, setDrawing] = useState(initial.points.length < 3)
  const [errors, setErrors] = useState<string[]>([])
  const [mapInstance, setMapInstance] = useState<MapRef | null>(null)

  const isDirty = useMemo(
    () =>
      name.trim() !== initial.name ||
      JSON.stringify(points) !== JSON.stringify(initial.points),
    [name, points, initial],
  )

  const addPoint = useCallback((point: SchoolZonePoint) => {
    setPoints((previous) => [
      ...previous,
      [Number(point[0].toFixed(6)), Number(point[1].toFixed(6))],
    ])
  }, [])

  useEffect(() => {
    if (!mapInstance || !drawing) return
    const handleClick = (event: MapMouseEvent) => {
      addPoint([event.lngLat.lat, event.lngLat.lng])
    }
    mapInstance.on('click', handleClick)
    mapInstance.getCanvas().style.cursor = 'crosshair'
    return () => {
      mapInstance.off('click', handleClick)
      mapInstance.getCanvas().style.cursor = ''
    }
  }, [mapInstance, drawing, addPoint])

  const movePoint = useCallback((index: number, point: SchoolZonePoint) => {
    setPoints((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? [Number(point[0].toFixed(6)), Number(point[1].toFixed(6))]
          : item,
      ),
    )
  }, [])

  const removePoint = (index: number) => {
    setPoints((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const draftPolygon = useMemo(() => toPolygonFeature(points), [points])
  const mapCenter = useMemo(
    () => centerOf(points.length > 0 ? points : initial.points),
    [points, initial.points],
  )

  const otherPolygons = useMemo(
    () =>
      others
        .map((zone) => ({
          zone,
          feature: toPolygonFeature(zone.points, { name: zone.name }),
        }))
        .filter(
          (
            item,
          ): item is {
            zone: ISchoolZone
            feature: GeoJSON.Feature<GeoJSON.Polygon>
          } => item.feature !== null,
        ),
    [others],
  )

  const validate = (candidate: ISchoolZone): string[] => {
    const messages: string[] = []
    const parsed = v.safeParse(schoolZoneSchema, candidate)
    if (!parsed.success) {
      for (const issue of parsed.issues) {
        if (issue.message) messages.push(issue.message)
      }
    }
    const conflict = others.some(
      (zone) =>
        zone.name.trim().toLowerCase() === candidate.name.trim().toLowerCase(),
    )
    if (conflict) messages.push('Another zone already uses this name.')
    return [...new Set(messages)]
  }

  const handleSave = async () => {
    const candidate: ISchoolZone = { name: name.trim(), points }
    const messages = validate(candidate)
    setErrors(messages)
    if (messages.length > 0 || saveMutation.isPending) return
    const next =
      originalName === null
        ? [...others, candidate]
        : others.filter((zone) => zone.name !== originalName).concat(candidate)
    await saveMutation.mutateAsync(next)
    setErrors([])
  }

  const handleDelete = () => {
    if (!originalName) return
    showConfirmation({
      title: 'Delete school zone?',
      description: `"${originalName}" and its ${initial.points.length} boundary points will be removed.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        try {
          loading(true)
          await deleteMutation.mutateAsync(originalName)
          close()
        } finally {
          loading(false)
        }
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zone-name">Zone name</Label>
          <Input
            id="zone-name"
            placeholder="e.g. Zona Utama"
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={drawing ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDrawing((previous) => !previous)}
          >
            {drawing ? (
              <IconCheck className="size-4" />
            ) : (
              <IconMapPinPlus className="size-4" />
            )}
            {drawing ? 'Drawing…' : 'Draw points'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={points.length === 0}
            onClick={() => setPoints((previous) => previous.slice(0, -1))}
          >
            Undo point
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={points.length === 0}
            onClick={() => setPoints([])}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <MapView
          ref={setMapInstance}
          center={mapCenter}
          zoom={points.length > 0 || initial.points.length > 0 ? 15 : 12}
          className="h-105 w-full"
        >
          {otherPolygons.map(({ zone, feature }) => (
            <MapGeoJSON
              key={zone.name}
              id={`zone-context-${zone.name}`}
              data={feature}
              fillPaint={{ 'fill-color': '#a1a1aa', 'fill-opacity': 0.18 }}
              linePaint={{ 'line-color': '#71717a', 'line-width': 1.5 }}
            />
          ))}
          {draftPolygon && (
            <MapGeoJSON
              id="zone-draft"
              data={draftPolygon}
              fillPaint={{ 'fill-color': '#3b82f6', 'fill-opacity': 0.22 }}
              linePaint={{ 'line-color': '#2563eb', 'line-width': 2 }}
            />
          )}
          {points.map((point, index) => (
            <MapMarker
              key={`${point[0]}-${point[1]}-${index}`}
              longitude={point[1]}
              latitude={point[0]}
              draggable
              onDragEnd={({ lng, lat }) => movePoint(index, [lat, lng])}
            >
              <MarkerContent>
                <button
                  type="button"
                  title={`Point ${index + 1}: ${point[0]}, ${point[1]}`}
                  onClick={() => removePoint(index)}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-primary text-[11px] font-bold text-primary-foreground shadow-lg transition-transform hover:scale-110"
                >
                  {index + 1}
                </button>
              </MarkerContent>
            </MapMarker>
          ))}
        </MapView>
      </div>
      <p className="text-xs text-muted-foreground">
        {drawing
          ? 'Click anywhere on the map to add a boundary point. Drag a numbered pin to adjust it, or click a pin to remove it.'
          : 'Enable “Draw points” to add boundary points by clicking the map. Drag pins to fine-tune the shape.'}
      </p>

      {points.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {points.map((point, index) => (
            <Badge key={`${point[0]}-${point[1]}-${index}`} variant="outline">
              {index + 1}. {point[0]}, {point[1]}
            </Badge>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {originalName ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <IconTrash className="size-4" />
              Delete zone
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              New zones need at least 3 boundary points.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isDirty || saveMutation.isPending}
            onClick={() => {
              setName(initial.name)
              setPoints(initial.points)
              setErrors([])
            }}
          >
            <IconRotateClockwise className="size-4" />
            Reset
          </Button>
          <ButtonLoading
            size="sm"
            loading={saveMutation.isPending}
            disabled={!isDirty}
            onClick={handleSave}
          >
            Save zone
          </ButtonLoading>
        </div>
      </div>
    </div>
  )
}

export function SchoolZoneSection() {
  const zonesQuery = useSchoolZones()
  const [selected, setSelected] = useState<string | null>(null)

  const zones = useMemo(() => zonesQuery.data ?? [], [zonesQuery.data])

  const activeKey = selected ?? zones[0]?.name ?? null
  const activeZone = zones.find((zone) => zone.name === activeKey) ?? null
  const editorKey = activeKey ?? NEW_ZONE_KEY
  const isCreating =
    selected === NEW_ZONE_KEY || (activeKey === null && !zonesQuery.isPending)

  if (zonesQuery.isPending) {
    return (
      <div className="grid items-start gap-4 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-130 w-full" />
      </div>
    )
  }

  if (zonesQuery.isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconMapPin />
          </EmptyMedia>
          <EmptyTitle>Failed to load school zones</EmptyTitle>
          <EmptyDescription>
            We could not load the school zones. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => zonesQuery.refetch()}>
          <IconRotateClockwise className="size-4" />
          Retry
        </Button>
      </Empty>
    )
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[280px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>School zones</CardTitle>
          <CardDescription>
            {zones.length === 0
              ? 'No zones yet.'
              : `${zones.length} zone${zones.length > 1 ? 's' : ''} defined.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {zones.map((zone) => {
            const isActive = zone.name === activeKey
            return (
              <button
                key={zone.name}
                type="button"
                onClick={() => setSelected(zone.name)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'border-primary/40 bg-primary/5 font-medium'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <IconMapPin className="size-4 shrink-0" />
                  <span className="truncate">{zone.name}</span>
                </span>
                <Badge variant="outline" className="shrink-0">
                  {zone.points.length} pts
                </Badge>
              </button>
            )
          })}
          <Button
            variant={isCreating ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelected(NEW_ZONE_KEY)}
          >
            <IconMapPinPlus className="size-4" />
            New zone
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPencil className="size-4 text-muted-foreground" />
            {isCreating
              ? 'Create school zone'
              : (activeZone?.name ?? 'School zone')}
          </CardTitle>
          <CardDescription>
            {isCreating
              ? 'Name the zone, then click the map to draw at least 3 boundary points.'
              : 'Adjust the name or reshape the boundary, then save.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ZoneEditor
            key={editorKey}
            initial={
              isCreating || !activeZone
                ? { name: '', points: [] }
                : { name: activeZone.name, points: [...activeZone.points] }
            }
            originalName={isCreating ? null : (activeZone?.name ?? null)}
            others={
              isCreating || !activeZone
                ? zones
                : zones.filter((zone) => zone.name !== activeZone.name)
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
