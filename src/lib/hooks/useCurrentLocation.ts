import {useEffect, useState} from "react"

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationPosition | null>(null)

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(setCurrentLocation)
    return () => navigator.geolocation.clearWatch(watch)
  }, [])

  return currentLocation
}

export default useCurrentLocation
