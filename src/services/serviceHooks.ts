import {useQuery} from "@tanstack/react-query"
import {
  getFlightStatsTracker,
  GetFlightStatsTrackerParams
} from "@/services/flightStats"
import {getPhotos, GetPhotosParams} from "@/services/photos"
import {getFlightRoute, GetFlightRouteParams} from "@/services/flightRoute"

export const useFlightStatsTracker = (params: GetFlightStatsTrackerParams) => {
  return useQuery({
    queryKey: ["flightStatsTracker", params],
    queryFn: () => getFlightStatsTracker(params)
    // staleTime: Infinity
  })
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
