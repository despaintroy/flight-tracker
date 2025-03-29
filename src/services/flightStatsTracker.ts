"use server"

import axios from "axios"
import {parseCallsign} from "@/services/airlineCodes"
import {FlightStatsTrackerData} from "./flightStatsTracker.types"

type GetFlightStatsTrackerResponse = {
  data: FlightStatsTrackerData
}

export type GetFlightStatsTrackerParams = {
  callsign: string | undefined
  hex: string | undefined
}

/** @deprecated can return wrong flight segment */
export const getFlightStatsTracker = async (
  params: GetFlightStatsTrackerParams
): Promise<FlightStatsTrackerData | null> => {
  const {callsign} = params

  if (!callsign) return null

  const parsed = parseCallsign(callsign)
  if (!parsed) return null

  const {iataAirlineCode, flightNumber} = parsed
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()

  const url = `https://www.flightstats.com/v2/api-next/flight-tracker/${iataAirlineCode}/${flightNumber}/${year}/${month}/${day}`

  const {data} = await axios.get<GetFlightStatsTrackerResponse>(url)
  const trackerData = data.data

  // if empty object, return null
  if (!trackerData || !Object.keys(trackerData).length) return null
  return trackerData
}
