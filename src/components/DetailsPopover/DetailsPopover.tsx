import {FC} from "react"
import {
  AspectRatio,
  Box,
  Divider,
  Sheet,
  Skeleton,
  Stack,
  Typography
} from "@mui/joy"
import {Flight, Landscape, Speed} from "@mui/icons-material"
import {knotsToMph} from "@/lib/helpers"
import {useSelectedAircraft} from "@/lib/providers/SelectedAircraftContext"
import FlightInfoBlock from "@/components/DetailsPopover/FlightInfoBlock"

const DetailsPopover: FC = () => {
  const {selectedAircraft} = useSelectedAircraft()
  const {
    altitudeFt,
    groundSpeedMph,
    climbRateFpm,
    category,
    airports,
    owner,
    flightNumber,
    images,
    description,
    callsign
  } = selectedAircraft ?? {}

  const routeDescription = (() => {
    if (!airports) return null
    const {departure, diversion, arrival} = airports
    const destination = diversion ?? arrival

    return `${departure.city} (${departure.iata}) → ${destination.city} (${destination.iata})`
  })()

  if (!selectedAircraft) return null

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
        overflowY: "auto"
      })}
    >
      <Stack mb={2} position="relative">
        <AspectRatio sx={{minWidth: 200, overflow: "none", m: -2, mb: 0}}>
          {images === undefined ? (
            <Skeleton variant="rectangular" />
          ) : images.length === 0 ? (
            <Box sx={{bg: "background.level1"}}>
              <Typography>No image available</Typography>
            </Box>
          ) : (
            <img
              src={images[0].src ?? undefined}
              alt=""
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%"
              }}
            />
          )}
        </AspectRatio>

        {images?.at(0)?.attribution ? (
          <Typography
            level="body-xs"
            fontStyle="italic"
            position="absolute"
            alignSelf="center"
            px={1}
            top={-18}
            sx={{bgcolor: "rgb(0 0 0 / 50%)", color: "white"}}
          >
            {images[0].attribution}
          </Typography>
        ) : null}
      </Stack>

      <Typography level="body-xs">
        {[
          flightNumber || callsign,
          owner?.airlineName ||
            owner?.registeredOwner ||
            "No operator information"
        ].join(" – ")}
      </Typography>
      <Typography level="title-lg">{description}</Typography>
      {routeDescription ? (
        <Typography level="body-md">{routeDescription}</Typography>
      ) : null}

      <Divider sx={{my: 2}} />

      {altitudeFt !== undefined ? (
        <Typography startDecorator={<Landscape fontSize="small" />}>
          {altitudeFt === "ground" ? "On ground" : `${altitudeFt} ft`}
          {climbRateFpm !== undefined ? ` (${climbRateFpm} fpm)` : null}
        </Typography>
      ) : null}

      {groundSpeedMph !== undefined ? (
        <Typography startDecorator={<Speed fontSize="small" />}>
          {`${Math.round(knotsToMph(groundSpeedMph))} mph`}
        </Typography>
      ) : null}

      {category ? (
        <Typography startDecorator={<Flight fontSize="small" />}>
          {`${category.code} – ${category.description || "Unknown category"}`}
        </Typography>
      ) : null}

      {airports ? (
        <>
          <Divider sx={{my: 2}} />
          <FlightInfoBlock />
        </>
      ) : null}
    </Sheet>
  )
}

export default DetailsPopover
