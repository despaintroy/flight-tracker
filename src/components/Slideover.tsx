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
  airplane: AircraftData | null
}

const Slideover: FC<SlideoverProps> = (props) => {
  const {airplane} = props
  const [images, setImages] = useState<PhotosResponse | null>(null)
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null)

  useEffect(() => {
    setImages(null)
    if (!airplane?.hex) return

    getPhotos({hex: airplane.hex}).then(setImages).catch(console.error)
  }, [airplane?.hex])

  useEffect(() => {
    setFlightRoute(null)
    if (!airplane?.flight) return

    getFlightRoute({callsign: airplane.flight})
      .then(setFlightRoute)
      .catch(console.error)
  }, [airplane?.flight])

  if (!airplane) return null

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
        {[airplane.flight, flightRoute?.airline?.name ?? airplane.ownOp]
          .filter(Boolean)
          .join(" – ") || "No operator information"}
      </Typography>
      <Typography level="title-lg">
        {airplane.desc ?? airplane.t ?? "Unknown aircraft"}
      </Typography>

      <Divider sx={{my: 2}} />

      {airplane.alt_baro ? (
        <Typography startDecorator={<Landscape fontSize="small" />}>
          {airplane.alt_baro === "ground"
            ? "On ground"
            : `${airplane.alt_baro} ft`}

          {airplane.baro_rate ? ` (${airplane.baro_rate} fpm)` : null}
        </Typography>
      ) : null}

      {airplane.gs ? (
        <Typography startDecorator={<Speed fontSize="small" />}>
          {`${Math.round(knotsToMph(airplane.gs))} mph`}
        </Typography>
      ) : null}
    </Sheet>
  )
}

export default Slideover
