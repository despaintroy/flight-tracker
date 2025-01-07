"use client"

import * as React from "react"
import {FC, useCallback, useEffect, useMemo, useState} from "react"
import {Button} from "@mui/joy"
import {getAirplanes} from "@/services/adsb"
import {AircraftData} from "@/services/adsbTypes"
import Map, {Layer, Source, ViewState} from "react-map-gl"
import {MapEvent} from "mapbox-gl"

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
const FETCH_RADIUS = 5

type PartialViewState = Omit<ViewState, "padding">

const RadarDemo: FC = () => {
  const [airplanes, setAirplanes] = useState<AircraftData[] | null>(null)
  const [doFetch, setDoFetch] = useState(false)
  const [viewState, setViewState] = useState<PartialViewState>({
    longitude: COORDS.lon,
    latitude: COORDS.lat,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0
  })

  const updateAirplanes = useCallback(async () => {
    const response = await getAirplanes({
      lat: viewState.latitude,
      lon: viewState.longitude,
      radius: FETCH_RADIUS
    })
    console.log(response)
    setAirplanes(response.ac)
  }, [viewState.latitude, viewState.longitude])

  useEffect(() => {
    if (doFetch) {
      const interval = setInterval(updateAirplanes, 1000)
      return () => clearInterval(interval)
    }
  }, [doFetch, updateAirplanes])

  const onLoadMap = useCallback((e: MapEvent) => {
    const map = e.target

    map.loadImage("airplane.png", (error, image) => {
      if (error || !image) throw error
      map.addImage("airplane-icon", image, {sdf: true})
    })
  }, [])

  const airplanesGeoJSON = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: (airplanes ?? []).map((airplane) => ({
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
      <Button onClick={() => setDoFetch((prev) => !prev)}>
        {doFetch ? "FETCHING..." : "START FETCHING"}
      </Button>

      <Map
        {...viewState}
        onLoad={onLoadMap}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/despaintroy/cm5l6ikr5000501sv8n0s9jz8"
        style={{width: 600, height: 400}}
        reuseMaps
      >
        <Source id="vehicles" type="geojson" data={airplanesGeoJSON}>
          <Layer
            type="symbol"
            layout={{
              "icon-image": "airplane-icon",
              "icon-size": 0.3,
              "icon-rotate": ["get", "rotation"]
            }}
          />
        </Source>
      </Map>
    </>
  )
}

export default RadarDemo
