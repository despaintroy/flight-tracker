import * as React from "react"
import {FC, useMemo} from "react"
import {Feature, GeoJSON} from "geojson"
import {AircraftWithHistory} from "@/lib/providers/AircraftHistoryContext"
import {Layer, Source} from "react-map-gl"
import {SymbolLayerSpecification} from "mapbox-gl"
import {
  getAircraftIcon,
  IconID,
  LayerID
} from "@/components/MainMap/mainMapHelpers"
import {useSelectedAircraft} from "@/lib/providers/SelectedAircraftContext"

type AircraftLayersProps = {
  aircraftWithHistories: AircraftWithHistory[]
}

const AircraftLayers: FC<AircraftLayersProps> = (props) => {
  const {aircraftWithHistories} = props
  const {selectedAircraft} = useSelectedAircraft()

  const airplanesGeoJSON = useMemo((): GeoJSON => {
    return {
      type: "FeatureCollection",
      features: aircraftWithHistories.reduce<Feature[]>((acc, {aircraft}) => {
        if (!aircraft.lat || !aircraft.lon) return acc

        acc.push({
          id: aircraft.hex ?? undefined,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [aircraft.lon, aircraft.lat]
          },
          properties: {
            rotation: aircraft.track ?? aircraft.true_heading ?? 0,
            hex: aircraft.hex,
            icon: getAircraftIcon(aircraft)
          }
        })

        return acc
      }, [])
    }
  }, [aircraftWithHistories])

  const selectableSymbolPaint: SymbolLayerSpecification["paint"] = {
    "icon-color": [
      "case",
      ["==", ["get", "hex"], selectedAircraft?.hex ?? null],
      "#00bbff",
      "#aaaaaa"
    ]
  }

  return (
    <Source id="aircraft-source" type="geojson" data={airplanesGeoJSON}>
      <Layer
        id={LayerID.AirplaneIcons}
        type="symbol"
        filter={["==", ["get", "icon"], IconID.Airplane]}
        layout={{
          "icon-image": ["get", "icon"],
          "icon-size": 0.3,
          "icon-rotate": ["get", "rotation"],
          "icon-allow-overlap": true
        }}
        paint={selectableSymbolPaint}
      />

      <Layer
        id={LayerID.SquareIcons}
        type="symbol"
        filter={["==", ["get", "icon"], IconID.Square]}
        layout={{
          "icon-image": ["get", "icon"],
          "icon-size": 0.15,
          "icon-allow-overlap": true
        }}
        paint={selectableSymbolPaint}
      />

      <Layer
        id={LayerID.VehicleIcons}
        type="symbol"
        filter={["==", ["get", "icon"], IconID.Vehicle]}
        layout={{
          "icon-image": ["get", "icon"],
          "icon-size": 0.13,
          "icon-rotate": ["get", "rotation"],
          "icon-allow-overlap": true
        }}
        paint={selectableSymbolPaint}
      />
    </Source>
  )
}

export default AircraftLayers
