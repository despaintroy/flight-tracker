import axios from "axios"
import {FlightRoute, FlightRouteResponse} from "@/services/flightRouteTypes"

type GetFlightRouteParams = {
  callsign: string
}

export const getFlightRoute = async (
  params: GetFlightRouteParams
): Promise<FlightRoute | null> => {
  const {callsign} = params
  try {
    const response = await axios.get<FlightRouteResponse>(
      `https://api.adsbdb.com/v0/callsign/${callsign}`
    )
    if (typeof response.data.response === "string") return null
    return response.data.response.flightroute
  } catch {
    return null
  }
}
