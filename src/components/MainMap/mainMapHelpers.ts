import {Dispatch, SetStateAction, useCallback} from "react"
import {GeolocateControl, MapEvent} from "mapbox-gl"

export enum LayerIDs {
  AirplaneIcons = "airplane-icons-layer",
  SquareIcons = "square-icons-layer",
  AircraftPaths = "aircraft-paths-layer"
}

export enum IconIDs {
  Airplane = "airplane-icon",
  Square = "square-icon"
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
        [IconIDs.Airplane]: "airplane.png",
        [IconIDs.Square]: "square.png"
      }

      Object.entries(icons).forEach(([id, path]) => {
        map.loadImage(path, (error, image) => {
          if (error || !image) throw error
          if (!map.hasImage(id)) map.addImage(id, image, {sdf: true})
        })
      })

      map.on("click", () => setSelectedHex(null))

      const clickableIconLayers = [LayerIDs.AirplaneIcons, LayerIDs.SquareIcons]

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
