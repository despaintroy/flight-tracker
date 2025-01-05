"use client"

import {FC, useEffect, useRef, useState} from "react"
import {Button} from "@mui/joy"
import {getAirplanes} from "@/services/adsb"
import {AircraftData} from "@/services/adsbTypes"

const SLC_COORDS = {
  lat: 40.7903,
  lon: -111.9771
}

const _LOGAN_COORDS = {
  lat: 41.737,
  lon: -111.8338
}

const COORDS = SLC_COORDS
const CANVAS_SIZE = 800
const FETCH_RADIUS = 5

const RadarDemo: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [airplanes, setAirplanes] = useState<AircraftData[] | null>(null)
  const [doFetch, setDoFetch] = useState(false)

  const drawAirplanes = async () => {
    const response = await getAirplanes({
      lat: COORDS.lat,
      lon: COORDS.lon,
      radius: FETCH_RADIUS
    })
    console.log(response)
    setAirplanes(response.ac)
  }

  useEffect(() => {
    if (doFetch) {
      const interval = setInterval(drawAirplanes, 1000)
      return () => clearInterval(interval)
    }
  }, [doFetch])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw airplanes on canvas
    airplanes?.forEach((airplane) => {
      const xRatio = (airplane.lon - COORDS.lon) * zoom
      const yRatio = (airplane.lat - COORDS.lat) * zoom

      const x = CANVAS_SIZE / 2 + xRatio
      const y = CANVAS_SIZE / 2 - yRatio

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }, [airplanes, zoom])

  return (
    <>
      <Button onClick={() => setDoFetch((prev) => !prev)}>
        {doFetch ? "FETCHING..." : "START FETCHING"}
      </Button>
      <Button onClick={() => setZoom((prev) => prev * 2)}>+</Button>
      <Button onClick={() => setZoom((prev) => prev / 2)}>-</Button>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{display: "block", border: "1px solid black"}}
      />
    </>
  )
}

export default RadarDemo
