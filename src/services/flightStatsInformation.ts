"use server"

import axios from "axios"
import {FlightStatsInformationData} from "@/services/flightStatsInformation.types"
import {generateRandomString} from "@/lib/helpers"

type ResponseType =
  | FlightStatsInformationData
  | {
      error: true
      message: "An unexpected error occurred"
    }
  | {
      tracks: {
        status: "400"
        code: "BAD_REQUEST"
        message: "Invalid value for flightId"
        id: string
      }
    }

export type GetFlightStatsInformationParams = {
  /** Internal flight stats id */
  flightId: string | undefined
  hex: string | undefined
}

export const getFlightStatsInformation = async (
  params: GetFlightStatsInformationParams
): Promise<FlightStatsInformationData | null> => {
  const {flightId} = params

  if (!flightId) return null

  const {data} = await axios.get<ResponseType>(
    `https://www.flightstats.com/v2/api/flick/${flightId}?guid=${generateRandomString(10)}&rqid=${generateRandomString(10)}`
  )

  if ("error" in data && data.error) return null
  if ("tracks" in data && data.tracks.status === "400") return null

  return data as FlightStatsInformationData
}
