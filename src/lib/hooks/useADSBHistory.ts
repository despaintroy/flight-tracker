import {useContext, useEffect, useMemo} from "react"
import {
  AircraftHistoryContext,
  AircraftWithHistory
} from "@/lib/providers/AircraftHistoryContext"
import {Coordinate} from "@/lib/constants"
import {useSelectedAircraft} from "@/lib/providers/SelectedAircraftContext"

type UseADSBHistoryParams = {coordinate: Coordinate}

const useADSBHistory = (
  params: UseADSBHistoryParams
): AircraftWithHistory[] => {
  const {coordinate: {lat, lon}} = params
  const {selectedAircraft} = useSelectedAircraft()
  const selectedHex = selectedAircraft?.hex

  const {aircraftMap, setMapCenter, activeHexes} = useContext(
    AircraftHistoryContext
  )

  useEffect(() => {
    setMapCenter({lat, lon})
  }, [lat, lon, setMapCenter])

  return useMemo(() => {
    const hexes = [...activeHexes]
    if (selectedHex && !hexes.includes(selectedHex)) hexes.push(selectedHex)

    return hexes.reduce<AircraftWithHistory[]>((acc, hex) => {
      const aircraft = aircraftMap.get(hex)
      if (!aircraft) return acc

      return [...acc, aircraft]
    }, [])
  }, [activeHexes, aircraftMap, selectedHex])
}

export default useADSBHistory
