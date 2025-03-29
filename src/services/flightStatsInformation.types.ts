import {DeepNullable} from "@/lib/helpers"

export type InformationAirport = DeepNullable<{
  fsCode: string
  name: string
  city: string
  stateCode: string
  countryCode: string
  countryName: string
  localTime: string
  latitude: number | ""
  longitude: number | ""
  elevationFt: number | ""
  conditions: string
  temperatureCelsius: number | ""
  conditionIcon: string
}>

export type Position = DeepNullable<{
  lon: number
  lat: number
  speedMph: number
  altitudeFt: number
  source: string
  date: string
  course: number
  vrateMps: number
  lastObserved: string
}>

type OperationalTime = {
  departureTime: number
  departureTimeString: string
  arrivalTime: number
  arrivalTimeString: string
  actualRunwayArrivalTime: number | null
  actualRunwayArrivalTimeString: string | null
  actualRunwayDepartureTime: number
  actualRunwayDepartureTimeString: string
}

type MiniTracker = {
  statusName: "DEPARTED" | "LANDED"
  flightStatusCode: string
  utcDepartureTime: number
  localDepartureTime: number
  localDepartureTimeString: string
  isActualDepartureTime: boolean
  utcArrivalTime: number
  localArrivalTime: number
  localArrivalTimeString: string
  isActualArrivalTime: boolean
  utcActualRunwayArrivalTime: number | null
  utcActualRunwayDepartureTime: number
  totalKilometers: number
  arrivalAirport: string
  departureAirport: string
  kilometersFromDeparture: number
  kilometersToArrival: number
}

export type FlightStatsInformationData = DeepNullable<{
  responseTime: number
  flightId: string
  operatedByFlightNum: string
  statusCode: string
  statusName: "DEPARTED" | "LANDED"
  statusColor: string
  statusAppendKey: string
  statusAppend: string
  flightEquipmentIata: string
  flightEquipmentName: string
  airports: {
    departure: InformationAirport
    arrival: InformationAirport
    diverted: InformationAirport
  }
  bearing: number
  heading: number
  flightStatus: string
  operationalTimes: {
    isActualDeparture: boolean
    isActualArrival: boolean
    utc: OperationalTime
    local: OperationalTime
  }
  positions: Position[]
  miniTracker: MiniTracker
}>
