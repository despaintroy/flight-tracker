import {FC, useEffect, useState} from "react"
import {AircraftData} from "@/services/adsbTypes"
import {AspectRatio, Box, Divider, Sheet, Skeleton, Typography} from "@mui/joy"
import {PhotosResponse} from "@/services/photosTypes"
import {getPhotos} from "@/services/photos"
import {FlightRoute} from "@/services/flightRouteTypes"
import {getFlightRoute} from "@/services/flightRoute"
import {Landscape, Speed} from "@mui/icons-material"
import {knotsToMph} from "@/lib/helpers"

type SlideoverProps = {
  aircraft: AircraftData | null
}

const Slideover: FC<SlideoverProps> = (props) => {
  const {aircraft} = props
  const [images, setImages] = useState<PhotosResponse | null>(null)
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null)

  useEffect(() => {
    setImages(null)
    if (!aircraft?.hex) return

    getPhotos({hex: aircraft.hex}).then(setImages).catch(console.error)
  }, [aircraft?.hex])

  useEffect(() => {
    setFlightRoute(null)
    if (!aircraft?.flight) return

    getFlightRoute({callsign: aircraft.flight})
      .then(setFlightRoute)
      .catch(console.error)
  }, [aircraft?.flight])

  if (!aircraft) return null

  return (
    <Sheet
      sx={{
        position: "fixed",
        top: 12,
        left: 12,
        width: 400,
        bg: "background",
        borderRadius: "md",
        p: 2,
        overflow: "auto"
      }}
    >
      <AspectRatio
        sx={{minWidth: 200, borderRadius: 4, overflow: "none", mb: 2}}
      >
        {images === null ? (
          <Skeleton variant="rectangular" />
        ) : !images?.photos.length ? (
          <Box sx={{bg: "background.level1"}}>
            <Typography>No image available</Typography>
          </Box>
        ) : (
          <img src={images.photos[0].thumbnail_large.src} alt="" />
        )}
      </AspectRatio>

      <Typography level="body-xs">
        {[aircraft.flight?.trim(), flightRoute?.airline?.name ?? aircraft.ownOp]
          .filter(Boolean)
          .join(" – ") || "No operator information"}
      </Typography>
      <Typography level="title-lg">
        {aircraft.desc ?? aircraft.t ?? "Unknown aircraft"}
      </Typography>

      <Divider sx={{my: 2}} />

      {aircraft.alt_baro ? (
        <Typography startDecorator={<Landscape fontSize="small" />}>
          {aircraft.alt_baro === "ground"
            ? "On ground"
            : `${aircraft.alt_baro} ft`}

          {aircraft.baro_rate ? ` (${aircraft.baro_rate} fpm)` : null}
        </Typography>
      ) : null}

      {aircraft.gs ? (
        <Typography startDecorator={<Speed fontSize="small" />}>
          {`${Math.round(knotsToMph(aircraft.gs))} mph`}
        </Typography>
      ) : null}
    </Sheet>
  )
}

export default Slideover
