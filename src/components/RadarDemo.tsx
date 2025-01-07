"use client"

import * as React from "react"
import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {getAirplanes} from "@/services/adsb"
import {AircraftData} from "@/services/adsbTypes"
import Map, {Layer, MapRef, Source, ViewState} from "react-map-gl"
import {MapEvent} from "mapbox-gl"
import {distance, point} from "@turf/turf"
import {GeoJSON} from "geojson"

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
  const [airplanes, setAirplanes] = useState<AircraftData[] | null>(null)
  const [windowVisible, setWindowVisible] = useState(false)
  const [viewState, setViewState] = useState<PartialViewState>({
    longitude: COORDS.lon,
    latitude: COORDS.lat,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0
  })
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    const handleVisibilityChange = () => setWindowVisible(!document.hidden)

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const updateAirplanes = useCallback(async () => {
    const bounds = mapRef.current?.getBounds()
    if (!bounds) return

    const {_sw, _ne} = bounds
    const diagonal = distance(
      point([_sw.lng, _sw.lat]),
      point([_ne.lng, _ne.lat]),
      {units: "nauticalmiles"}
    )

    const response = await getAirplanes({
      lat: viewState.latitude,
      lon: viewState.longitude,
      radius: diagonal / 2
    })
    console.log(response)
    setAirplanes(response.ac)
  }, [viewState.latitude, viewState.longitude])

  useEffect(() => {
    const interval = setInterval(updateAirplanes, 1000)
    return () => clearInterval(interval)
  }, [updateAirplanes])

  const onLoadMap = useCallback((e: MapEvent) => {
    const map = e.target

    map.loadImage("airplane.png", (error, image) => {
      if (error || !image) throw error
      if (!map.hasImage("airplane-icon"))
        map.addImage("airplane-icon", image, {sdf: true})
    })
  }, [])

  const airplanesGeoJSON = useMemo<GeoJSON>(() => {
    return {
      type: "FeatureCollection",
      features: (airplanes ?? []).map((airplane) => ({
        id: airplane.hex,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [airplane.lon, airplane.lat]
        },
        properties: {
          rotation: airplane.track ?? airplane.true_heading
        }
      }))
    }
  }, [airplanes])

  return (
    <>
      <Map
        {...viewState}
        ref={mapRef}
        onLoad={onLoadMap}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/despaintroy/cm5l6ikr5000501sv8n0s9jz8"
        style={{width: "100%", height: "100vh"}}
        reuseMaps
        fadeDuration={0}
      >
        <Source id="airplanes" type="geojson" data={airplanesGeoJSON}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": "airplane-icon",
              "icon-size": 0.3,
              "icon-rotate": ["get", "rotation"],
              "icon-allow-overlap": true
            }}
            paint={{
              "icon-color": "#00c3f3"
            }}
          />
        </Source>
      </Map>
    </>
  )
}

export default RadarDemo
