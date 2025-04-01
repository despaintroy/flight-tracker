import {FC} from "react"
import {Stack, Step, StepIndicator, Stepper, Typography} from "@mui/joy"
import {Check, ChevronRight} from "@mui/icons-material"
import {
  NormalizedAirport,
  ScheduledTimes,
  useSelectedAircraft
} from "@/lib/providers/SelectedAircraftContext"
import ScheduledTimesPresentation from "@/components/ScheduledTimesPresentation"

const HOUR_MS = 1000 * 60 * 60
const MINUTE_MS = 1000 * 60

// Formats distance between now and the given date in hours and minutes
const formatHoursMinutesToNow = (date: string) => {
  const now = Date.now()
  const targetDate = new Date(date)
  const diffInMs = targetDate.getTime() - now
  const absDiffInMs = Math.abs(diffInMs)

  const hours = Math.floor(absDiffInMs / HOUR_MS)
  const minutes = Math.floor((absDiffInMs % HOUR_MS) / MINUTE_MS)

  const formattedString = hours ? `${hours}h ${minutes}m` : `${minutes}m`

  return {
    formattedString,
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

      <ScheduledTimesPresentation
        times={gateTimes}
        rightAligned={type === "arrival"}
      />

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
      <Typography>{label}</Typography>
      <ScheduledTimesPresentation times={times} />
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
