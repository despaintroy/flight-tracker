import {FC} from "react"
import {Stack, Step, StepIndicator, Stepper, Typography} from "@mui/joy"
import {Check, ChevronRight} from "@mui/icons-material"
import {
  NormalizedAirport,
  useSelectedAircraft
} from "@/lib/providers/SelectedAircraftContext"
import ScheduledTimesPresentation from "@/components/ScheduledTimesPresentation"

const HOUR_MS = 1000 * 60 * 60
const MINUTE_MS = 1000 * 60

// Formats distance between now and the given date in hours and minutes
const formatHoursMinutesToNow = (date: string) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMs = Math.abs(targetDate.getTime() - now.getTime())

  const hours = Math.floor(diffInMs / HOUR_MS)
  const minutes = Math.floor((diffInMs % HOUR_MS) / MINUTE_MS)

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`
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

type StatusStepperProps = {
  departure: NormalizedAirport
  destination: NormalizedAirport
}

const StatusStepper: FC<StatusStepperProps> = (props) => {
  const {departure, destination} = props

  return (
    <Stepper orientation="vertical" size="sm" sx={{mt: 2}}>
      {/* LEAVING GATE */}
      {(() => {
        const times = departure.gateTimes
        const didDepart = times?.estimatedIsActual

        const isInFuture =
          !!times?.estimated &&
          !didDepart &&
          new Date(times.estimated).getTime() > Date.now()

        const label = didDepart
          ? "Departed Gate"
          : isInFuture
            ? `Departing in ${formatHoursMinutesToNow(times.estimated!)}`
            : "Departing Gate Now"

        return (
          <Step
            indicator={
              <StepIndicator
                variant="solid"
                color={didDepart ? "primary" : "neutral"}
              >
                {didDepart ? <Check /> : null}
              </StepIndicator>
            }
          >
            <Typography>{label}</Typography>
            <ScheduledTimesPresentation times={times} />
          </Step>
        )
      })()}

      {/* TAKING OFF */}
      {(() => {
        const times = departure.runwayTimes
        const didTakeOff = times?.estimatedIsActual

        const isInFuture =
          !!times?.estimated &&
          !didTakeOff &&
          new Date(times.estimated).getTime() > Date.now()

        const label = didTakeOff
          ? "Took Off"
          : isInFuture
            ? `Taking off in ${formatHoursMinutesToNow(times.estimated!)}`
            : "Taking Off Now"

        return (
          <Step
            indicator={
              <StepIndicator
                variant="solid"
                color={didTakeOff ? "primary" : "neutral"}
              >
                {didTakeOff ? <Check /> : null}
              </StepIndicator>
            }
          >
            <Typography>{label}</Typography>
            <ScheduledTimesPresentation times={times} />
          </Step>
        )
      })()}

      {/* LANDING */}
      {(() => {
        const times = destination.runwayTimes
        const didLand = times?.estimatedIsActual

        const isInFuture =
          !!times?.estimated &&
          !didLand &&
          new Date(times.estimated).getTime() > Date.now()

        const label = didLand
          ? "Landed"
          : isInFuture
            ? `Landing in ${formatHoursMinutesToNow(times.estimated!)}`
            : "Landing Now"

        return (
          <Step
            indicator={
              <StepIndicator
                variant="solid"
                color={didLand ? "primary" : "neutral"}
              >
                {didLand ? <Check /> : null}
              </StepIndicator>
            }
          >
            <Typography>{label}</Typography>
            <ScheduledTimesPresentation times={times} />
          </Step>
        )
      })()}

      {/* ARRIVING AT GATE */}
      {(() => {
        const times = destination.gateTimes
        const didArrive = times?.estimatedIsActual

        const isInFuture =
          !!times?.estimated &&
          !didArrive &&
          new Date(times.estimated).getTime() > Date.now()

        const label = didArrive
          ? "Arrived at Gate"
          : isInFuture
            ? `Arriving at Gate in ${formatHoursMinutesToNow(times.estimated!)}`
            : "Arriving at Gate Now"

        return (
          <Step
            indicator={
              <StepIndicator
                variant="solid"
                color={didArrive ? "primary" : "neutral"}
              >
                {didArrive ? <Check /> : null}
              </StepIndicator>
            }
          >
            <Typography>{label}</Typography>
            <ScheduledTimesPresentation times={times} />
          </Step>
        )
      })()}
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
