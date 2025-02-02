// @ts-nocheck
import type GeoJSON from "geojson"

export async function getRoute(start: [number, number], end: [number, number]): Promise<GeoJSON.FeatureCollection> {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
    { method: "GET" },
  )
  const json = await query.json()
  const data = json.routes[0]
  const route = data.geometry.coordinates
  const geojson: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      },
    ],
  }
  return geojson
}

