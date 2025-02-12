import {
  Airport,
  EstimatedActualTime,
  FlightStatsTrackerData,
  ScheduleTimes
} from "@/services/flightStats.types"
import {FC} from "react"
import {FlightLand, FlightTakeoff, Luggage} from "@mui/icons-material"
import {Typography} from "@mui/joy"

const formatTime = (time: ScheduleTimes | EstimatedActualTime) => {
  return `${time.time} ${time.ampm.toLowerCase()}`
}

type AirportTimesProps = {
  airport: Airport
}

const AirportTimes: FC<AirportTimesProps> = (props) => {
  const {times, gate, terminal} = props.airport

  const isSame = times.scheduled.time24 === times.estimatedActual.time24
  const isDelayed = times.estimatedActual.time24 > times.scheduled.time24
  const isActual = times.estimatedActual.title === "Actual"

  if (isSame) {
    return (
      <>
        <Typography mr={1}>
          Terminal {terminal ?? "–"} Gate {gate ?? "–"}
        </Typography>
        <Typography
          sx={(theme) => ({
            color: theme.palette.success.plainColor
          })}
        >
          {formatTime(times.estimatedActual)}
          {isActual ? null : " (est)"}
        </Typography>
      </>
    )
  }

  return (
    <>
      <Typography mr={1}>
        Terminal {terminal ?? "–"} Gate {gate ?? "–"}
      </Typography>
      <Typography
        mr={1}
        sx={(theme) => ({
          color: theme.palette.neutral.plainDisabledColor
        })}
      >
        <s>{formatTime(times.scheduled)}</s>
      </Typography>
      <Typography
        sx={(theme) => ({
          color: isDelayed
            ? theme.palette.danger.plainColor
            : theme.palette.success.plainColor
        })}
      >
        {formatTime(times.estimatedActual)} {isActual ? null : " (est)"}
      </Typography>
    </>
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
    <>
      <Typography startDecorator={<FlightTakeoff fontSize="small" />}>
        <AirportTimes airport={departureAirport} />
      </Typography>
      <Typography startDecorator={<FlightLand fontSize="small" />}>
        <AirportTimes airport={arrivalAirport} />
      </Typography>
      <Typography startDecorator={<Luggage fontSize="small" />}>
        Carousel {arrivalAirport.baggage}
      </Typography>
    </>
  )
}

export default FlightInfoBlock
