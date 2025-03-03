// https://www.fly.faa.gov/flyfaa/AirportLookup.jsp?q=sfo
// https://nasstatus.faa.gov/api/airport-events
// https://www.fly.faa.gov/fly/com/faa/flyfaa/xmlAirportStatusServlet.html

//https://www.flightaware.com/ajax/ignoreall/miserymap/realtime.rvt?type=us

type AirportEvent = {
  airportId: string
  groundStop: null
  groundDelay: null
  airportClosure: null
  freeForm: FreeFormEvent | null
  arrivalDelay: null
  departureDelay: DepartureDelayEvent | null
  airportConfig: AirportConfig | null
  deicing: DeicingEvent | null
  airportLongName: string
  latitude: string
  longitude: string
}

type FreeFormEvent = {
  id: string
  airportId: string
  createdAt: string | null
  updatedAt: string
  startTime: string
  endTime: string
  simpleText: string
  text: string
  notamNumber: number
  issuedDate: string
}

type DepartureDelayEvent = {
  airportId: string
  reason: string
  arrivalDeparture: {
    type: "Departure"
    min: string
    max: string
    trend: string
  }
  updateTime: string
  averageDelay: string
  trend: string
}

type AirportConfig = {
  id: string
  createdAt: string
  airportId: string
  arrivalRunwayConfig: string
  departureRunwayConfig: string
  arrivalRate: number
  sourceTimeStamp: string
}

type DeicingEvent = {
  id: string
  createdAt: string
  airportId: string
  updatedAt: string
  eventTime: string
  expTime: string
}

export const getAirportEvents = async (): Promise<AirportEvent[]> => {
  const url = `https://nasstatus.faa.gov/api/airport-events`

  return []
}
