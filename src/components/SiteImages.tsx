import { useEffect, useMemo, useState } from "react"
import { Images, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DeliveryPoint {
  code: string
  name: string
  delivery: string
  latitude: number
  longitude: number
  descriptions: { key: string; value: string }[]
  markerColor?: string
  qrCodeImageUrl?: string
  qrCodeDestinationUrl?: string
  avatarImageUrl?: string
  avatarImages?: string[]
}

interface RouteRecord {
  id: string
  name: string
  code: string
  shift: string
  color?: string | null
  delivery_points: unknown[]
}

type LocationImagePoint = DeliveryPoint & {
  routeId: string
  routeName: string
  routeCode: string
  routeColor?: string | null
}

function getPointImageUrls(point: DeliveryPoint) {
  const urls = [
    ...(Array.isArray(point.avatarImages) ? point.avatarImages : []),
    point.avatarImageUrl,
  ].filter((url): url is string => !!url?.trim())

  return [...new Set(urls)]
}

function uniq<T>(items: T[]) {
  return Array.from(new Set(items))
}

export function SiteImages() {
  const [points, setPoints] = useState<LocationImagePoint[]>([])
  const [search, setSearch] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/routes")
        const json = (await res.json()) as any
        if (!json?.success || !Array.isArray(json.data)) {
          setPoints([])
          return
        }

        const allPoints: LocationImagePoint[] = json.data.flatMap((route: RouteRecord) => {
          if (!Array.isArray(route.delivery_points)) return []
          return route.delivery_points
            .filter((point): point is DeliveryPoint => point !== null && typeof point === "object")
            .map((point) => ({
              ...point,
              routeId: route.id,
              routeName: route.name,
              routeCode: route.code,
              routeColor: route.color ?? null,
            }))
        })

        const nextPoints = allPoints.filter((point) => getPointImageUrls(point).length > 0)

        setPoints(nextPoints)
      } catch (error) {
        console.error("[SiteImages] Failed to load route images", error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const routeOptions = useMemo(() => {
    return ["all", ...uniq(points.map((point) => point.routeName))]
  }, [points])

  const filteredPoints = useMemo(() => {
    const query = search.trim().toLowerCase()

    return points.filter((point) => {
      if (selectedRoute !== "all" && point.routeName !== selectedRoute) return false
      if (!query) return true
      return [point.name, point.code, point.delivery, point.routeName, point.routeCode]
        .some((field) => field?.toLowerCase().includes(query))
    })
  }, [points, selectedRoute, search])

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Images className="size-4" />
              Site Images
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Showing uploaded avatar images for every location with saved photos. Use search and route filters to find the right site images quickly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-2xl bg-muted/60 px-3 py-2 text-sm font-medium text-foreground">
              {isLoading ? "Loading…" : `${filteredPoints.length} location${filteredPoints.length === 1 ? "" : "s"}`}
            </span>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedRoute("all") }}>
              <X className="size-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-foreground">Route</label>
            <div className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground">
              <select
                value={selectedRoute}
                onChange={(event) => setSelectedRoute(event.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                {routeOptions.map((routeName) => (
                  <option key={routeName} value={routeName}>{routeName === "all" ? "All routes" : routeName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              Use the filters to limit images to a particular route or location name. Only locations that have uploaded avatar images are shown here.
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search location, code, route..."
                className="w-full pl-10"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
          <div className="text-sm font-semibold text-foreground">Image summary</div>
          <div className="mt-3 text-sm text-muted-foreground space-y-2">
            <p>{points.length} total location(s) with uploaded images.</p>
            <p>{routeOptions.length - 1} route(s) have locations with photos.</p>
            <p>Tap a card to review uploaded avatars for each location.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-border bg-card/70 p-6 text-center text-sm text-muted-foreground">Loading site images…</div>
      ) : filteredPoints.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No uploaded location images found for this filter.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredPoints.map((point) => {
            const images = getPointImageUrls(point)

            return (
              <article key={`${point.routeId}-${point.code}`} className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition hover:-translate-y-0.5">
                <div className="p-5 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{point.routeName}</div>
                      <h3 className="text-lg font-semibold text-foreground">{point.name}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="rounded-full bg-muted/60 px-3 py-1">Code: {point.code}</span>
                      <span className="rounded-full bg-muted/60 px-3 py-1">Delivery: {point.delivery}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {images.slice(0, 6).map((url, index) => (
                      <img key={`${url}-${index}`} src={url} alt={`${point.name} image ${index + 1}`} className="h-24 w-full rounded-2xl object-cover" />
                    ))}
                    {images.length > 6 && (
                      <div className="group relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/70 text-center text-sm font-semibold text-muted-foreground">
                        +{images.length - 6} more
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-2xl border border-border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {images.length} photo{images.length === 1 ? "" : "s"}
                    </span>
                    <Button variant="secondary" size="sm" onClick={() => window.open(images[0], "_blank")}>View first image</Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
