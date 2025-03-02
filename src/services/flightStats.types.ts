type FlightNote = {
  final: boolean
  canceled: boolean
  hasDepartedGate: boolean
  hasDepartedRunway: boolean
  landed: boolean
  message: string | null
  messageCode: string | null
  pastExpectedTakeOff: boolean
  tracking: boolean
  hasPositions: boolean
  trackingUnavailable: boolean
  phase: string
  hasActualRunwayDepartureTime: boolean
  hasActualGateDepartureTime: boolean
}

export type ScheduleTimes = {
  time: string
  ampm: string
  time24: string
  timezone: string
}

export type EstimatedActualTime = {
  title: "Actual" | "Estimated"
  time?: string
  ampm?: string
  time24?: string
  runway?: boolean
  timezone?: string
}

type GraphXAxis = {
  dep: string
  depUTC: string
  arr: string
  arrUTC: string
}

type StatusDelay = {
  departure: {minutes: number}
  arrival: {minutes: number}
}

type DelayStatus = {
  wording: string
  minutes: number
}

type Status = {
  statusCode: string
  status: string
  color: string
  statusDescription: string
  delay: StatusDelay
  delayStatus: DelayStatus
  lastUpdatedText: string
  diverted: boolean
}

type Carrier = {
  name: string
  fs: string
}

export type Airport = {
  fs: string
  iata: string
  name: string
  city: string
  state: string
  country: string
  timeZoneRegionName: string
  regionName: string
  gate: string
  terminal: string | null
  baggage?: string
  times: {
    scheduled: ScheduleTimes
    estimatedActual: EstimatedActualTime
  }
  date: string
}

type FlightResultHeader = {
  statusDescription: string
  carrier: Carrier
  flightNumber: string
  status: string
  diverted: boolean
  color: string
  departureAirportFS: string
  arrivalAirportFS: string
  divertedAirport: string | null
}

type TicketHeader = {
  carrier: Carrier
  flightNumber: string
}

type AdditionalFlightInfo = {
  equipment: {
    iata: string
    name: string
    title: string
  }
  flightDuration: string
}

type Codeshare = {
  fs: string
  name: string
  flightNumber: string
}

type Position = {
  lon: number
  lat: number
  speedMph: number
  altitudeFt: number
  source: string
  date: string
  course: number
  vrateMps?: number
  lastObserved?: string
}

type FlexTrack = {
  flightId: number
  carrierFsCode: string
  flightNumber: string
  tailNumber: string
  callsign: string
  departureAirportFsCode: string
  arrivalAirportFsCode: string
  departureDate: {dateUtc: string; dateLocal: string}
  equipment: string
  delayMinutes: number
  bearing: number
  heading: number
  positions: Position[]
  irregularOperations: any[]
  fleetAircraftId: number
}

type Positional = {
  departureAirportCode: string
  arrivalAirportCode: string
  divertedAirportCode: string | null
  flexFlightStatus: string
  flexTrack: FlexTrack
}

export type FlightStatsTrackerData = {
  flightId: number
  flightNote: FlightNote
  isTracking: boolean
  isLanded: boolean
  isScheduled: boolean
  sortTime: string
  schedule: {
    scheduledDeparture: string
    scheduledDepartureUTC: string
    estimatedActualDepartureRunway: boolean
    estimatedActualDepartureTitle: string
    estimatedActualDeparture: string
    estimatedActualDepartureUTC: string
    scheduledArrival: string
    scheduledArrivalUTC: string
    estimatedActualArrivalRunway: boolean
    estimatedActualArrivalTitle: string
    estimatedActualArrival: string
    estimatedActualArrivalUTC: string
    graphXAxis: GraphXAxis
    tookOff: string
  }
  status: Status
  resultHeader: FlightResultHeader
  ticketHeader: TicketHeader
  operatedBy: string | null
  departureAirport: Airport
  arrivalAirport: Airport
  divertedAirport: string | null
  additionalFlightInfo: AdditionalFlightInfo
  codeshares: Codeshare[]
  positional: Positional
  flightState: string
}

const foo = {
  flightId: 1299325789,
  flightNote: {
    final: false,
    canceled: false,
    hasDepartedGate: true,
    hasDepartedRunway: true,
    landed: false,
    message: null,
    messageCode: null,
    pastExpectedTakeOff: true,
    tracking: true,
    hasPositions: true,
    trackingUnavailable: false,
    phase: "Climbing",
    hasActualRunwayDepartureTime: true,
    hasActualGateDepartureTime: true
  },
  isTracking: true,
  isLanded: false,
  isScheduled: false,
  sortTime: "2025-02-12T01:10:00.000Z",
  schedule: {
    scheduledDeparture: "2025-02-11T17:10:00.000",
    scheduledDepartureUTC: "2025-02-12T01:10:00.000Z",
    estimatedActualDepartureRunway: false,
    estimatedActualDepartureTitle: "Actual",
    estimatedActualDeparture: "2025-02-11T17:02:00.000",
    estimatedActualDepartureUTC: "2025-02-12T01:02:00.000Z",
    scheduledArrival: "2025-02-11T20:03:00.000",
    scheduledArrivalUTC: "2025-02-12T03:03:00.000Z",
    estimatedActualArrivalRunway: false,
    estimatedActualArrivalTitle: "Estimated",
    estimatedActualArrival: "2025-02-11T19:45:00.000",
    estimatedActualArrivalUTC: "2025-02-12T02:45:00.000Z",
    graphXAxis: {
      dep: "2025-02-11T17:02:00.000",
      depUTC: "2025-02-12T01:02:00.000Z",
      arr: "2025-02-11T19:45:00.000",
      arrUTC: "2025-02-12T02:45:00.000Z"
    },
    tookOff: "2025-02-11T17:02:00.000"
  },
  status: {
    statusCode: "A",
    status: "Departed",
    color: "green",
    statusDescription: "On time",
    delay: {
      departure: {
        minutes: 0
      },
      arrival: {
        minutes: 0
      }
    },
    delayStatus: {
      wording: "On time",
      minutes: 0
    },
    lastUpdatedText: "Status Last Updated 8 Minutes Ago",
    diverted: false
  },
  resultHeader: {
    statusDescription: "On time",
    carrier: {
      name: "Delta Air Lines",
      fs: "DL"
    },
    flightNumber: "3933",
    status: "Departed",
    diverted: false,
    color: "green",
    departureAirportFS: "ONT",
    arrivalAirportFS: "SLC",
    divertedAirport: null
  },
  ticketHeader: {
    carrier: {
      name: "Delta Air Lines",
      fs: "DL"
    },
    flightNumber: "3933"
  },
  operatedBy: "Operated by SkyWest Airlines on behalf of Delta Air Lines",
  departureAirport: {
    fs: "ONT",
    iata: "ONT",
    name: "Ontario International Airport",
    city: "Ontario",
    state: "CA",
    country: "US",
    timeZoneRegionName: "America/Los_Angeles",
    regionName: "North America",
    gate: "208",
    terminal: "2",
    times: {
      scheduled: {
        time: "5:10",
        ampm: "PM",
        time24: "17:10",
        timezone: "PST"
      },
      estimatedActual: {
        title: "Actual",
        time: "5:02",
        ampm: "PM",
        time24: "17:02",
        runway: false,
        timezone: "PST"
      }
    },
    date: "2025-02-11T17:10:00.000"
  },
  arrivalAirport: {
    fs: "SLC",
    iata: "SLC",
    name: "Salt Lake City International Airport",
    city: "Salt Lake City",
    state: "UT",
    country: "US",
    timeZoneRegionName: "America/Denver",
    regionName: "North America",
    gate: "A34",
    terminal: null,
    baggage: "7",
    times: {
      scheduled: {
        time: "8:03",
        ampm: "PM",
        time24: "20:03",
        timezone: "MST"
      },
      estimatedActual: {
        title: "Estimated",
        time: "7:45",
        ampm: "PM",
        time24: "19:45",
        runway: false,
        timezone: "MST"
      }
    },
    date: "2025-02-11T20:03:00.000"
  },
  divertedAirport: null,
  additionalFlightInfo: {
    equipment: {
      iata: "E75",
      name: "Embraer 175",
      title: "Actual"
    },
    flightDuration: "1h 53m"
  },
  codeshares: [
    {
      fs: "AF",
      name: "Air France",
      flightNumber: "2495"
    },
    {
      fs: "KL",
      name: "KLM",
      flightNumber: "6736"
    }
  ],
  positional: {
    departureAirportCode: "ONT",
    arrivalAirportCode: "SLC",
    divertedAirportCode: null,
    flexFlightStatus: "A",
    flexTrack: {
      flightId: 1299325789,
      carrierFsCode: "OO",
      flightNumber: "3933",
      tailNumber: "N301SY",
      callsign: "SKW3933",
      departureAirportFsCode: "ONT",
      arrivalAirportFsCode: "SLC",
      departureDate: {
        dateUtc: "2025-02-12T01:10:00.000Z",
        dateLocal: "2025-02-11T17:10:00.000"
      },
      equipment: "E75",
      bearing: 30.70929653934235,
      heading: 52.86442599857018,
      positions: [
        {
          lon: -116.517995,
          lat: 35.076519,
          speedMph: 488,
          altitudeFt: 23254,
          source: "derived",
          date: "2025-02-12T01:40:01.967Z",
          course: 47,
          vrateMps: 6,
          lastObserved: "2025-02-12T01:16:54.406Z"
        },
        {
          lon: -117.599998,
          lat: 34.060001,
          speedMph: 168,
          altitudeFt: 922,
          source: "derived",
          date: "2025-02-12T01:21:00.000Z",
          course: 0,
          vrateMps: 0,
          lastObserved: "2025-02-12T01:16:54.406Z"
        }
      ],
      irregularOperations: [],
      fleetAircraftId: 440293
    }
  },
  flightState: "en-route"
}
