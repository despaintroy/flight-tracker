import {FC} from "react"
import {Box, Stack, Step, StepIndicator, Stepper, Typography} from "@mui/joy"
import {Check, ChevronRight} from "@mui/icons-material"
import {
  NormalizedAirport,
  ScheduledTimes,
  useSelectedAircraft
} from "@/lib/providers/SelectedAircraftContext"
import ScheduledTimesPresentation from "@/components/ScheduledTimesPresentation"

const HOUR_MS = 1000 * 60 * 60
const MINUTE_MS = 1000 * 60

const differenceInHoursMinutes = (date1: string, date2: string) => {
  const ms1 = new Date(date1).getTime()
  const ms2 = new Date(date2).getTime()
  const diffInMs = ms1 - ms2
  const absDiffInMs = Math.abs(diffInMs)

  const hours = Math.floor(absDiffInMs / HOUR_MS)
  const minutes = Math.floor((absDiffInMs % HOUR_MS) / MINUTE_MS)
  return {hours, minutes, diffInMs}
}

const formatHoursMinutes = (hours: number, minutes: number) =>
  hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`

const formatHoursMinutesToNow = (date: string) => {
  const {hours, minutes, diffInMs} = differenceInHoursMinutes(
    date,
    new Date().toISOString()
  )

  return {
    formattedString: formatHoursMinutes(hours, minutes),
    isPast: diffInMs < 0,
    isZero: hours === 0 && minutes === 0
  }
}

type AirportInfoProps = {
  airport: NormalizedAirport
  type: "departure" | "arrival"
}

const AirportInfo: FC<AirportInfoProps> = (props) => {
  const {type, airport} = props
  const {gate, terminal, iata, city, baggage, gateTimes} = airport

  const gateLabel = (() => {
    if (!gate && !terminal) return "No gate info"
    if (terminal && !gate) return `Terminal ${terminal}`
    if (gate && !terminal) return `Gate ${gate}`
    return `Gate ${gate} (Terminal ${terminal})`
  })()

  return (
    <Stack sx={{flexGrow: 1}}>
      <Typography
        fontSize={24}
        fontWeight={800}
        textAlign={type === "departure" ? "left" : "right"}
        lineHeight={1.2}
      >
        {iata}
      </Typography>
      <Typography
        textAlign={type === "departure" ? "left" : "right"}
        level="body-sm"
      >
        {city}
      </Typography>

      <Box mb={1}>
        <ScheduledTimesPresentation
          times={gateTimes}
          rightAligned={type === "arrival"}
        />
      </Box>

      <Typography
        lineHeight={1.2}
        textAlign={type === "departure" ? "left" : "right"}
      >
        {gateLabel}
      </Typography>
      {baggage ? (
        <Typography
          lineHeight={1.2}
          textAlign={type === "departure" ? "left" : "right"}
        >
          Carousel {baggage}
        </Typography>
      ) : null}
    </Stack>
  )
}

type StepperStepProps = {
  times: ScheduledTimes | undefined
  pastLabel: string
  presentLabel: string
}

const StepperStep: FC<StepperStepProps> = (props) => {
  const {times, pastLabel, presentLabel} = props

  const time = times?.estimated || times?.scheduled
  const toNow = time ? formatHoursMinutesToNow(time) : null
  const isComplete = !!times?.estimatedIsActual

  const label = (() => {
    if (isComplete) return pastLabel
    if (!toNow) return presentLabel
    if (toNow.isZero || toNow.isPast) return `${presentLabel} Now`
    return `${presentLabel} in ${toNow?.formattedString}`
  })()

  const delayLabel = (() => {
    const delay =
      times?.estimated && times.scheduled
        ? differenceInHoursMinutes(times.estimated, times.scheduled)
        : null

    if (!delay) return null
    if (delay.hours === 0 && delay.minutes === 0) return "On Time"
    if (delay.diffInMs < 0)
      return `${formatHoursMinutes(delay.hours, delay.minutes)} ahead of schedule`
    return `${formatHoursMinutes(delay.hours, delay.minutes)} behind schedule`
  })()

  return (
    <Step
      indicator={
        <StepIndicator
          variant="solid"
          color={isComplete ? "primary" : "neutral"}
        >
          {isComplete ? <Check /> : null}
        </StepIndicator>
      }
    >
      <Typography lineHeight={1}>{label}</Typography>
      <Box mb={2}>
        <ScheduledTimesPresentation times={times} />
        {delayLabel ? (
          <Typography level="body-sm" lineHeight={1}>
            {delayLabel}
          </Typography>
        ) : null}
      </Box>
    </Step>
  )
}

type StatusStepperProps = {
  departure: NormalizedAirport
  destination: NormalizedAirport
}

const StatusStepper: FC<StatusStepperProps> = (props) => {
  const {departure, destination} = props

  return (
    <Stepper orientation="vertical" size="sm" sx={{mt: 2}}>
      <StepperStep
        times={departure.gateTimes}
        pastLabel="Departed Gate"
        presentLabel="Departing Gate"
      />

      <StepperStep
        times={departure.runwayTimes}
        pastLabel="Took Off"
        presentLabel="Taking Off"
      />

      <StepperStep
        times={destination.runwayTimes}
        pastLabel="Landed"
        presentLabel="Landing"
      />

      <StepperStep
        times={destination.gateTimes}
        pastLabel="Arrived at Gate"
        presentLabel="Arriving at Gate"
      />
    </Stepper>
  )
}

const FlightInfoBlock: FC = () => {
  const airports = useSelectedAircraft().selectedAircraft?.airports
  if (!airports) return null

  const {departure} = airports
  const destination = airports.diversion ?? airports.arrival

  return (
    <>
      <Stack direction="row">
        <AirportInfo airport={departure} type="departure" />
        <ChevronRight sx={{fontSize: 36, marginTop: 1}} />
        <AirportInfo airport={destination} type="arrival" />
      </Stack>
      <StatusStepper departure={departure} destination={destination} />
    </>
  )
}

export default FlightInfoBlock
