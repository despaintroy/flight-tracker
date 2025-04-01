import {ScheduledTimes} from "@/lib/providers/SelectedAircraftContext"
import {Stack, Typography} from "@mui/joy"
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

type ScheduledTimesPresentationProps = {
  times: ScheduledTimes | undefined
  rightAligned?: boolean
}

const ScheduledTimesPresentation = (props: ScheduledTimesPresentationProps) => {
  const {times, rightAligned} = props
  const {scheduled, estimated, estimatedIsActual} = times ?? {}

  const delayStatus = (() => {
    if (!scheduled || !estimated) return DelayStatus.ON_TIME
    if (estimated < scheduled) return DelayStatus.EARLY
    if (estimated > scheduled) return DelayStatus.DELAYED
    return DelayStatus.ON_TIME
  })()

  const hasBothTimes = !!scheduled && !!estimated
  const areSameTime = scheduled && scheduled === estimated

  if (!hasBothTimes) {
    const time = estimated || scheduled

    return (
      <Typography
        sx={{color: "neutral.plainDisabledColor"}}
        textAlign={rightAligned ? "right" : "left"}
        lineHeight={1.2}
        noWrap
      >
        {time ? formatTime(time) : "No time info"}
      </Typography>
    )
  }

  return (
    <Stack
      direction="row"
      gap={1}
      mb={1}
      justifyContent={rightAligned ? "flex-end" : "flex-start"}
    >
      {!areSameTime ? (
        <Typography
          sx={{
            color: "neutral.plainDisabledColor",
            textDecoration: "line-through"
          }}
          lineHeight={1.2}
          noWrap
        >
          {formatTime(scheduled)}
        </Typography>
      ) : null}

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
        {formatTime(estimated)}
      </Typography>
    </Stack>
  )
}

export default ScheduledTimesPresentation
