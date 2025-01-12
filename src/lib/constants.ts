export type Coordinate = {
  lat: number
  lon: number
}

export const DEFAULT_FETCH_RADIUS_NM = 100

export const COORDINATES = {
  slc: {
    lat: 40.7903,
    lon: -111.9771
  },
  lgu: {
    lat: 41.737,
    lon: -111.8338
  },
  jfk: {
    lat: 40.6413,
    lon: -73.7781
  }
} satisfies Record<string, Coordinate>
