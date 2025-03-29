import {ADSBFetchType} from "@/lib/providers/AircraftHistoryContext"
import {AIRCRAFT_TYPE_INFO_MAP} from "@/services/aircraftTypeInfo"

export const knotsToMph = (knots: number) => knots * 1.15078

export const safeJSONParse = (json: string): unknown => {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const getFetchTypeLabel = (fetchType: ADSBFetchType): string | null => {
  switch (fetchType.type) {
    case "mil":
      return "Military"
    case "ladd":
      return "LADD"
    case "pia":
      return "PIA"
    case "hex":
      return `Hex: ${fetchType.hex}`
    case "callsign":
      return `Callsign: ${fetchType.callsign}`
    case "registration":
      return `Registration: ${fetchType.registration}`
    case "type":
      const info = AIRCRAFT_TYPE_INFO_MAP.get(fetchType.aircraftType)
      if (!info) return `Type: ${fetchType.aircraftType}`
      return `Type: ${info[4]} ${info[5]}`
    case "squawk":
      return `Squawk: ${fetchType.squawk}`
    default:
      return null
  }
}

export type DeepNullable<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? DeepNullable<U>[] | null
    : T[K] extends object
      ? DeepNullable<T[K]> | null
      : T[K] | null
}

export const generateRandomString = (length = 10) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
