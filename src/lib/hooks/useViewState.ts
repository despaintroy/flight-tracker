import {useEffect, useState} from "react"
import {COORDINATES} from "@/lib/constants"
import {z} from "zod"
import useDebouncedValue from "@/lib/hooks/useDebouncedValue"

const STORAGE_KEY = "view_state"

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

const useViewState = () => {
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE)

  const debouncedViewState = useDebouncedValue(viewState, 1000)

  useEffect(() => {
    const json = localStorage.getItem(STORAGE_KEY) ?? "null"
    const parsed = APP_VIEW_STATE_SCHEMA.safeParse(JSON.parse(json))
    if (parsed.success) setViewState(parsed.data)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(debouncedViewState))
  }, [debouncedViewState])

  return [viewState, setViewState] as const
}

export default useViewState
