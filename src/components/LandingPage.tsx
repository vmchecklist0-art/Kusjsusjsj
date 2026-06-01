import { useState, useEffect } from "react"
import { ArrowRight, CalendarDays, MapPin, Package, Layers, Users, Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Route Calendar",
    description: "Plan and track daily delivery routes with colour-coded schedules.",
    color: "theme-accent-blue",
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Log delivery locations and manage stop records efficiently.",
    color: "theme-accent-emerald",
  },
  {
    icon: Package,
    title: "VM Management",
    description: "Monitor vending machine stock, planograms, and movements.",
    color: "theme-accent-orange",
  },
  {
    icon: Users,
    title: "Rooster",
    description: "View shift schedules in weekly or monthly calendar view.",
    color: "theme-accent-violet",
  },
  {
    icon: Layers,
    title: "Gallery",
    description: "Store and browse VM photo albums organised by album.",
    color: "theme-accent-pink",
  },
]

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const { mode, toggleMode } = useTheme()
  const isDark = mode === "dark"

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 450)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto transition-opacity duration-300 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Exit overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-400 ease-in-out ${exiting ? "opacity-100" : "opacity-0"}`}
      />

      {/* Background */}
      <div className="absolute inset-0 bg-[hsl(var(--background))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_-10%,hsl(var(--accent)/0.5),transparent_50%),radial-gradient(ellipse_60%_50%_at_80%_100%,hsl(var(--accent)/0.4),transparent_50%)]" />

      {/* Theme toggle */}
      <div className="relative z-10 flex justify-end px-5 sm:px-8 pt-5">
        <Button
          onClick={toggleMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          size="sm"
          variant="ghost"
          className="p-2 hover:opacity-80 transition-opacity active:scale-[0.94]"
        >
          {isDark ? <Sun className="size-5 text-foreground/80" /> : <Moon className="size-5 text-foreground/60" />}
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start sm:justify-center min-h-[calc(100%-3rem)] px-5 sm:px-8 pt-10 pb-20 sm:py-20">
        {/* Hero Section */}
        <div className="w-full max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">


          {/* Main Title */}
          <h1
            className={`mx-auto max-w-[20ch] px-2 text-[clamp(1rem,4vw,1.4rem)] font-bold tracking-tight [text-wrap:balance] text-foreground transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: visible ? "120ms" : "0ms" }}
          >
            Delivery{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-nowrap">
              Operations
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed text-muted-foreground transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: visible ? "180ms" : "0ms" }}
          >
            Streamline your delivery routes, track locations, and manage operations with a single powerful tool.
          </p>

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: visible ? "240ms" : "0ms" }}
          >
            <Button
              onClick={handleEnter}
              className="group relative inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 py-2.5 font-medium shadow-sm transition-all duration-200 active:scale-[0.97]"
            >
              <span>Get Started</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </div>

          {/* Features Grid — each card animates in with a staggered delay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-10 sm:mt-14">
            {FEATURES.map(({ icon: Icon, title, description, color }, index) => (
              <div
                key={title}
                className={`transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: visible ? `${300 + index * 80}ms` : "0ms" }}
              >
                <Card className="group relative cursor-default gap-0 rounded-2xl border border-border/60 bg-card py-4 sm:py-5 hover:scale-[1.02] hover:border-border/90 hover:shadow-md transition-all duration-300 h-full">
                  <CardHeader className="mb-3 px-4 sm:px-5">
                    <CardTitle className="flex items-center gap-2.5 text-sm leading-none text-foreground">
                      <span className={`${color} rounded-xl bg-foreground/[0.04] dark:bg-foreground/[0.06] p-2`}>
                        <Icon className="size-4" />
                      </span>
                      <span>{title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="px-4 text-left text-xs leading-relaxed sm:px-5 text-muted-foreground">{description}</CardDescription>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
