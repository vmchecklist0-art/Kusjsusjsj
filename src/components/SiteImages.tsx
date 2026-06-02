import { useEffect, useMemo, useState } from "react"
import { Images, Search, X, ChevronRight } from "lucide-react"
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
  deliveryPoints: unknown[]
}

type LocationImagePoint = DeliveryPoint & {
  routeId: string
  routeName: string
  routeCode: string
  routeColor?: string | null
}

function getPointImageUrls(point: DeliveryPoint): string[] {
  const urls = [
    ...(Array.isArray(point.avatarImages) ? point.avatarImages : []),
    point.avatarImageUrl,
  ].filter((url): url is string => !!url?.trim())
  return [...new Set(urls)]
}

function uniq<T>(items: T[]) {
  return Array.from(new Set(items))
}

function routeGradient(color: string | null | undefined): string {
  if (color && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    return `linear-gradient(135deg, ${color}cc 0%, ${color} 100%)`
  }
  return "linear-gradient(135deg, #374151cc 0%, #374151 100%)"
}

function ImageCard({ point }: { point: LocationImagePoint }) {
  const images = getPointImageUrls(point)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

        {/* Header */}
        <div
          className="px-4 py-3 flex flex-col gap-0.5"
          style={{ background: routeGradient(point.routeColor) }}
        >
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70">
            {point.routeCode}
          </span>
          <h3 className="text-base font-semibold leading-snug text-white truncate">
            {point.name}
          </h3>
          <span className="text-xs text-white/80 truncate">{point.routeName}</span>
        </div>

        {/* Preview image */}
        <div
          className="relative w-full overflow-hidden bg-muted cursor-pointer"
          style={{ height: 220 }}
          onClick={() => openLightbox(activeIndex)}
        >
          <img
            src={images[activeIndex]}
            alt={point.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Photo count badge */}
          {images.length > 1 && (
            <div
              className="absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
              style={{ background: routeGradient(point.routeColor) }}
            >
              {images.length}
            </div>
          )}

          {/* Expand hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
              View full
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto px-3 py-2 bg-muted/40 scrollbar-none">
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 size-12 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                  i === activeIndex
                    ? "border-foreground/60 scale-105"
                    : "border-transparent hover:border-foreground/30"
                }`}
              >
                <img src={url} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border text-sm">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Location</span>
            <span className="font-medium text-foreground truncate">{point.delivery || "—"}</span>
          </div>
          <div className="flex flex-col gap-0.5 items-end shrink-0">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Code</span>
            <span className="font-semibold text-foreground">{point.code}</span>
          </div>
        </div>

        {/* Open all button */}
        <button
          onClick={() => openLightbox(0)}
          className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150 border-t border-border"
        >
          <span>{images.length} photo{images.length === 1 ? "" : "s"}</span>
          <ChevronRight className="size-3.5" />
        </button>
      </article>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full mx-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl font-light leading-none"
            >
              ×
            </button>

            {/* Main image */}
            <div className="overflow-hidden rounded-2xl bg-black">
              <img
                src={images[lightboxIndex]}
                alt={`${point.name} ${lightboxIndex + 1}`}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Lightbox thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto justify-center pb-1 scrollbar-none">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`shrink-0 size-14 overflow-hidden rounded-lg border-2 transition-all ${
                      i === lightboxIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img src={url} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Caption */}
            <div className="text-center text-white/80 text-sm">
              {point.name} — {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
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
          if (!Array.isArray(route.deliveryPoints)) return []
          return route.deliveryPoints
            .filter((point): point is DeliveryPoint => point !== null && typeof point === "object")
            .map((point) => ({
              ...point,
              routeId: route.id,
              routeName: route.name,
              routeCode: route.code,
              routeColor: route.color ?? null,
            }))
        })

        setPoints(allPoints.filter((p) => getPointImageUrls(p).length > 0))
      } catch (error) {
        console.error("[SiteImages] Failed to load route images", error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const routeOptions = useMemo(
    () => ["all", ...uniq(points.map((p) => p.routeName))],
    [points]
  )

  const filteredPoints = useMemo(() => {
    const q = search.trim().toLowerCase()
    return points.filter((p) => {
      if (selectedRoute !== "all" && p.routeName !== selectedRoute) return false
      if (!q) return true
      return [p.name, p.code, p.delivery, p.routeName, p.routeCode].some(
        (f) => f?.toLowerCase().includes(q)
      )
    })
  }, [points, selectedRoute, search])

  const totalPhotos = filteredPoints.reduce((sum, p) => sum + getPointImageUrls(p).length, 0)

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-2">
            <Images className="size-3.5" />
            Site Images
          </div>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Uploaded avatar photos for every location. Filter by route or search by name.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-2xl bg-muted/70 px-3 py-1.5 font-medium text-foreground">
            {isLoading ? "Loading…" : `${filteredPoints.length} location${filteredPoints.length === 1 ? "" : "s"}`}
          </span>
          {!isLoading && (
            <span className="rounded-2xl bg-muted/70 px-3 py-1.5 font-medium text-foreground">
              {totalPhotos} photo{totalPhotos === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location, code, route…"
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="rounded-xl border border-border bg-background px-3 h-9 flex items-center">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-transparent text-sm outline-none text-foreground"
          >
            {routeOptions.map((r) => (
              <option key={r} value={r}>{r === "all" ? "All routes" : r}</option>
            ))}
          </select>
        </div>

        {(search || selectedRoute !== "all") && (
          <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground" onClick={() => { setSearch(""); setSelectedRoute("all") }}>
            <X className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-muted h-80" />
          ))}
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
          <Images className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No location images found for this filter.</p>
          {(search || selectedRoute !== "all") && (
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setSelectedRoute("all") }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPoints.map((point) => (
            <ImageCard key={`${point.routeId}-${point.code}`} point={point} />
          ))}
        </div>
      )}
    </div>
  )
}
