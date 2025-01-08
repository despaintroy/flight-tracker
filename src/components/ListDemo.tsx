"use client"

import {FC, useEffect, useRef, useState} from "react"
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Chip,
  Skeleton,
  Stack,
  Typography
} from "@mui/joy"
import {getAirplanes} from "@/services/adsb"
import {AircraftData} from "@/services/adsbTypes"
import {PhotosResponse} from "@/services/photosTypes"
import {getPhotos} from "@/services/photos"

const _SLC_COORDS = {
  lat: 40.7903,
  lon: -111.9771
}

const _LOGAN_COORDS = {
  lat: 41.737,
  lon: -111.8338
}

const _SFO_COORDS = {
  lat: 37.6191,
  lon: -122.3816
}

const _JFK_COORDS = {
  lat: 40.6413,
  lon: -73.7781
}

const COORDS = _JFK_COORDS
const FETCH_RADIUS = 10

type AirplaneCardProps = {
  airplane: AircraftData
}

const AirplaneCard: FC<AirplaneCardProps> = ({airplane}) => {
  const [images, setImages] = useState<PhotosResponse | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {threshold: 0.1} // Adjust the threshold for visibility (e.g., 0.1 means 10% of the element must be visible)
    )

    const element = elementRef.current
    if (element) {
      observer.observe(element) // Start observing the element
    }

    return () => {
      if (element) {
        observer.unobserve(element) // Cleanup observer when component unmounts
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    getPhotos({hex: airplane.hex}).then(setImages).catch(console.error)
  }, [airplane.hex, isVisible])

  return (
    <Card onClick={() => console.log(airplane)} ref={elementRef}>
      <CardOverflow>
        <AspectRatio sx={{minWidth: 200}}>
          {images === null ? (
            <Skeleton variant="rectangular" />
          ) : !images?.photos.length ? (
            <Box sx={{bgcolor: "#ddd"}}>
              <Typography>No image available</Typography>
            </Box>
          ) : (
            <img src={images.photos[0].thumbnail_large.src} alt="" />
          )}
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography level="body-xs">
            {[airplane.flight, airplane.ownOp].filter(Boolean).join(" – ") ||
              "No operator information"}
          </Typography>
          {airplane.alt_baro === "ground" ? (
            <Chip component="span" size="sm" variant="solid" color="neutral">
              On ground
            </Chip>
          ) : null}
        </Stack>
        <Typography level="title-lg">
          {airplane.desc ?? airplane.t ?? "Unknown aircraft"}
        </Typography>
      </CardContent>
    </Card>
  )
}

const ListDemo: FC = () => {
  const [airplanes, setAirplanes] = useState<AircraftData[] | null>(null)

  const updateAirplanes = async () => {
    const response = await getAirplanes({
      lat: COORDS.lat,
      lon: COORDS.lon,
      radius: FETCH_RADIUS
    })
    console.log(response)
    setAirplanes(response.ac)
  }

  return (
    <>
      <Button onClick={updateAirplanes}>Update Airplanes</Button>

      <Box
        sx={{
          my: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2
        }}
      >
        {airplanes?.map((airplane) => (
          <AirplaneCard key={airplane.hex} airplane={airplane} />
        ))}
      </Box>
    </>
  )
}

export default ListDemo
