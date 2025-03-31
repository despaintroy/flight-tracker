"use client"

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import {AircraftHistoryContext} from "@/lib/providers/AircraftHistoryContext"
import {CATEGORY_DESCRIPTIONS} from "@/services/adsbTypes"
import {
  useFlightStatsInformation,
  useFlightStatsSearch,
  usePhotos
} from "@/services/serviceHooks"
import {Photo} from "@/services/photos"

export type ScheduledTimes = {
  scheduled: string | undefined
  estimated: string | undefined
  estimatedIsActual: boolean
}

export type NormalizedAirport = {
  city: string
  iata: string
  gate: string | undefined
  terminal: string | undefined
  baggage: string | undefined
  gateTimes: ScheduledTimes | undefined
  runwayTimes: ScheduledTimes | undefined
}

type NormalizedAircraftData = {
  hex: string
  icaoType: string | undefined
  description: string
  callsign: string | undefined
  flightNumber: string | undefined
  images: Photo[] | undefined
  altitudeFt: "ground" | number | undefined
  groundSpeedMph: number | undefined
  climbRateFpm: number | undefined
  owner:
    | {
        registeredOwner: string | undefined
        airlineName: string | undefined
      }
    | undefined
  category:
    | {
        code: string
        description: string | undefined
      }
    | undefined
  airports:
    | {
        departure: NormalizedAirport
        arrival: NormalizedAirport
        diversion: NormalizedAirport | undefined
      }
    | undefined
}

type SelectedAircraftContextType = {
  selectedAircraft: NormalizedAircraftData | null
  setSelectedHex: (hex: string | null) => void
}

const SelectedAircraftContext = createContext<SelectedAircraftContextType>({
  selectedAircraft: null,
  setSelectedHex: () => {}
})

const SelectedAircraftProvider: FC<PropsWithChildren> = (props) => {
  const [selectedHex, setSelectedHex] = useState<string | null>(null)

  const {aircraftMap} = useContext(AircraftHistoryContext)
  const aircraftData = selectedHex
    ? aircraftMap.get(selectedHex)?.aircraft
    : undefined

  const callsign = aircraftData?.flight?.trim()

  /****************
   * Fetch Data
   ****************/

  const {data: flightStatsSearch, isLoading: isLoadingFlightStatsSearchResult} =
    useFlightStatsSearch({
      search: callsign
    })

  const flightStatsSearchResult = flightStatsSearch?.at(0)?._source

  const {data: flightStatsInformation} = useFlightStatsInformation({
    flightId: flightStatsSearchResult?.flightId ?? undefined,
    hex: selectedHex ?? undefined
  })

  const {data: images} = usePhotos({
    hex: selectedHex,
    icaoType: aircraftData?.t,
    description: aircraftData?.desc
  })

  /****************
   * Debug Log Data
   ****************/

  useEffect(() => {
    if (aircraftData) console.debug("[aircraft-data]", aircraftData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aircraftData?.hex])

  useEffect(() => {
    if (flightStatsSearch)
      console.debug("[flight-stats-search]", flightStatsSearch)
  }, [flightStatsSearch])

  useEffect(() => {
    if (flightStatsInformation)
      console.debug("[flight-stats-information]", flightStatsInformation)
  }, [flightStatsInformation])

  /****************
   * Format Data
   ****************/

  const departureAirport = useMemo((): NormalizedAirport | undefined => {
    if (
      !flightStatsSearchResult?.departureAirportCity ||
      !flightStatsSearchResult.departureAirport
    )
      return undefined

    return {
      city: flightStatsSearchResult.departureAirportCity,
      iata: flightStatsSearchResult.departureAirport,
      baggage: undefined,
      gate: flightStatsSearchResult.departureGate || undefined,
      terminal: flightStatsSearchResult.departureTerminal || undefined,
      gateTimes: {
        scheduled: flightStatsSearchResult.scheduledGateDeparture || undefined,
        estimated:
          flightStatsSearchResult.actualGateDeparture ||
          flightStatsSearchResult.estimatedGateDeparture ||
          undefined,
        estimatedIsActual: !!flightStatsSearchResult.actualGateDeparture
      },
      runwayTimes: {
        scheduled:
          flightStatsSearchResult.scheduledRunwayDeparture || undefined,
        estimated:
          flightStatsSearchResult.actualRunwayDeparture ||
          flightStatsSearchResult.estimatedRunwayDeparture ||
          undefined,
        estimatedIsActual: !!flightStatsSearchResult.actualRunwayDeparture
      }
    }
  }, [flightStatsSearchResult])

  const arrivalAirport = useMemo((): NormalizedAirport | undefined => {
    if (
      !flightStatsSearchResult?.arrivalAirportCity ||
      !flightStatsSearchResult.arrivalAirport
    )
      return undefined

    return {
      city: flightStatsSearchResult.arrivalAirportCity,
      iata: flightStatsSearchResult.arrivalAirport,
      baggage: flightStatsSearchResult.baggage || undefined,
      gate: flightStatsSearchResult.arrivalGate || undefined,
      terminal: flightStatsSearchResult.arrivalTerminal || undefined,
      gateTimes: {
        scheduled: flightStatsSearchResult.scheduledGateArrival || undefined,
        estimated:
          flightStatsSearchResult.actualGateArrival ||
          flightStatsSearchResult.estimatedGateArrival ||
          undefined,
        estimatedIsActual: !!flightStatsSearchResult.actualGateArrival
      },
      runwayTimes: {
        scheduled: flightStatsSearchResult.scheduledRunwayArrival || undefined,
        estimated:
          flightStatsSearchResult.actualRunwayArrival ||
          flightStatsSearchResult.estimatedRunwayArrival ||
          undefined,
        estimatedIsActual: !!flightStatsSearchResult.actualRunwayArrival
      }
    }
  }, [flightStatsSearchResult])

  const flightNumber = (() => {
    if (isLoadingFlightStatsSearchResult) return undefined

    const {carrier, flightNumber} = flightStatsSearchResult ?? {}
    if (carrier && flightNumber) return `${carrier}${flightNumber}`
    else return callsign
  })()

  const selectedAircraft = useMemo((): NormalizedAircraftData | null => {
    if (!selectedHex) return null

    return {
      hex: selectedHex,
      description:
        aircraftData?.desc ||
        flightStatsInformation?.flightEquipmentName ||
        aircraftData?.t ||
        "Unknown type",
      owner: isLoadingFlightStatsSearchResult
        ? undefined
        : {
            registeredOwner: aircraftData?.ownOp ?? undefined,
            airlineName: flightStatsSearchResult?.carrierName ?? undefined
          },
      icaoType: aircraftData?.t ?? undefined,
      callsign,
      flightNumber,
      images,
      altitudeFt: aircraftData?.alt_baro ?? undefined,
      groundSpeedMph: aircraftData?.gs ?? undefined,
      climbRateFpm: aircraftData?.baro_rate ?? undefined,
      category: aircraftData?.category
        ? {
            code: aircraftData.category,
            description: CATEGORY_DESCRIPTIONS.get(aircraftData.category)
          }
        : undefined,

      airports:
        departureAirport && arrivalAirport
          ? {
              departure: departureAirport,
              arrival: arrivalAirport,
              diversion: undefined // TODO
            }
          : undefined
    }
  }, [
    aircraftData,
    arrivalAirport,
    callsign,
    departureAirport,
    flightNumber,
    flightStatsSearchResult,
    images,
    isLoadingFlightStatsSearchResult,
    selectedHex
  ])

  return (
    <SelectedAircraftContext.Provider
      value={{setSelectedHex, selectedAircraft}}
    >
      {props.children}
    </SelectedAircraftContext.Provider>
  )
}

export const useSelectedAircraft = () => {
  return useContext(SelectedAircraftContext)
}

export default SelectedAircraftProvider
