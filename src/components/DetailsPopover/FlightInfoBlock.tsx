import {
  Airport,
  EstimatedActualTime,
  FlightStatsTrackerData,
  ScheduleTimes
} from "@/services/flightStats.types"
import {FC} from "react"
import {Stack, Typography} from "@mui/joy"
import {ChevronRight} from "@mui/icons-material"

const formatTime = (time: ScheduleTimes | EstimatedActualTime) => {
  if (!time.time) return "–"
  return `${time.time} ${time.ampm?.toLowerCase() ?? ""}`
}

enum DelayStatus {
  ON_TIME = "On Time",
  DELAYED = "Delayed",
  EARLY = "Early"
}

type AirportInfoProps = {
  airport: Airport
}

const AirportInfo: FC<AirportInfoProps> = (props) => {
  const {times, gate, terminal, iata, city, state, baggage} = props.airport

  // const isSame = times.scheduled.time24 === times.estimatedActual.time24
  // const isDelayed = times.estimatedActual.time24 > times.scheduled.time24

  const delayStatus = (() => {
    const estimated = times.estimatedActual.time24
    const scheduled = times.scheduled.time24

    if (estimated === undefined) return DelayStatus.ON_TIME
    if (estimated < scheduled) return DelayStatus.EARLY
    if (estimated > scheduled) return DelayStatus.DELAYED
    return DelayStatus.ON_TIME
  })()

  const isActual = times.estimatedActual.title === "Actual"

  const gateLabel = (() => {
    if (!gate && !terminal) return "No gate info"
    if (terminal && !gate) return `Terminal ${terminal}`
    if (gate && !terminal) return `Gate ${gate}`
    return `Gate ${gate} (T-${terminal})`
  })()

  return (
    <Stack sx={{flexGrow: 1}}>
      <Typography
        fontSize={24}
        fontWeight={800}
        textAlign="center"
        lineHeight={1.2}
      >
        {iata}
      </Typography>
      <Typography textAlign="center" level="body-sm">
        {city}, {state}
      </Typography>

      <Stack direction="row" justifyContent="center" gap={1} mb={1}>
        {(delayStatus !== DelayStatus.ON_TIME ||
          !times.estimatedActual.time) && (
          <Typography
            sx={{color: "neutral.plainDisabledColor"}}
            lineHeight={1.2}
            noWrap
            style={{
              textDecoration: times.estimatedActual.time
                ? "line-through"
                : undefined
            }}
          >
            {times.scheduled.time}
          </Typography>
        )}
        {times.estimatedActual.time ? (
          <Typography
            sx={{
              color:
                delayStatus === DelayStatus.DELAYED
                  ? "danger.plainColor"
                  : "success.plainColor"
            }}
            lineHeight={1.2}
            noWrap
          >
            {formatTime(times.estimatedActual)}
          </Typography>
        ) : null}
      </Stack>

      <Typography lineHeight={1.2}>{gateLabel}</Typography>
      {baggage ? (
        <Typography lineHeight={1.2}>Carousel {baggage}</Typography>
      ) : null}
    </Stack>
  )
}

type FlightInfoBlockProps = {
  flightStats: FlightStatsTrackerData
}

const FlightInfoBlock: FC<FlightInfoBlockProps> = (props) => {
  const {flightStats} = props

  const departureAirport = flightStats.departureAirport
  const arrivalAirport = flightStats.arrivalAirport
  const divertedAirport = flightStats.divertedAirport

  return (
    <Stack direction="row">
      <AirportInfo airport={departureAirport} />
      <ChevronRight sx={{fontSize: 36, marginTop: 1}} />
      <AirportInfo airport={arrivalAirport} />
    </Stack>
  )
}

export default FlightInfoBlock
