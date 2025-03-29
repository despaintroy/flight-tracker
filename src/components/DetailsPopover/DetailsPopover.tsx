import {FC, useEffect} from "react"
import {AircraftData, CATEGORY_DESCRIPTIONS} from "@/services/adsbTypes"
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
import wikipedia from "wikipedia"
import {
  useFlightStatsSearch,
  useFlightStatsTracker,
  usePhotos
} from "@/services/serviceHooks"
import FlightInfoBlock from "@/components/DetailsPopover/FlightInfoBlock"

type DetailsPopoverProps = {
  aircraft: AircraftData | null
}

const DetailsPopover: FC<DetailsPopoverProps> = (props) => {
  const {aircraft} = props
  const {data: images, isLoading: isLoadingImages} = usePhotos({
    hex: aircraft?.hex,
    icaoType: aircraft?.t,
    description: aircraft?.desc
  })
  const {data: flightStatsTracker} = useFlightStatsTracker({
    callsign: aircraft?.flight ?? undefined,
    hex: aircraft?.hex ?? undefined
  })
  const {data: flightStatsSearch, isLoading: isLoadingFlightStatsSearchResult} =
    useFlightStatsSearch({
      search: aircraft?.flight ?? undefined
    })
  const flightStatsSearchResult = flightStatsSearch?.at(0)?._source

  useEffect(() => {
    if (flightStatsTracker)
      console.debug("[flight-stats-tracker]", flightStatsTracker)
  }, [flightStatsTracker])

  useEffect(() => {
    if (flightStatsSearch)
      console.debug("[flight-stats-search]", flightStatsSearch)
  }, [flightStatsSearch])

  useEffect(() => {
    if (aircraft) console.debug("[aircraft-data]", aircraft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aircraft?.hex])

  useEffect(() => {
    if (!aircraft?.desc) return

    wikipedia
      .search(aircraft.desc)
      .then((results) => results.results[0].title)
      .then((title) => wikipedia.infobox(title))
  }, [aircraft?.desc])

  if (!aircraft) return null

  const image = images?.at(0)

  const routeDescription = (() => {
    if (!flightStatsSearchResult) return null
    const {
      departureAirportCity,
      departureAirport,
      arrivalAirportCity,
      arrivalAirport
    } = flightStatsSearchResult

    return `${departureAirportCity} (${departureAirport}) → ${arrivalAirportCity} (${arrivalAirport})`
  })()

  const flightNumberDisplay = (() => {
    if (isLoadingFlightStatsSearchResult) return "–"

    const carrierString = [
      flightStatsSearchResult?.carrier ?? "",
      flightStatsSearchResult?.flightNumber ?? ""
    ].join("")
    return carrierString || aircraft.flight?.trim()
  })()

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
          {isLoadingImages ? (
            <Skeleton variant="rectangular" />
          ) : !image ? (
            <Box sx={{bg: "background.level1"}}>
              <Typography>No image available</Typography>
            </Box>
          ) : (
            <img
              src={image.src ?? undefined}
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
        {[
          flightNumberDisplay,
          isLoadingFlightStatsSearchResult
            ? null
            : flightStatsSearchResult?.carrierName || aircraft.ownOp
        ]
          .filter(Boolean)
          .join(" – ") || "No operator information"}
      </Typography>
      <Typography level="title-lg">
        {aircraft.desc ||
          flightStatsTracker?.additionalFlightInfo?.equipment?.name ||
          aircraft.t ||
          "Unknown type"}
      </Typography>
      {routeDescription ? (
        <Typography level="body-md">{routeDescription}</Typography>
      ) : null}

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

      {aircraft.category ? (
        <Typography startDecorator={<Flight fontSize="small" />}>
          {aircraft.category}
          {" – "}
          {CATEGORY_DESCRIPTIONS.get(aircraft.category) ?? "Unknown category"}
        </Typography>
      ) : null}

      {flightStatsTracker ? (
        <>
          <Divider sx={{my: 2}} />
          <FlightInfoBlock flightStats={flightStatsTracker} />
        </>
      ) : null}
    </Sheet>
  )
}

export default DetailsPopover
