"use client"

import * as React from "react"
import {FC, useRef, useState} from "react"
import Map, {MapRef} from "react-map-gl"
import DetailsPopover from "@/components/DetailsPopover/DetailsPopover"
import useADSBHistory from "@/lib/hooks/useADSBHistory"
import AircraftLayers from "@/components/MainMap/layers/AircraftLayers"
import {useOnLoadMap} from "@/components/MainMap/mainMapHelpers"
import AircraftPathsLayer from "@/components/MainMap/layers/AircraftPathsLayer"
import FilterModal from "@/components/FilterModal"
import {z} from "zod"
import {COORDINATES} from "@/lib/constants"
import {useStorageState} from "@/lib/hooks/useStorageState"

const APP_VIEW_STATE_SCHEMA = z.object({
  longitude: z.number(),
  latitude: z.number(),
  zoom: z.number(),
  bearing: z.number(),
  pitch: z.number()
})

export type AppViewState = z.infer<typeof APP_VIEW_STATE_SCHEMA>

export const DEFAULT_VIEW_STATE: AppViewState = {
  longitude: COORDINATES.slc.lon,
  latitude: COORDINATES.slc.lat,
  zoom: 10,
  bearing: 0,
  pitch: 0
}

const MainMap: FC = () => {
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useStorageState<AppViewState>({
    key: "view_state",
    defaultValue: DEFAULT_VIEW_STATE,
    schema: APP_VIEW_STATE_SCHEMA
  })
  const [selectedHex, setSelectedHex] = useState<string | null>(null)
  const onLoadMap = useOnLoadMap({setSelectedHex})

  const aircraftWithHistories = useADSBHistory({
    selectedHex,
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
        projection={{name: "globe"}}
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

      <FilterModal />
      <DetailsPopover aircraft={selectedAircraft} />
    </>
  )
}

export default MainMap
