import * as React from "react"
import {FC, useMemo} from "react"
import {Layer, Source} from "react-map-gl"
import {LayerIDs} from "@/components/MainMap/mainMapHelpers"
import {AircraftWithHistory} from "@/lib/providers/AircraftHistoryContext"
import {GeoJSON} from "geojson"

type AircraftPathsLayerProps = {
  aircraftWithHistories: AircraftWithHistory[]
  selectedHex: string | null
}

const AircraftPathsLayer: FC<AircraftPathsLayerProps> = (props) => {
  const {aircraftWithHistories, selectedHex} = props

  const aircraftHistoriesGeoJSON = useMemo<GeoJSON>(() => {
    const limit = Date.now() - 30_000 // 30 seconds ago

    return {
      type: "FeatureCollection",
      features: aircraftWithHistories.map(({aircraft, history}) => {
        const limitedHistory =
          aircraft.hex === selectedHex
            ? history
            : history.filter(({time}) => time > limit)

        return {
          id: aircraft.hex,
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: limitedHistory.map(({lon, lat}) => [lon, lat])
          },
          properties: {
            hex: aircraft.hex
          }
        }
      })
    }
  }, [aircraftWithHistories, selectedHex])

  return (
    <Source
      id="aircraft-histories-source"
      type="geojson"
      data={aircraftHistoriesGeoJSON}
    >
      <Layer
        id={LayerIDs.AircraftPaths}
        type="line"
        paint={{
          "line-color": [
            "case",
            ["==", ["get", "hex"], selectedHex],
            "#00bbff",
            "#aaaaaa"
          ],
          "line-width": ["case", ["==", ["get", "hex"], selectedHex], 2, 1]
        }}
      />
    </Source>
  )
}

export default AircraftPathsLayer
