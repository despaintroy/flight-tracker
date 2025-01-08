"use client"

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState
} from "react"
import {AircraftData} from "@/services/adsbTypes"

export type HistoryItem = {
  lat: number
  lon: number
  alt_baro?: number | "ground"
  /** Milliseconds since Jan 1, 1970 */
  time: number
}

export type AircraftWithHistory = {
  aircraft: AircraftData
  history: HistoryItem[]
}

/** hex -> AircraftWithHistory */
type AircraftWithHistoryMap = Map<string, AircraftWithHistory>

type AircraftHistoryContextType = {
  aircraftMap: AircraftWithHistoryMap
  setAircraftMap: Dispatch<SetStateAction<AircraftWithHistoryMap>>
}

export const AircraftHistoryContext = createContext<AircraftHistoryContextType>({
  aircraftMap: new Map(),
  setAircraftMap: () => {}
})

export function AircraftHistoryProvider({children}: PropsWithChildren) {
  const [aircraftMap, setAircraftMap] = useState<AircraftWithHistoryMap>(
    new Map()
  )

  return (
    <AircraftHistoryContext.Provider value={{aircraftMap, setAircraftMap}}>
      {children}
    </AircraftHistoryContext.Provider>
  )
}
