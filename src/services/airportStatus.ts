type AirportEvent = {
  airportId: string
  groundStop: GroundStopEvent | null
  groundDelay: GroundDelayEvent | null
  airportClosure: AirportClosureEvent | null
  freeForm: FreeFormEvent | null
  arrivalDelay: ArrivalDelayEvent | null
  departureDelay: DepartureDelayEvent | null
  airportConfig: AirportConfig | null
  deicing: DeicingEvent | null
  airportLongName: string
  latitude: string
  longitude: string
}

type GroundStopEvent = {
  id: string
  airportId: string
  createdAt: string
  sourceTimeStamp: string
  updatedAt: string
  impactingCondition: string
  endTime: string
  center: string
  advisoryUrl: string
  includedFacilities: string[]
  includedFlights: string
  probabilityOfExtension: string
}

type GroundDelayEvent = {
  airportId: string
  averageDelay: string
  impactingCondition: string
  maxDelay: string
  startTime: string
  endTime: string
  updatedAt: string
  advisoryUrl: string
  departureScope: string
  includedFacilities: string[]
  includedFlights: string
}

type AirportClosureEvent = {
  airportId: string
  startTime: string
  endTime: string
  updatedAt: string
  simpleText: string
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

type DeicingEvent = {
  id: string
  airportId: string
  createdAt: string
  updatedAt: string
  eventTime: string
  expTime: string
}

type AirportConfig = {
  id: string
  airportId: string
  createdAt: string
  arrivalRunwayConfig: string
  departureRunwayConfig: string
  arrivalRate: number
  sourceTimeStamp: string
}

type ArrivalDelayEvent = {
  airportId: string
  reason: string
  arrivalDeparture: ArrivalDeparture
  updateTime: string
  averageDelay: string
  trend: "increasing" | "decreasing"
}

type DepartureDelayEvent = {
  airportId: string
  reason: string
  arrivalDeparture: ArrivalDeparture
  updateTime: string
  averageDelay: string
  trend: "increasing" | "decreasing"
}

type ArrivalDeparture = {
  type: "Arrival" | "Departure"
  min: string
  max: string
  trend: "Increasing" | "Decreasing"
}

export const getAirportEvents = async (): Promise<AirportEvent[]> => {
  const url = `https://nasstatus.faa.gov/api/airport-events`

  return []
}
