import {DeepNullable} from "@/lib/helpers"

type FlightNote = {
  final: boolean
  canceled: boolean
  hasDepartedGate: boolean
  hasDepartedRunway: boolean
  landed: boolean
  message: string
  messageCode: string
  pastExpectedTakeOff: boolean
  tracking: boolean
  hasPositions: boolean
  trackingUnavailable: boolean
  phase: string
  hasActualRunwayDepartureTime: boolean
  hasActualGateDepartureTime: boolean
}

export type ScheduleTimes = DeepNullable<{
  time: string
  ampm: string
  time24: string
  timezone: string
}>

export type EstimatedActualTime = DeepNullable<{
  title: "Actual" | "Estimated"
  time: string
  ampm: string
  time24: string
  runway: boolean
  timezone: string
}>

type GraphXAxis = {
  dep: string
  depUTC: string
  arr: string
  arrUTC: string
}

type StatusDelay = {
  departure: {minutes: number}
  arrival: {minutes: number}
}

type DelayStatus = {
  wording: string
  minutes: number
}

type Status = {
  statusCode: string
  status: string
  color: string
  statusDescription: string
  delay: StatusDelay
  delayStatus: DelayStatus
  lastUpdatedText: string
  diverted: boolean
}

type Carrier = {
  name: string
  fs: string
}

export type Airport = DeepNullable<{
  fs: string
  iata: string
  name: string
  city: string
  state: string
  country: string
  timeZoneRegionName: string
  regionName: string
  gate: string
  terminal: string
  baggage: string
  times: {
    scheduled: ScheduleTimes
    estimatedActual: EstimatedActualTime
  }
  date: string
}>

type FlightResultHeader = {
  statusDescription: string
  carrier: Carrier
  flightNumber: string
  status: string
  diverted: boolean
  color: string
  departureAirportFS: string
  arrivalAirportFS: string
  divertedAirport: string
}

type TicketHeader = {
  carrier: Carrier
  flightNumber: string
}

type AdditionalFlightInfo = {
  equipment: {
    iata: string
    name: string
    title: string
  }
  flightDuration: string
}

type Codeshare = {
  fs: string
  name: string
  flightNumber: string
}

type Position = {
  lon: number
  lat: number
  speedMph: number
  altitudeFt: number
  source: string
  date: string
  course: number
  vrateMps: number
  lastObserved: string
}

type FlexTrack = {
  flightId: number
  carrierFsCode: string
  flightNumber: string
  tailNumber: string
  callsign: string
  departureAirportFsCode: string
  arrivalAirportFsCode: string
  departureDate: {dateUtc: string; dateLocal: string}
  equipment: string
  delayMinutes: number
  bearing: number
  heading: number
  positions: Position[]
  irregularOperations: any[]
  fleetAircraftId: number
}

type Positional = {
  departureAirportCode: string
  arrivalAirportCode: string
  divertedAirportCode: string
  flexFlightStatus: string
  flexTrack: FlexTrack
}

export type FlightStatsTrackerData = DeepNullable<{
  flightId: number
  flightNote: FlightNote
  isTracking: boolean
  isLanded: boolean
  isScheduled: boolean
  sortTime: string
  schedule: {
    scheduledDeparture: string
    scheduledDepartureUTC: string
    estimatedActualDepartureRunway: boolean
    estimatedActualDepartureTitle: string
    estimatedActualDeparture: string
    estimatedActualDepartureUTC: string
    scheduledArrival: string
    scheduledArrivalUTC: string
    estimatedActualArrivalRunway: boolean
    estimatedActualArrivalTitle: string
    estimatedActualArrival: string
    estimatedActualArrivalUTC: string
    graphXAxis: GraphXAxis
    tookOff: string
  }
  status: Status
  resultHeader: FlightResultHeader
  ticketHeader: TicketHeader
  operatedBy: string
  departureAirport: Airport
  arrivalAirport: Airport
  divertedAirport: Airport
  additionalFlightInfo: AdditionalFlightInfo
  codeshares: Codeshare[]
  positional: Positional
  flightState: string
}>
