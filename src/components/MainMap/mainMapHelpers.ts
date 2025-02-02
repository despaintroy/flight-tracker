import {Dispatch, SetStateAction, useCallback} from "react"
import {GeolocateControl, MapEvent} from "mapbox-gl"
import {AircraftData} from "@/services/adsbTypes"

export enum LayerID {
  AirplaneIcons = "airplane-icons-layer",
  SquareIcons = "square-icons-layer",
  VehicleIcons = "vehicle-icons-layer",
  AircraftPaths = "aircraft-paths-layer"
}

export enum IconID {
  Airplane = "airplane-icon",
  Square = "square-icon",
  Vehicle = "vahicle-icon"
}

export const getAircraftIcon = (aircraft: AircraftData): IconID => {
  if (aircraft.category === "C1" || aircraft.category === "C2")
    return IconID.Vehicle
  if (/^[AB]/.test(aircraft.hex)) return IconID.Airplane
  if (aircraft.hex.startsWith("~")) return IconID.Square
  return IconID.Airplane
}

type UseOnLoadMapParams = {
  setSelectedHex: Dispatch<SetStateAction<string | null>>
}

export const useOnLoadMap = (params: UseOnLoadMapParams) => {
  const {setSelectedHex} = params

  return useCallback(
    (e: MapEvent) => {
      const map = e.target

      map.setMaxPitch(0)
      map.setMinPitch(0)

      map.dragRotate.disable()
      map.touchPitch.disable()
      map.touchZoomRotate.disableRotation()

      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        })
      )

      const icons = {
        [IconID.Airplane]: "airplane.png",
        [IconID.Square]: "square.png",
        [IconID.Vehicle]: "vehicle.png"
      }

      Object.entries(icons).forEach(([id, path]) => {
        map.loadImage(path, (error, image) => {
          if (error || !image) throw error
          if (!map.hasImage(id)) map.addImage(id, image, {sdf: true})
        })
      })

      map.on("click", () => setSelectedHex(null))

      const clickableIconLayers = [
        LayerID.AirplaneIcons,
        LayerID.SquareIcons,
        LayerID.VehicleIcons
      ]

      clickableIconLayers.forEach((layer) => {
        map.on("click", layer, (e) => {
          const hex = e.features?.[0]?.properties?.hex
          setSelectedHex(hex ?? null)
        })

        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer"
        })

        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = ""
        })
      })
    },
    [setSelectedHex]
  )
}
