import axios from "axios"
import {ADSBEndpointResponse} from "@/services/adsbTypes"

type FetchAirplanesParams = {
  lat: number
  lon: number
  /** Radius in nautical miles */
  radius: number
}

export const getAirplanes = async (
  params: FetchAirplanesParams
): Promise<ADSBEndpointResponse> => {
  const {lat, lon} = params
  const radius = Math.min(params.radius, 250)
  const response = await axios.get<ADSBEndpointResponse>(
    `https://api.airplanes.live/v2/point/${lat}/${lon}/${radius}`
  )
  return response.data
}
