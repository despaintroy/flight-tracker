import {FC} from "react"
import {Stack, Typography} from "@mui/joy"
import {ChevronRight} from "@mui/icons-material"
import {
  NormalizedAirport,
  useSelectedAircraft
} from "@/lib/providers/SelectedAircraftContext"
import {format} from "date-fns"

const formatTime = (time: string) => {
  const date = new Date(time.slice(0, 16))
  return format(date, "h:mm aa")
}

enum DelayStatus {
  ON_TIME = "On Time",
  DELAYED = "Delayed",
  EARLY = "Early"
}

type AirportInfoProps = {
  airport: NormalizedAirport
  type: "departure" | "arrival"
}

const AirportInfo: FC<AirportInfoProps> = (props) => {
  const {type, airport} = props
  const {gate, terminal, iata, city, baggage, gateTimes} = airport

  const delayStatus = (() => {
    if (!gateTimes?.scheduled || !gateTimes.estimated)
      return DelayStatus.ON_TIME
    if (gateTimes.estimated < gateTimes.scheduled) return DelayStatus.EARLY
    if (gateTimes.estimated > gateTimes.scheduled) return DelayStatus.DELAYED
    return DelayStatus.ON_TIME
  })()

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

      <Stack
        direction="row"
        justifyContent={type === "departure" ? "flex-start" : "flex-end"}
        gap={1}
        mb={1}
      >
        {gateTimes?.scheduled &&
        (delayStatus !== DelayStatus.ON_TIME || !gateTimes?.estimated) ? (
          <Typography
            sx={{color: "neutral.plainDisabledColor"}}
            lineHeight={1.2}
            noWrap
            style={{
              textDecoration: gateTimes.estimated ? "line-through" : undefined
            }}
          >
            {formatTime(gateTimes.scheduled)}
          </Typography>
        ) : null}
        {gateTimes?.estimated ? (
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
            {formatTime(gateTimes.estimated)}
          </Typography>
        ) : null}
      </Stack>

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

const FlightInfoBlock: FC = () => {
  const airports = useSelectedAircraft().selectedAircraft?.airports
  if (!airports) return null

  const {departure} = airports
  const destination = airports.diversion ?? airports.arrival

  return (
    <Stack direction="row">
      <AirportInfo airport={departure} type="departure" />
      <ChevronRight sx={{fontSize: 36, marginTop: 1}} />
      <AirportInfo airport={destination} type="arrival" />
    </Stack>
  )
}

export default FlightInfoBlock
