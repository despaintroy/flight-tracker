"use client"

import * as React from "react"
import {FC, useCallback, useRef, useState} from "react"
import Map, {MapRef, ViewState} from "react-map-gl"
import {MapEvent} from "mapbox-gl"
import {distance, point} from "@turf/turf"
import Slideover from "@/components/Slideover"
import useADSBHistory from "@/lib/hooks/useADSBHistory"
import AircraftLayers from "@/components/MainMap/layers/AircraftLayers"
import {IconIDs, LayerIDs} from "@/components/MainMap/mainMapHelpers"
import {COORDINATES} from "@/lib/constants"
import AircraftPathsLayer from "@/components/MainMap/layers/AircraftPathsLayer"

const DEFAULT_ZOOM = 10

type PartialViewState = Omit<ViewState, "padding">

const MainMap: FC = () => {
  const [selectedHex, setSelectedHex] = useState<string | null>(null)

  const [viewState, setViewState] = useState<PartialViewState>({
    longitude: COORDINATES.slc.lon,
    latitude: COORDINATES.slc.lat,
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
  }, [])

  const selectedAircraft =
    aircraftWithHistories?.find(({aircraft}) => aircraft.hex === selectedHex)
      ?.aircraft ?? null

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
        <AircraftLayers
          aircraftWithHistories={aircraftWithHistories}
          selectedHex={selectedHex}
        />
        <AircraftPathsLayer
          aircraftWithHistories={aircraftWithHistories}
          selectedHex={selectedHex}
        />
      </Map>

      <Slideover aircraft={selectedAircraft} />
    </>
  )
}

export default MainMap
