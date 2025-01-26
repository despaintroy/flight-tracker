import {FC, useEffect, useState} from "react"
import {AircraftData} from "@/services/adsbTypes"
import {
  AspectRatio,
  Box,
  Divider,
  Sheet,
  Skeleton,
  Stack,
  Typography
} from "@mui/joy"
import {FlightRoute} from "@/services/flightRouteTypes"
import {getFlightRoute} from "@/services/flightRoute"
import {Landscape, Speed} from "@mui/icons-material"
import {knotsToMph} from "@/lib/helpers"
import {getPhotos, Photo} from "@/services/photos"
import wikipedia from "wikipedia"

type DetailsPopoverProps = {
  aircraft: AircraftData | null
}

const DetailsPopover: FC<DetailsPopoverProps> = (props) => {
  const {aircraft} = props
  const [images, setImages] = useState<Photo[] | null>(null)
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null)

  useEffect(() => {
    console.debug(aircraft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aircraft?.hex])

  useEffect(() => {
    if (!aircraft?.desc) return

    wikipedia
      .search(aircraft.desc)
      .then((results) => results.results[0].title)
      .then((title) => wikipedia.infobox(title))
      .then(console.log)
  }, [aircraft?.desc])

  useEffect(() => {
    setImages(null)
    if (!aircraft?.hex) return

    getPhotos({
      hex: aircraft.hex,
      icaoType: aircraft.t,
      description: aircraft.desc
    })
      .then(setImages)
      .catch(() => setImages([]))
  }, [aircraft?.desc, aircraft?.hex, aircraft?.t])

  useEffect(() => {
    setFlightRoute(null)
    if (!aircraft?.flight) return

    getFlightRoute({callsign: aircraft.flight})
      .then(setFlightRoute)
      .catch(console.error)
  }, [aircraft?.flight])

  if (!aircraft) return null

  const image = images?.at(0)

  return (
    <Sheet
      sx={(theme) => ({
        boxShadow: theme.shadow.sm,
        position: "fixed",
        zIndex: 3,
        top: {xs: theme.spacing(1), sm: theme.spacing(2)},
        left: {xs: theme.spacing(1), sm: theme.spacing(2)},
        right: {xs: theme.spacing(1), sm: theme.spacing(2)},
        maxWidth: 400,
        maxHeight: "45vh",
        bg: "background",
        borderRadius: "md",
        p: 2,
        overflow: "auto"
      })}
    >
      <Stack mb={2} position="relative">
        <AspectRatio sx={{minWidth: 200, overflow: "none", m: -2, mb: 0}}>
          {images === null ? (
            <Skeleton variant="rectangular" />
          ) : !image ? (
            <Box sx={{bg: "background.level1"}}>
              <Typography>No image available</Typography>
            </Box>
          ) : (
            <img
              src={image.src}
              alt=""
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%"
              }}
            />
          )}
        </AspectRatio>

        {image?.attribution ? (
          <Typography
            level="body-xs"
            fontStyle="italic"
            position="absolute"
            alignSelf="center"
            px={1}
            top={-18}
            sx={{bgcolor: "rgb(0 0 0 / 50%)", color: "white"}}
          >
            {image.attribution}
          </Typography>
        ) : null}
      </Stack>

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

export default DetailsPopover
