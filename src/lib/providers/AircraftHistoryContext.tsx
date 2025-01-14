"use client"

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import {AircraftData} from "@/services/adsbTypes"
import LOCAL_AIRCRAFT_DB, {HistoryItem} from "@/services/localAircraftDB"
import {Coordinate, DEFAULT_FETCH_RADIUS_NM} from "@/lib/constants"
import {getAircraft} from "@/services/adsb"
import usePageVisibility from "@/lib/hooks/usePageVisibility"

const AIRCRAFT_MAP_STALE_TIME = 1000 * 60 * 5 // 5 minutes

export type AircraftWithHistory = {
  aircraft: AircraftData
  history: HistoryItem[]
}

/** hex -> AircraftWithHistory */
type AircraftWithHistoryMap = Map<string, AircraftWithHistory>

type AircraftHistoryContextType = {
  aircraftMap: AircraftWithHistoryMap
  setMapCenter: (coordinate: Coordinate) => void
  setFetchRadius: (radius_nm: number) => void
  activeHexes: string[]
}

export const AircraftHistoryContext = createContext<AircraftHistoryContextType>(
  {
    aircraftMap: new Map(),
    setMapCenter: () => {},
    setFetchRadius: () => {},
    activeHexes: []
  }
)

export function AircraftHistoryProvider({children}: PropsWithChildren) {
  const [fetchRadius, setFetchRadius] = useState(DEFAULT_FETCH_RADIUS_NM)
  const [activeHexes, setActiveHexes] = useState<string[]>([])
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null)
  const lastPurgeRef = useRef(Date.now())
  const [aircraftMap, setAircraftMap] = useState<AircraftWithHistoryMap>(
    new Map()
  )

  const updateAircraft = useCallback(async () => {
    if (!mapCenter) return

    const {ac: aircraft, now} = await getAircraft({
      ...mapCenter,
      radius: fetchRadius
    })

    setActiveHexes(aircraft.map(({hex}) => hex))

    setAircraftMap((prev) => {
      const newMap = new Map(prev)

      aircraft.forEach((data) => {
        const {hex, lat, lon, seen = 0} = data

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
  }, [fetchRadius, mapCenter])

  const isPageVisible = usePageVisibility()
  useEffect(() => {
    if (!isPageVisible) return

    const interval = setInterval(updateAircraft, 1000)
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
      value={{aircraftMap, setMapCenter, setFetchRadius, activeHexes}}
    >
      {children}
    </AircraftHistoryContext.Provider>
  )
}
