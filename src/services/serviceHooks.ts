import {useQuery} from "@tanstack/react-query"
import {getFlightStatsTracker, GetFlightStatsTrackerParams} from "@/services/flightStatsTracker"
import {getPhotos, GetPhotosParams} from "@/services/photos"
import {getFlightRoute, GetFlightRouteParams} from "@/services/flightRoute"
import {useEffect} from "react"
import {getFlightStatsSearch, GetFlightStatsSearchParams} from "@/services/flightStatsSearch"
import {getFlightStatsInformation, GetFlightStatsInformationParams} from "@/services/flightStatsInformation"
import {useAddPositions} from "@/lib/hooks/useAddPositions"

/** @deprecated can return wrong flight segment */
export const useFlightStatsTracker = (params: GetFlightStatsTrackerParams) => {
  const addPositions = useAddPositions(params.hex)

  const flightStatsTrackerQueryResult = useQuery({
    queryKey: ["flightStatsTracker", params],
    queryFn: () => getFlightStatsTracker(params),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true
  })

  const positions =
    flightStatsTrackerQueryResult.data?.positional?.flexTrack?.positions ??
    undefined

  useEffect(() => {
    addPositions(positions)
  }, [addPositions, positions])

  return flightStatsTrackerQueryResult
}

export const useFlightStatsInformation = (
  params: GetFlightStatsInformationParams
) => {
  const addPositions = useAddPositions(params.hex)

  const flightStatsInformationQueryResult = useQuery({
    queryKey: ["flightStatsInformation", params],
    queryFn: () => getFlightStatsInformation(params),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true
  })

  const positions =
    flightStatsInformationQueryResult.data?.positions ?? undefined

  useEffect(() => {
    addPositions(positions)
  }, [addPositions, positions])

  return flightStatsInformationQueryResult
}

export const useFlightStatsSearch = (params: GetFlightStatsSearchParams) => {
  return useQuery({
    queryKey: ["flightStatsSearch", params],
    queryFn: () => getFlightStatsSearch(params),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true
  })
}

export const usePhotos = (params: GetPhotosParams) => {
  return useQuery({
    queryKey: ["photos", params],
    queryFn: () => getPhotos(params),
    staleTime: Infinity
  })
}

/** @deprecated for out-of-date info */
export const useFlightRoute = (params: GetFlightRouteParams) => {
  return useQuery({
    queryKey: ["flightRoute", params],
    queryFn: () => getFlightRoute(params),
    staleTime: Infinity,
    retry: false
  })
}
