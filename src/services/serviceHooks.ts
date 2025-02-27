import {useQuery} from "@tanstack/react-query"
import {
  getFlightStatsTracker,
  GetFlightStatsTrackerParams
} from "@/services/flightStats"
import {getPhotos, GetPhotosParams} from "@/services/photos"
import {getFlightRoute, GetFlightRouteParams} from "@/services/flightRoute"
import {useContext, useEffect} from "react"
import {AircraftHistoryContext} from "@/lib/providers/AircraftHistoryContext"

export const useFlightStatsTracker = (params: GetFlightStatsTrackerParams) => {
  const {hex} = params
  const {setAircraftMap} = useContext(AircraftHistoryContext)

  const flightStatsQueryResult = useQuery({
    queryKey: ["flightStatsTracker", params],
    queryFn: () => getFlightStatsTracker(params)
    // staleTime: Infinity
  })

  useEffect(() => {
    const positions =
      flightStatsQueryResult.data?.positional.flexTrack.positions

    if (!positions?.length || !hex) return

    setAircraftMap((prev) => {
      const newMap = new Map(prev)
      const prevAircraftWithHistory = prev.get(hex)
      if (!prevAircraftWithHistory) return newMap

      const newHistory = [...prevAircraftWithHistory.history]

      for (const position of positions) {
        const {lat, lon, altitudeFt, date} = position

        // if some other history item within 30s, ignore
        const hasCloseHistory = newHistory.some(
          (history) =>
            Math.abs(history.time - new Date(date).getTime()) < 30 * 1000
        )
        if (hasCloseHistory) continue

        newHistory.push({
          lat,
          lon,
          alt_baro: altitudeFt,
          time: new Date(date).getTime()
        })
      }

      newHistory.sort((a, b) => a.time - b.time)

      newMap.set(hex, {
        ...prevAircraftWithHistory,
        history: newHistory
      })

      return newMap
    })
  }, [flightStatsQueryResult.data, hex, setAircraftMap])

  return flightStatsQueryResult
}

export const usePhotos = (params: GetPhotosParams) => {
  return useQuery({
    queryKey: ["photos", params],
    queryFn: () => getPhotos(params),
    staleTime: Infinity
  })
}

export const useFlightRoute = (params: GetFlightRouteParams) => {
  return useQuery({
    queryKey: ["flightRoute", params],
    queryFn: () => getFlightRoute(params),
    staleTime: Infinity,
    retry: false
  })
}
