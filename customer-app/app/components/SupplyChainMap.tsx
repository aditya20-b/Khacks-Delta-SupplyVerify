"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Map, { Source, Layer, Marker, Popup, type ViewState, MapRef } from "react-map-gl"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { getRoute } from "../utils/mapbox-utils"
import type { PackageLocation, RouteSegment } from "../types/supply-chain"
import { Package, Truck, Plane, Ship, Circle } from "lucide-react"
// @ts-ignore
import type GeoJSON from "geojson"
import * as turf from "@turf/turf"
import { TimelineControl } from "./TimelineControl"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { LoadingSplash } from "./LoadingSplash"
import { AnimatePresence } from "framer-motion"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const packageLocations: PackageLocation[] = [
  {
    id: 1,
    name: "Manufacturer",
    coordinates: [72.8777, 19.076],
    type: "start",
    timestamp: new Date("2023-05-01T09:00:00Z"),
  },
  {
    id: 2,
    name: "Port of Mumbai",
    coordinates: [72.8579, 18.945],
    type: "port",
    timestamp: new Date("2023-05-01T14:30:00Z"),
  },
  {
    id: 3,
    name: "Port of Chennai",
    coordinates: [80.2707, 13.0827],
    type: "port",
    timestamp: new Date("2023-05-03T10:15:00Z"),
  },
  {
    id: 4,
    name: "Delhi Airport",
    coordinates: [77.1025, 28.5562],
    type: "airport",
    timestamp: new Date("2023-05-04T08:45:00Z"),
  },
  {
    id: 5,
    name: "Distribution Center",
    coordinates: [88.3639, 22.5726],
    type: "warehouse",
    timestamp: new Date("2023-05-05T16:20:00Z"),
  },
  {
    id: 6,
    name: "Final Destination",
    coordinates: [77.5946, 12.9716],
    type: "end",
    timestamp: new Date("2023-05-06T11:00:00Z"),
  },
]

const routeSegments: RouteSegment[] = [
  { start: 1, end: 2, type: "road" },
  { start: 2, end: 3, type: "sea" },
  { start: 3, end: 4, type: "road" },
  { start: 4, end: 5, type: "air" },
  { start: 5, end: 6, type: "road" },
]

const ANIMATION_SPEED = 1000 * 60 * 0.2 // 2.5 minutes of real time = 1 second of animation
const TOTAL_DURATION =
  packageLocations[packageLocations.length - 1].timestamp.getTime() - packageLocations[0].timestamp.getTime()

function WaypointSheet({ 
  isOpen, 
  onClose, 
  selectedLocation, 
  allLocations,
  onLocationSelect,
}: { 
  isOpen: boolean
  onClose: () => void
  selectedLocation: PackageLocation | null
  allLocations: PackageLocation[]
  onLocationSelect: (location: PackageLocation) => void
}) {
  if (!selectedLocation) return null

  const getSegmentIcon = (fromType: string, toType: string) => {
    if (fromType === "port" && toType === "port") return <Ship className="w-4 h-4 text-blue-400" />
    if (toType === "airport" || fromType === "airport") return <Plane className="w-4 h-4 text-purple-400" />
    return <Truck className="w-4 h-4 text-yellow-400" />
  }

  const getTimeDifference = (from: Date, to: Date) => {
    const diff = to.getTime() - from.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose()}>
      <SheetContent 
        side="bottom" 
        className="h-[70vh] bg-black/95 border-t border-white/10 px-6"
      >
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white/90 text-xl">
            Journey Details: {selectedLocation.name}
          </SheetTitle>
          <p className="text-white/60 text-sm">
            Showing complete supply chain route with current waypoint details
          </p>
        </SheetHeader>
        <div className="mt-8 pr-4 overflow-y-auto max-h-[calc(70vh-120px)]">
          <div className="space-y-8">
            {allLocations.map((location, index) => {
              const isSelected = location.id === selectedLocation.id
              const isPast = location.timestamp <= selectedLocation.timestamp
              const nextLocation = index < allLocations.length - 1 ? allLocations[index + 1] : null

              return (
                <div key={location.id} className="relative group">
                  {/* Vertical line connecting timeline points */}
                  {index < allLocations.length - 1 && (
                    <div 
                      className={`absolute left-[11px] top-6 w-0.5 h-64 transition-all duration-200
                        ${isPast ? 'bg-neutral-300' : 'bg-neutral-500'}
                        ${isSelected ? 'bg-white/70' : ''}`}
                    />
                  )}
                  
                  {/* Timeline point and content */}
                  <div 
                    className={`flex items-start space-x-4 cursor-pointer transition-all duration-200
                      ${isSelected ? 'scale-102' : 'hover:scale-101'}`}
                    onClick={() => onLocationSelect(location)}
                  >
                    <div className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                      ${isSelected ? 'bg-white shadow-glow' : isPast ? 'bg-white/40' : 'bg-white/10'}
                      group-hover:scale-110`}>
                      <Circle className={`w-3 h-3 transition-all duration-200 ${
                        isSelected ? 'text-black' : 'text-white/70'
                      }`} />
                    </div>

                    <div className={`flex-grow transition-all duration-200 ${
                      isSelected 
                        ? 'bg-white/10 p-6 rounded-xl border border-white/20 shadow-xl' 
                        : 'p-2 group-hover:bg-white/5 rounded-lg'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium text-lg transition-all duration-200 ${
                          isSelected ? 'text-white' : 'text-white/70'
                        }`}>
                          {location.name}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 ${
                          location.type === 'start' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          location.type === 'end' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          location.type === 'port' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          location.type === 'airport' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {location.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-white/60">
                          <span className="inline-block w-20 text-white/40">Arrival:</span>
                          {location.timestamp.toLocaleString()}
                        </p>
                        <p className="text-sm font-mono text-white/60">
                          <span className="inline-block w-20 text-white/40">Location:</span>
                          {location.coordinates[0].toFixed(4)}°, {location.coordinates[1].toFixed(4)}°
                        </p>
                      </div>

                      {nextLocation && (
                        <div className={`mt-4 transition-all duration-200 ${
                          isSelected ? 'opacity-100 scale-102' : 'opacity-80 hover:opacity-100 hover:scale-101'
                        }`}>
                          <div className="flex items-center space-x-2 text-white/40 text-sm mb-2">
                            <div className="h-px flex-grow bg-white/20"></div>
                            <span>Next Stop</span>
                            <div className="h-px flex-grow bg-white/20"></div>
                          </div>
                          <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              {getSegmentIcon(location.type, nextLocation.type)}
                              <div>
                                <p className="text-white/90 text-sm font-medium">{nextLocation.name}</p>
                                <p className="text-white/50 text-xs">
                                  {getTimeDifference(location.timestamp, nextLocation.timestamp)} transit time
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              nextLocation.type === 'start' ? 'bg-green-500/10 text-green-300' :
                              nextLocation.type === 'end' ? 'bg-red-500/10 text-red-300' :
                              nextLocation.type === 'port' ? 'bg-blue-500/10 text-blue-300' :
                              nextLocation.type === 'airport' ? 'bg-purple-500/10 text-purple-300' :
                              'bg-yellow-500/10 text-yellow-300'
                            }`}>
                              {nextLocation.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ProductSheet({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Sheet open={isOpen} onOpenChange={() => onClose()}>
      <SheetContent 
        side="bottom" 
        className="h-[70vh] bg-black/95 border-t border-white/10 px-6"
      >
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white/90 text-xl">
            Product Information
          </SheetTitle>
          <p className="text-white/60 text-sm">
            Detailed information about the product and its specifications
          </p>
        </SheetHeader>
        <div className="mt-8 pr-4 overflow-y-auto max-h-[calc(70vh-120px)]">
          <div className="space-y-8">
            {/* Product Overview */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-white/90 text-lg font-medium mb-4">Product Overview</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-white/40 text-sm mb-1">Product ID</p>
                  <p className="text-white/90 font-mono">PRD-2024-0123</p>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">Category</p>
                  <p className="text-white/90">Electronics</p>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">Manufacturer</p>
                  <p className="text-white/90">TechCorp Industries</p>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1">Production Date</p>
                  <p className="text-white/90">2024-01-15</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-white/90 text-lg font-medium mb-4">Specifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Dimensions</span>
                  <span className="text-white/90">30cm × 20cm × 10cm</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Weight</span>
                  <span className="text-white/90">2.5 kg</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Package Type</span>
                  <span className="text-white/90">Double-wall corrugated box</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/60">Special Handling</span>
                  <span className="text-white/90">Fragile, Keep Dry</span>
                </div>
              </div>
            </div>

            {/* Shipping Requirements */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-white/90 text-lg font-medium mb-4">Shipping Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-yellow-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Temperature Control</p>
                    <p className="text-white/60 text-sm mt-1">Maintain between 10°C - 30°C</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Humidity Control</p>
                    <p className="text-white/60 text-sm mt-1">Maximum 60% relative humidity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-purple-500/10 rounded-lg">
                    <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">Security Requirements</p>
                    <p className="text-white/60 text-sm mt-1">Tamper-evident seals required</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <h3 className="text-white/90 text-lg font-medium mb-4">Certifications & Compliance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 bg-green-500/10 text-green-300 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">ISO 9001:2015</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-500/10 text-blue-300 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">CE Certified</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-500/10 text-yellow-300 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">RoHS Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-500/10 text-purple-300 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">REACH Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default function SupplyChainMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    bearing: 0,
    pitch: 45,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })
  const [popupInfo, setPopupInfo] = useState<PackageLocation | null>(null)
  const [routes, setRoutes] = useState<GeoJSON.FeatureCollection[]>([])
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [currentTime, setCurrentTime] = useState(packageLocations[0].timestamp)
  const lastFrameTimeRef = useRef<number | null>(null)
  const [selectedWaypoint, setSelectedWaypoint] = useState<PackageLocation | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      const allRoutes = await Promise.all(
        routeSegments.map((segment) =>
          getRoute(packageLocations[segment.start - 1].coordinates, packageLocations[segment.end - 1].coordinates),
        ),
      )
      setRoutes(allRoutes)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
    fetchRoutes()
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds()
      packageLocations.forEach((location) => {
        bounds.extend(location.coordinates as [number, number])
      })

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 5,
      })
    }
  }, [])

  const calculateBearing = useCallback((start: [number, number], end: [number, number]): number => {
    const startPoint = turf.point(start)
    const endPoint = turf.point(end)
    return turf.bearing(startPoint, endPoint)
  }, [])

  const animateRoute = useCallback(
    (routeIndex: number, progress: number) => {
      if (!mapRef.current || !routes[routeIndex]) return

      const route = routes[routeIndex]
      const routeDistance = turf.length(route.features[0], { units: "kilometers" })
      const alongRoute = turf.along(route.features[0], routeDistance * progress, { units: "kilometers" }).geometry
        .coordinates as [number, number]

      const nextPoint = turf.along(route.features[0], Math.min(routeDistance * (progress + 0.01), routeDistance), {
        units: "kilometers",
      }).geometry.coordinates as [number, number]

      const bearing = calculateBearing(alongRoute, nextPoint)

      mapRef.current.easeTo({
        center: alongRoute,
        bearing: bearing,
        pitch: 60,
        zoom: 10,
        duration: 0,
      })
    },
    [routes, calculateBearing],
  )

  useEffect(() => {
    if (!isAnimating) {
      lastFrameTimeRef.current = null
      return
    }

    const animate = (currentFrameTime: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = currentFrameTime
      }

      const deltaTime = currentFrameTime - lastFrameTimeRef.current
      lastFrameTimeRef.current = currentFrameTime

      const newTime = new Date(currentTime.getTime() + deltaTime * ANIMATION_SPEED)

      if (newTime >= packageLocations[packageLocations.length - 1].timestamp) {
        setIsAnimating(false)
        setCurrentTime(packageLocations[packageLocations.length - 1].timestamp)
        setCurrentLocationIndex(packageLocations.length - 1)
        return
      }

      setCurrentTime(newTime)
      const newIndex = packageLocations.findIndex(
        (location, index) =>
          location.timestamp <= newTime &&
          (index === packageLocations.length - 1 || packageLocations[index + 1].timestamp > newTime),
      )

      if (newIndex !== currentLocationIndex) {
        setCurrentLocationIndex(newIndex)
      }

      if (newIndex < packageLocations.length - 1) {
        const progress =
          (newTime.getTime() - packageLocations[newIndex].timestamp.getTime()) /
          (packageLocations[newIndex + 1].timestamp.getTime() - packageLocations[newIndex].timestamp.getTime())
        animateRoute(newIndex, progress)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, currentTime, currentLocationIndex, animateRoute])

  const handleMarkerClick = useCallback((location: PackageLocation) => {
    setPopupInfo(location)
    setSelectedWaypoint(location)
    setIsSheetOpen(true)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: location.coordinates,
        zoom: 10,
        duration: 2000,
      })
    }
  }, [])

  const getMarkerIcon = useCallback((type: string) => {
    switch (type) {
      case "start":
        return <Package className="text-green-500 w-8 h-8" />
      case "end":
        return <Package className="text-red-500 w-8 h-8" />
      case "port":
        return <Ship className="text-blue-500 w-8 h-8" />
      case "airport":
        return <Plane className="text-purple-500 w-8 h-8" />
      case "warehouse":
        return <Truck className="text-yellow-500 w-8 h-8" />
      default:
        return <Package className="text-gray-500 w-8 h-8" />
    }
  }, [])

  const renderMarkers = useCallback(() => {
    return packageLocations.map((location) => (
      <Marker
        key={location.id}
        longitude={location.coordinates[0]}
        latitude={location.coordinates[1]}
        anchor="bottom"
        onClick={() => handleMarkerClick(location)}
      >
        <div className="relative">
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
            <div className="bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-white/60">WAYPOINT {location.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  location.type === 'start' ? 'bg-green-500/20 text-green-300' :
                  location.type === 'end' ? 'bg-red-500/20 text-red-300' :
                  location.type === 'port' ? 'bg-blue-500/20 text-blue-300' :
                  location.type === 'airport' ? 'bg-purple-500/20 text-purple-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {location.type.toUpperCase()}
                </span>
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{location.name}</h3>
              <div className="text-xs text-white/60 font-mono">
                {location.coordinates[0].toFixed(4)}°, {location.coordinates[1].toFixed(4)}°
              </div>
              <div className="text-xs text-white/60 mt-1">
                {location.timestamp.toLocaleString()}
              </div>
            </div>
            <div className="w-0.5 h-2 bg-white/20 mx-auto"></div>
          </div>
          {getMarkerIcon(location.type)}
        </div>
      </Marker>
    ))
  }, [getMarkerIcon, handleMarkerClick])

  const renderPopup = useCallback(() => {
    if (popupInfo) {
      return (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          anchor="top"
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <h3 className="font-bold">{popupInfo.name}</h3>
            <p>Type: {popupInfo.type}</p>
            <p>Time: {popupInfo.timestamp.toLocaleString()}</p>
          </div>
        </Popup>
      )
    }
    return null
  }, [popupInfo])

  const renderRoutes = useCallback(() => {
    return routes.map((route, index) => (
      <Source key={`route-${index}`} id={`route-${index}`} type="geojson" data={route}>
        <Layer
          id={`route-layer-${index}`}
          type="line"
          source={`route-${index}`}
          paint={{
            "line-color":
              routeSegments[index].type === "sea"
                ? "#00ffff"
                : routeSegments[index].type === "air"
                  ? "#ff00ff"
                  : "#007cbf",
            "line-width": 3,
            "line-opacity": 0.75,
            "line-dasharray": routeSegments[index].type !== "road" ? [2, 2] : [1],
          }}
        />
      </Source>
    ))
  }, [routes])

  const handleTimelineChange = useCallback(
    (newTime: Date) => {
      const newIndex = packageLocations.findIndex(
        (location, index) =>
          location.timestamp <= newTime &&
          (index === packageLocations.length - 1 || packageLocations[index + 1].timestamp > newTime),
      )
      setCurrentLocationIndex(newIndex)
      setCurrentTime(newTime)
      if (newIndex < packageLocations.length - 1) {
        const progress =
          (newTime.getTime() - packageLocations[newIndex].timestamp.getTime()) /
          (packageLocations[newIndex + 1].timestamp.getTime() - packageLocations[newIndex].timestamp.getTime())
        animateRoute(newIndex, progress)
      }
    },
    [animateRoute],
  )

  const toggleAnimation = useCallback(() => {
    setIsAnimating((prev) => !prev)
  }, [])

  const getCurrentMovement = useCallback(() => {
    if (currentLocationIndex < packageLocations.length - 1) {
      const current = packageLocations[currentLocationIndex]
      const next = packageLocations[currentLocationIndex + 1]
      return (
        <div className="flex items-center space-x-3 text-white">
          <span className="text-white/60 text-xs text-center">{current.name}</span>
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span className="text-white/60 text-xs text-center">{next.name}</span>
        </div>
      )
    }
    return null
  }, [currentLocationIndex])

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingSplash />}
      </AnimatePresence>
      <div className={`fixed inset-0 w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={mapboxgl.accessToken as string}
          ref={mapRef as React.Ref<MapRef>}
          style={{ width: "100%", height: "100%" }}
          terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
        >
          <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />
          {renderMarkers()}
          {renderPopup()}
          {renderRoutes()}
        </Map>
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
          {isAnimating ? (
            <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              {getCurrentMovement()}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedWaypoint(packageLocations[currentLocationIndex])
                  setIsSheetOpen(true)
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full border border-white/10 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-xs text-nowrap">View Timeline</span>
              </button>
              <button
                onClick={() => setIsProductSheetOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full border border-white/10 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-nowrap">Product Details</span>
              </button>
            </div>
          )}
        </div>
        <TimelineControl
          locations={packageLocations}
          currentTime={currentTime}
          isPlaying={isAnimating}
          onPlayPause={toggleAnimation}
          onTimeChange={handleTimelineChange}
          totalDuration={TOTAL_DURATION}
        />
        <WaypointSheet 
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          selectedLocation={selectedWaypoint}
          allLocations={packageLocations}
          onLocationSelect={(location) => {
            setSelectedWaypoint(location)
            setIsSheetOpen(false)
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: location.coordinates,
                zoom: 10,
                duration: 2000,
              })
            }
          }}
        />
        <ProductSheet 
          isOpen={isProductSheetOpen}
          onClose={() => setIsProductSheetOpen(false)}
        />
      </div>
    </>
  )
}

