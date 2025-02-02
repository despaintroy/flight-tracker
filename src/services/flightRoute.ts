import axios from "axios"
import {FlightRoute, FlightRouteResponse} from "@/services/flightRouteTypes"
import {useQuery} from "@tanstack/react-query"

type GetFlightRouteParams = {
  callsign: string | undefined
}

export const getFlightRoute = async (
  params: GetFlightRouteParams
): Promise<FlightRoute | null> => {
  const {callsign} = params

  if (!callsign) return null
  const response = await axios.get<FlightRouteResponse>(
    `https://api.adsbdb.com/v0/callsign/${callsign}`
  )
  if (typeof response.data.response === "string") return null
  return response.data.response.flightroute
}

export const useFlightRoute = (params: GetFlightRouteParams) => {
  return useQuery({
    queryKey: ["flightRoute", params],
    queryFn: () => getFlightRoute(params),
    staleTime: Infinity
  })
}
