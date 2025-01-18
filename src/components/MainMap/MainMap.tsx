"use client"

import * as React from "react"
import {FC, useRef, useState} from "react"
import Map, {MapRef, ViewState} from "react-map-gl"
import DetailsPopover from "@/components/DetailsPopover"
import useADSBHistory from "@/lib/hooks/useADSBHistory"
import AircraftLayers from "@/components/MainMap/layers/AircraftLayers"
import {useOnLoadMap} from "@/components/MainMap/mainMapHelpers"
import {COORDINATES} from "@/lib/constants"
import AircraftPathsLayer from "@/components/MainMap/layers/AircraftPathsLayer"
import SearchBar from "@/components/SearchBar"

const DEFAULT_ZOOM = 10

type PartialViewState = Omit<ViewState, "padding">

const MainMap: FC = () => {
  const mapRef = useRef<MapRef>(null)
  const [selectedHex, setSelectedHex] = useState<string | null>(null)
  const onLoadMap = useOnLoadMap({setSelectedHex})

  const [viewState, setViewState] = useState<PartialViewState>({
    longitude: COORDINATES.slc.lon,
    latitude: COORDINATES.slc.lat,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0
  })

  const aircraftWithHistories = useADSBHistory({
    coordinate: {
      lat: viewState.latitude,
      lon: viewState.longitude
    }
  })

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

      <SearchBar />
      <DetailsPopover aircraft={selectedAircraft} />
    </>
  )
}

export default MainMap
