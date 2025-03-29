"use server"

import axios from "axios"
import {FlightStatsSearchResult} from "@/services/flightStatsSearch.types"
import {generateRandomString} from "@/lib/helpers"

export type GetFlightStatsSearchParams = {
  search: string | undefined
}

export const getFlightStatsSearch = async (
  params: GetFlightStatsSearchParams
): Promise<FlightStatsSearchResult[] | null> => {
  const {search} = params

  if (!search) return null

  const {data} = await axios.post<FlightStatsSearchResult[]>(
    `https://www.flightstats.com/v2/api/search/structured-search?rqid=${generateRandomString(10)}`,
    {value: search}
  )
  return data
}
