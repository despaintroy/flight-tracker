"use client"

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from "react"
import {AircraftData} from "@/services/adsbTypes"
import LOCAL_AIRCRAFT_DB, {HistoryItem} from "@/services/localAircraftDB"
import {Coordinate} from "@/lib/constants"
import {getAircraft} from "@/services/adsb"

const DEFAULT_RADIUS_NM = 100

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
  const [windowVisible, setWindowVisible] = useState(true)
  const [fetchRadius, setFetchRadius] = useState(DEFAULT_RADIUS_NM)
  const [activeHexes, setActiveHexes] = useState<string[]>([])
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null)
  const [aircraftMap, setAircraftMap] = useState<AircraftWithHistoryMap>(
    new Map()
  )

  useEffect(() => {
    const handleVisibilityChange = () => setWindowVisible(!document.hidden)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

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

  useEffect(() => {
    if (!windowVisible) return

    const interval = setInterval(updateAircraft, 1000)
    return () => clearInterval(interval)
  }, [updateAircraft, windowVisible])

  useEffect(() => {
    LOCAL_AIRCRAFT_DB.bulkAddHistoryItems(
      aircraftMap
        .entries()
        .reduce<Record<string, HistoryItem[]>>((acc, [hex, {history}]) => {
          acc[hex] = history
          return acc
        }, {})
    )
  }, [aircraftMap])

  return (
    <AircraftHistoryContext.Provider
      value={{aircraftMap, setMapCenter, setFetchRadius, activeHexes}}
    >
      {children}
    </AircraftHistoryContext.Provider>
  )
}
