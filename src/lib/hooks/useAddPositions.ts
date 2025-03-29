import {useCallback, useContext} from "react"
import {AircraftHistoryContext} from "@/lib/providers/AircraftHistoryContext"
import {Position} from "@/services/flightStatsInformation.types"

export const useAddPositions = (hex: string | undefined) => {
  const {setAircraftMap} = useContext(AircraftHistoryContext)

  return useCallback(
    (positions: Position[] | undefined) => {
      if (!positions?.length || !hex) return

      setAircraftMap((prev) => {
        const newMap = new Map(prev)
        const prevAircraftWithHistory = prev.get(hex)
        if (!prevAircraftWithHistory) return newMap

        const newHistory = [...prevAircraftWithHistory.history]

        for (const position of positions) {
          const {lat, lon, altitudeFt, date} = position
          if (!lat || !lon || !date) continue

          // if some other history item within 30s, ignore
          const hasCloseHistory = newHistory.some(
            (history) =>
              Math.abs(history.time - new Date(date).getTime()) < 30 * 1000
          )
          if (hasCloseHistory) continue

          newHistory.push({
            lat,
            lon,
            alt_baro: altitudeFt ?? undefined,
            time: new Date(date).getTime()
          })
        }

        newHistory.sort((a, b) => a.time - b.time)

        newMap.set(hex, {
          ...prevAircraftWithHistory,
          history: newHistory
        })

        return newMap
      })
    },
    [hex, setAircraftMap]
  )
}
