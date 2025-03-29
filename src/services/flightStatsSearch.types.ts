import {DeepNullable} from "@/lib/helpers"

type CodeShare = {
  carrier: string
  trafficRestriction: string
  flightNumber: string
}

type Wetlease = {
  scheduleText: string
  carrier: string
}

type FlightSource = {
  flightId: number
  hubUrl: string
  classification: number
  keywords: string
  lastUpdated: string
  creator: string
  creationDate: string
  carrier: string
  carrierIata: string
  carrierIcao: string
  carrierName: string
  flightNumber: string
  status: "DIVERTED" | "LANDED" | "SCHEDULED" | "ACTIVE"
  codeshares: CodeShare[]
  wetlease: Wetlease
  departureAirport: string
  departureTimeZone: string
  departureAirportName: string
  departureAirportCity: string
  arrivalAirport: string
  arrivalTimeZone: string
  arrivalAirportName: string
  arrivalAirportCity: string
  departureDateTime: string
  publishedDeparture: string
  scheduledGateDeparture: string
  estimatedGateDeparture: string
  actualGateDeparture: string
  scheduledRunwayDeparture: string
  estimatedRunwayDeparture: string
  actualRunwayDeparture: string
  arrivalDateTime: string
  publishedArrival: string
  scheduledGateArrival: string
  estimatedGateArrival: string
  actualGateArrival: string
  scheduledRunwayArrival: string
  estimatedRunwayArrival: string
  actualRunwayArrival: string
  departureGate: string
  departureTerminal: string
  arrivalGate: string
  arrivalTerminal: string
  baggage: string
  scheduledEquipment: string
  actualEquipment: string
  actualEquipmentIcao: string
  recordStatus: "final" | "scheduled" | "active"
  id: string
  tailNumber: string
  departure: string
  arrival: string
  delayMinutesDeparture: number
  delayMinutesArrival: number
}

export type FlightStatsSearchResult = DeepNullable<{
  _index: string
  _type: string
  _id: string
  _score: number
  _source: FlightSource
}>
