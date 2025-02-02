import * as React from "react"
import {FC, useMemo} from "react"
import {GeoJSON} from "geojson"
import {AircraftWithHistory} from "@/lib/providers/AircraftHistoryContext"
import {Layer, Source} from "react-map-gl"
import {SymbolLayerSpecification} from "mapbox-gl"
import {
  getAircraftIcon,
  IconID,
  LayerID
} from "@/components/MainMap/mainMapHelpers"

type AircraftLayersProps = {
  aircraftWithHistories: AircraftWithHistory[]
  selectedHex: string | null
}

const AircraftLayers: FC<AircraftLayersProps> = (props) => {
  const {aircraftWithHistories, selectedHex} = props

  const airplanesGeoJSON = useMemo<GeoJSON>(() => {
    return {
      type: "FeatureCollection",
      features: aircraftWithHistories.map(({aircraft}) => ({
        id: aircraft.hex,
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
      }))
    }
  }, [aircraftWithHistories])

  const selectableSymbolPaint: SymbolLayerSpecification["paint"] = {
    "icon-color": [
      "case",
      ["==", ["get", "hex"], selectedHex],
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
