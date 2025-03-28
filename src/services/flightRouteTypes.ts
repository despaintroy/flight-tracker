import {DeepNullable} from "@/lib/helpers"

export type FlightRoute = DeepNullable<{
  callsign: string

  callsign_icao: string
  callsign_iata: string

  airline: {
    name: string
    icao: string
    iata: string
    country: string
    country_iso: string
    callsign: string
  }

  origin: {
    country_iso_name: string
    country_name: string
    elevation: number
    iata_code: string
    icao_code: string
    latitude: number
    longitude: number
    municipality: string
    name: string
  }

  destination: {
    country_iso_name: string
    country_name: string
    elevation: number
    iata_code: string
    icao_code: string
    latitude: number
    longitude: number
    municipality: string
    name: string
  }
}>

export type FlightRouteResponse = DeepNullable<{
  response: {flightroute: FlightRoute} | "unknown callsign"
}>
