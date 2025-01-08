import {FetchAirplanesParams, getAirplanes} from "@/services/adsb"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import {
  AircraftHistoryContext,
  AircraftWithHistory
} from "@/lib/providers/AircraftHistoryContext"

type UseADSBHistoryParams = Omit<FetchAirplanesParams, "radius"> & {
  radius: number | (() => number)
}

const useADSBHistory = (
  params: UseADSBHistoryParams
): AircraftWithHistory[] => {
  const {lat, lon, radius} = params

  const [windowVisible, setWindowVisible] = useState(true)
  const {aircraftMap, setAircraftMap} = useContext(AircraftHistoryContext)
  const activeHexesRef = useRef<string[]>([])

  useEffect(() => {
    const handleVisibilityChange = () => setWindowVisible(!document.hidden)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const updateAirplanes = useCallback(async () => {
    const calculatedRadius = typeof radius === "function" ? radius() : radius
    const {ac: aircraft, now} = await getAirplanes({
      lat,
      lon,
      radius: calculatedRadius
    })

    activeHexesRef.current = aircraft.map(({hex}) => hex)

    setAircraftMap((prev) => {
      const newMap = new Map(prev)

      aircraft.forEach((data) => {
        const {hex, lat, lon, seen = 0} = data
        const newHistory = [...(newMap.get(hex)?.history ?? [])]

        newHistory.push({
          lat,
          lon,
          alt_baro: data.alt_baro,
          time: now - seen * 1000
        })

        newMap.set(hex, {
          aircraft: data,
          history: newHistory
        })
      })

      return newMap
    })
  }, [lat, lon, radius, setAircraftMap])

  useEffect(() => {
    if (!windowVisible) return

    const interval = setInterval(updateAirplanes, 1000)
    return () => clearInterval(interval)
  }, [updateAirplanes, windowVisible])

  return useMemo(() => {
    return activeHexesRef.current.reduce<AircraftWithHistory[]>((acc, hex) => {
      const aircraft = aircraftMap.get(hex)
      if (!aircraft) return acc

      return [...acc, aircraft]
    }, [])
  }, [aircraftMap])
}

export default useADSBHistory
