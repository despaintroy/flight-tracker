"use client"

import * as React from "react"
import {FC, useCallback, useMemo, useRef, useState} from "react"
import Map, {Layer, MapRef, Source, ViewState} from "react-map-gl"
import {MapEvent} from "mapbox-gl"
import {distance, point} from "@turf/turf"
import {GeoJSON} from "geojson"
import Slideover from "@/components/Slideover"
import useADSBHistory from "@/lib/hooks/useADSBHistory"

const SLC_COORDS = {
  lat: 40.7903,
  lon: -111.9771
}

const _LOGAN_COORDS = {
  lat: 41.737,
  lon: -111.8338
}

const COORDS = SLC_COORDS
const DEFAULT_ZOOM = 10

type PartialViewState = Omit<ViewState, "padding">

const RadarDemo: FC = () => {
  const [selectedHex, setSelectedHex] = useState<string | null>(null)

  const [viewState, setViewState] = useState<PartialViewState>({
    longitude: COORDS.lon,
    latitude: COORDS.lat,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0
  })
  const mapRef = useRef<MapRef>(null)

  const getRadius = useCallback(() => {
    const bounds = mapRef.current?.getBounds()
    if (!bounds) return 0

    const {_sw, _ne} = bounds
    const diagonal = distance(
      point([_sw.lng, _sw.lat]),
      point([_ne.lng, _ne.lat]),
      {units: "nauticalmiles"}
    )

    return diagonal / 2
  }, [])

  const aircraftWithHistories = useADSBHistory({
    lat: viewState.latitude,
    lon: viewState.longitude,
    radius: getRadius
  })

  const onLoadMap = useCallback((e: MapEvent) => {
    const map = e.target

    map.loadImage("airplane.png", (error, image) => {
      if (error || !image) throw error
      if (!map.hasImage("airplane-icon"))
        map.addImage("airplane-icon", image, {sdf: true})
    })

    map.on("click", () => setSelectedHex(null))

    map.on("click", "airplanes-layer", (e) => {
      const hex = e.features?.[0]?.properties?.hex as string
      setSelectedHex(hex ?? null)
    })

    map.on("mouseenter", "airplanes-layer", () => {
      map.getCanvas().style.cursor = "pointer"
    })

    map.on("mouseleave", "airplanes-layer", () => {
      map.getCanvas().style.cursor = ""
    })
  }, [])

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
          rotation: aircraft.track ?? aircraft.true_heading,
          hex: aircraft.hex
        }
      }))
    }
  }, [aircraftWithHistories])

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

  const selectedAircraft =
    aircraftWithHistories?.find(({aircraft}) => aircraft.hex === selectedHex)
      ?.aircraft ?? null

  return (
    <>
      <Slideover aircraft={selectedAircraft} />

      <Map
        {...viewState}
        ref={mapRef}
        onLoad={onLoadMap}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/despaintroy/cm5l6ikr5000501sv8n0s9jz8"
        style={{width: "100%", height: "100vh", position: "unset"}}
        reuseMaps
        fadeDuration={0}
      >
        <Source id="airplanes-source" type="geojson" data={airplanesGeoJSON}>
          <Layer
            id="airplanes-layer"
            type="symbol"
            layout={{
              "icon-image": "airplane-icon",
              "icon-size": 0.3,
              "icon-rotate": ["get", "rotation"],
              "icon-allow-overlap": true
            }}
            paint={{
              "icon-color": [
                "case",
                ["==", ["get", "hex"], selectedHex],
                "#00bbff",
                "#aaaaaa"
              ]
            }}
          />
        </Source>

        <Source
          id="aircraft-histories-source"
          type="geojson"
          data={aircraftHistoriesGeoJSON}
        >
          <Layer
            id="aircraft-histories-layer"
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
      </Map>
    </>
  )
}

export default RadarDemo
