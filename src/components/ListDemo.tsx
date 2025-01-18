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
import {AircraftData} from "@/services/adsbTypes"
import {PhotosResponse} from "@/services/photosTypes"
import {getPhotos} from "@/services/photos"
import {COORDINATES} from "@/lib/constants"
import {ADSB} from "@/services/adsb"

const FETCH_RADIUS = 10

type AircraftCardProps = {
  aircraft: AircraftData
}

const AircraftCard: FC<AircraftCardProps> = ({aircraft}) => {
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

    getPhotos({hex: aircraft.hex}).then(setImages).catch(console.error)
  }, [aircraft.hex, isVisible])

  return (
    <Card onClick={() => console.log(aircraft)} ref={elementRef}>
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
            {[aircraft.flight, aircraft.ownOp].filter(Boolean).join(" – ") ||
              "No operator information"}
          </Typography>
          {aircraft.alt_baro === "ground" ? (
            <Chip component="span" size="sm" variant="solid" color="neutral">
              On ground
            </Chip>
          ) : null}
        </Stack>
        <Typography level="title-lg">
          {aircraft.desc ?? aircraft.t ?? "Unknown aircraft"}
        </Typography>
      </CardContent>
    </Card>
  )
}

const ListDemo: FC = () => {
  const [aircrafts, setAircrafts] = useState<AircraftData[] | null>(null)

  const updateAircraft = async () => {
    const response = await ADSB.getRadius({
      lat: COORDINATES.jfk.lat,
      lon: COORDINATES.jfk.lon,
      radius_nm: FETCH_RADIUS
    })
    console.log(response)
    setAircrafts(response.ac)
  }

  return (
    <>
      <Button onClick={updateAircraft}>Update Aircraft</Button>

      <Box
        sx={{
          my: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2
        }}
      >
        {aircrafts?.map((aircraft) => (
          <AircraftCard key={aircraft.hex} aircraft={aircraft} />
        ))}
      </Box>
    </>
  )
}

export default ListDemo
