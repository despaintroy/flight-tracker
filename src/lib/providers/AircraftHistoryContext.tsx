"use client"

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import {AircraftData} from "@/services/adsbTypes"
import LOCAL_AIRCRAFT_DB, {HistoryItem} from "@/services/localAircraftDB"
import {Coordinate, DEFAULT_FETCH_RADIUS_NM} from "@/lib/constants"
import {ADSB} from "@/services/adsb"
import usePageVisibility from "@/lib/hooks/usePageVisibility"
import {useUrlParamState} from "@/lib/hooks/useUrlParamState"
import {z} from "zod"

const AIRCRAFT_MAP_STALE_TIME = 1000 * 60 * 5 // 5 minutes

const ADSB_FETCH_TYPE_SCHEMA = z.union([
  z.object({type: z.literal("radius")}),
  z.object({type: z.literal("mil")}),
  z.object({type: z.literal("ladd")}),
  z.object({type: z.literal("pia")}),
  z.object({type: z.literal("hex"), hex: z.string()}),
  z.object({type: z.literal("callsign"), callsign: z.string()}),
  z.object({type: z.literal("registration"), registration: z.string()}),
  z.object({type: z.literal("type"), aircraftType: z.string()}),
  z.object({type: z.literal("squawk"), squawk: z.string()})
])

export type ADSBFetchType = z.infer<typeof ADSB_FETCH_TYPE_SCHEMA>

export type AircraftWithHistory = {
  aircraft: AircraftData
  history: HistoryItem[]
}

/** hex -> AircraftWithHistory */
type AircraftWithHistoryMap = Map<string, AircraftWithHistory>

type AircraftHistoryContextType = {
  aircraftMap: AircraftWithHistoryMap
  setAircraftMap: Dispatch<SetStateAction<AircraftWithHistoryMap>>
  setMapCenter: (coordinate: Coordinate) => void
  activeHexes: string[]
  fetchType: ADSBFetchType
  setFetchType: (fetchType: ADSBFetchType) => void
}

export const AircraftHistoryContext = createContext<AircraftHistoryContextType>(
  {
    aircraftMap: new Map(),
    setAircraftMap: () => {},
    setMapCenter: () => {},
    activeHexes: [],
    fetchType: {type: "radius"},
    setFetchType: () => {}
  }
)

export function AircraftHistoryProvider({children}: PropsWithChildren) {
  const [activeHexes, setActiveHexes] = useState<string[]>([])
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null)
  const lastPurgeRef = useRef(Date.now())
  const [fetchType, setFetchType] = useUrlParamState<ADSBFetchType>({
    key: "fetch_type",
    defaultValue: {type: "radius"},
    schema: ADSB_FETCH_TYPE_SCHEMA
  })
  const [aircraftMap, setAircraftMap] = useState<AircraftWithHistoryMap>(
    new Map()
  )

  const updateAircraft = useCallback(async () => {
    if (!mapCenter) return

    const adsbPromise = (() => {
      switch (fetchType.type) {
        case "mil":
          return ADSB.getMilitary()
        case "ladd":
          return ADSB.getLADD()
        case "pia":
          return ADSB.getPIA()
        case "hex":
          return ADSB.getHex(fetchType.hex)
        case "callsign":
          return ADSB.getCallsign(fetchType.callsign)
        case "registration":
          return ADSB.getRegistration(fetchType.registration)
        case "type":
          return ADSB.getType(fetchType.aircraftType)
        case "squawk":
          return ADSB.getSquawk(fetchType.squawk)
        case "radius":
          return ADSB.getRadius({
            ...mapCenter,
            radius_nm: DEFAULT_FETCH_RADIUS_NM
          })
        default:
          throw new Error(`Unknown fetch type: ${fetchType}`)
      }
    })()

    const {ac: aircraft, now} = await adsbPromise

    setActiveHexes(aircraft.map(({hex}) => hex))

    setAircraftMap((prev) => {
      const newMap = new Map(prev)

      aircraft.forEach((data) => {
        const {hex, lat, lon, seen = 0} = data

        if (!lat && !lon) return

        const history = [...(prev.get(hex)?.history ?? [])]
        if (!history.length) history.push(...LOCAL_AIRCRAFT_DB.getHistory(hex))

        history.push({
          lat,
          lon,
          alt_baro: data.alt_baro,
          time: now - seen * 1000
        })

        newMap.set(hex, {aircraft: data, history})
      })

      return newMap
    })
  }, [fetchType, mapCenter])

  const isPageVisible = usePageVisibility()
  useEffect(() => {
    if (!isPageVisible) return

    const interval = setInterval(() => {
      updateAircraft().catch((error) => {
        console.error("Failed to update aircraft:", error)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [updateAircraft, isPageVisible])

  useEffect(() => {
    const now = Date.now()

    if (lastPurgeRef.current > now - 1000 * 10) return
    else lastPurgeRef.current = now

    setAircraftMap((prev) => {
      const staleTime = now - AIRCRAFT_MAP_STALE_TIME
      const staleHexes = Array.from(prev.entries())
        .filter(([, {history}]) => (history.at(-1)?.time ?? 0) < staleTime)
        .map(([hex]) => hex)

      const newMap = new Map(prev)
      staleHexes.forEach((hex) => newMap.delete(hex))
      return newMap
    })
  }, [aircraftMap])

  return (
    <AircraftHistoryContext.Provider
      value={{
        aircraftMap,
        setAircraftMap,
        setMapCenter,
        activeHexes,
        fetchType,
        setFetchType
      }}
    >
      {children}
    </AircraftHistoryContext.Provider>
  )
}
