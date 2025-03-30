import * as React from "react"
import {FC, useMemo} from "react"
import {Layer, Source} from "react-map-gl"
import {LayerID} from "@/components/MainMap/mainMapHelpers"
import {AircraftWithHistory} from "@/lib/providers/AircraftHistoryContext"
import {Feature, GeoJSON} from "geojson"
import {useSelectedAircraft} from "@/lib/providers/SelectedAircraftContext"

type AircraftPathsLayerProps = {
  aircraftWithHistories: AircraftWithHistory[]
}

const AircraftPathsLayer: FC<AircraftPathsLayerProps> = (props) => {
  const {aircraftWithHistories} = props
  const {selectedAircraft} = useSelectedAircraft()
  const selectedHex = selectedAircraft?.hex

  const aircraftHistoriesGeoJSON = useMemo((): GeoJSON => {
    const limit = Date.now() - 30_000 // 30 seconds ago

    return {
      type: "FeatureCollection",
      features: aircraftWithHistories.reduce<Feature[]>(
        (acc, {aircraft, history}) => {
          const limitedHistory =
            aircraft.hex === selectedHex
              ? history
              : history.filter(({time}) => time > limit)

          acc.push({
            id: aircraft.hex ?? undefined,
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: limitedHistory.map(({lon, lat}) => [lon, lat])
            },
            properties: {
              hex: aircraft.hex
            }
          })

          return acc
        },
        []
      )
    }
  }, [aircraftWithHistories, selectedHex])

  return (
    <Source
      id="aircraft-histories-source"
      type="geojson"
      data={aircraftHistoriesGeoJSON}
    >
      <Layer
        id={LayerID.AircraftPaths}
        type="line"
        paint={{
          "line-color": [
            "case",
            ["==", ["get", "hex"], selectedHex ?? null],
            "#00bbff",
            "#aaaaaa"
          ],
          "line-width": [
            "case",
            ["==", ["get", "hex"], selectedHex ?? null],
            2,
            1
          ]
        }}
      />
    </Source>
  )
}

export default AircraftPathsLayer
