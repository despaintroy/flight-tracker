export type FlightRoute = {
  callsign: string

  callsign_icao: string | null
  callsign_iata: string | null

  airline: {
    name: string
    icao: string
    iata: string | null
    country: string
    country_iso: string
    callsign: string | null
  } | null

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
}

export type FlightRouteResponse = {
  response: {flightroute: FlightRoute} | "unknown callsign"
}
