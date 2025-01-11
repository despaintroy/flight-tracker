import {useContext, useEffect, useMemo} from "react"
import {
  AircraftHistoryContext,
  AircraftWithHistory
} from "@/lib/providers/AircraftHistoryContext"
import {Coordinate} from "@/lib/constants"

type UseADSBHistoryParams = Coordinate

const useADSBHistory = (
  params: UseADSBHistoryParams
): AircraftWithHistory[] => {
  const {lat, lon} = params

  const {aircraftMap, setMapCenter, activeHexes} = useContext(
    AircraftHistoryContext
  )

  useEffect(() => {
    setMapCenter({lat, lon})
  }, [lat, lon, setMapCenter])

  return useMemo(() => {
    return activeHexes.reduce<AircraftWithHistory[]>((acc, hex) => {
      const aircraft = aircraftMap.get(hex)
      if (!aircraft) return acc

      return [...acc, aircraft]
    }, [])
  }, [activeHexes, aircraftMap])
}

export default useADSBHistory
