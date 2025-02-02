export interface PackageLocation {
  id: number
  name: string
  coordinates: [number, number]
  type: "start" | "end" | "port" | "airport" | "warehouse"
  timestamp: Date
}

export interface RouteSegment {
  start: number
  end: number
  type: "road" | "sea" | "air"
}

