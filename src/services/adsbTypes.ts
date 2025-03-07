// https://airplanes.live/rest-api-adsb-data-field-descriptions/

export const CATEGORY_DESCRIPTIONS = new Map([
  ["A0", "No ADS-B emitter category information"],
  ["A1", "Light"],
  ["A2", "Small"],
  ["A3", "Large"],
  ["A4", "Large high vortex"],
  ["A5", "Heavy"],
  ["A6", "High performance"],
  ["A7", "Rotorcraft"],
  ["B0", "No ADS-B emitter category information"],
  ["B1", "Glider / sailplane"],
  ["B2", "Lighter-than-air"],
  ["B3", "Parachutist / skydiver"],
  ["B4", "Ultralight / hang-glider / paraglider"],
  ["B5", "Reserved"],
  ["B6", "Unmanned aerial vehicle"],
  ["B7", "Space / trans-atmospheric vehicle"],
  ["C0", "No ADS-B emitter category information"],
  ["C1", "Surface vehicle (emergency vehicle)"],
  ["C2", "Surface vehicle (service vehicle)"],
  ["C3", "Point obstacle (includes tethered balloons)"],
  ["C4", "Cluster obstacle"],
  ["C5", "Line obstacle"],
  ["C6", "Reserved"],
  ["C7", "Reserved"]
])

/**
 * Represents an aircraft's ADS-B data.
 */
export type AircraftData = {
  /**
   * The 24-bit ICAO identifier of the aircraft, as 6 hex digits.
   * May start with '~' indicating a non-ICAO address (e.g., from TIS-B).
   */
  hex: string

  /**
   * Aircraft registration pulled from the database.
   */
  r?: string

  /**
   * Aircraft type pulled from the database.
   */
  t?: string

  /**
   * Bitfield for certain database flags:
   * - military = dbFlags & 1;
   * - interesting = dbFlags & 2;
   * - PIA = dbFlags & 4;
   * - LADD = dbFlags & 8;
   */
  dbFlags?: number

  /**
   * Type of underlying messages / best source of current data for this position / aircraft.
   * Possible values include:
   * - 'adsb_icao'
   * - 'adsb_icao_nt'
   * - 'adsr_icao'
   * - 'tisb_icao'
   * - 'adsc'
   * - 'mlat'
   * - 'other'
   * - 'mode_s'
   * - 'adsb_other'
   * - 'adsr_other'
   * - 'tisb_other'
   * - 'tisb_trackfile'
   */
  type?: string

  /**
   * Callsign, the flight name or aircraft registration as 8 characters.
   */
  flight?: string

  /**
   * The aircraft barometric altitude in feet as a number OR 'ground' as a string.
   */
  alt_baro?: number | "ground"

  /**
   * Geometric (GNSS / INS) altitude in feet referenced to the WGS84 ellipsoid.
   */
  alt_geom?: number

  /**
   * Ground speed in knots.
   */
  gs?: number

  /**
   * Indicated air speed in knots.
   */
  ias?: number

  /**
   * True air speed in knots.
   */
  tas?: number

  /**
   * Mach number.
   */
  mach?: number

  /**
   * Rate of change of track, degrees/second.
   */
  track_rate?: number

  /**
   * Roll, degrees, negative is left roll.
   */
  roll?: number

  /**
   * Heading, degrees clockwise from magnetic north.
   */
  mag_heading?: number

  /**
   * Heading, degrees clockwise from true north.
   * Usually only transmitted on ground; in the air, usually derived from the magnetic heading using magnetic model WMM2020.
   */
  true_heading?: number

  /**
   * Rate of change of barometric altitude, feet/minute.
   */
  baro_rate?: number

  /**
   * Rate of change of geometric (GNSS / INS) altitude, feet/minute.
   */
  geom_rate?: number

  /**
   * Mode A code (Squawk), encoded as 4 octal digits.
   */
  squawk?: string

  /**
   * ADS-B emergency/priority status, a superset of the 7×00 squawks.
   * Possible values: 'none', 'general', 'lifeguard', 'minfuel', 'nordo', 'unlawful', 'downed', 'reserved'.
   */
  emergency?: string

  /**
   * Emitter category to identify particular aircraft or vehicle classes (values A0 – D7).
   */
  category?: string

  /**
   * Altimeter setting (QFE or QNH/QNE), hPa.
   */
  nav_qnh?: number

  /**
   * Selected altitude from the Mode Control Panel / Flight Control Unit (MCP/FCU) or equivalent equipment.
   */
  nav_altitude_mcp?: number

  /**
   * Selected altitude from the Flight Management System.
   */
  nav_altitude_fms?: number

  /**
   * Selected heading (True or Magnetic is not defined in DO-260B, mostly Magnetic as that is the de facto standard)
   */
  nav_heading?: number

  /**
   * Set of engaged automation modes.
   * Possible values include:
   * - 'autopilot'
   * - 'vnav'
   * - 'althold'
   * - 'approach'
   * - 'lnav'
   * - 'tcas'
   */
  nav_modes?: string[]

  /**
   * Latitude of the last known position.
   */
  lat: number

  /**
   * Longitude of the last known position.
   */
  lon: number

  /**
   * Navigation Integrity Category.
   */
  nic?: number

  /**
   * Radius of Containment, meters; a measure of position integrity derived from NIC & supplementary bits.
   */
  rc?: number

  /**
   * Time since the last position was seen, in seconds.
   */
  seen_pos: number

  /**
   * True track over ground in degrees (0-359).
   */
  track?: number

  /**
   * ADS-B Version Number 0, 1, 2 (3-7 are reserved).
   */
  version?: number

  /**
   * Navigation Integrity Category for Barometric Altitude
   */
  nic_baro?: number

  /**
   * Navigation Accuracy for Position
   */
  nac_p?: number

  /**
   * Navigation Accuracy for Velocity
   */
  nac_v?: number

  /**
   * Source Integrity Level
   */
  sil?: number

  /**
   * interpretation of SIL: unknown, perhour, persample
   */
  sil_type?: string

  /**
   * Geometric Vertical Accuracy
   */
  gva?: number

  /**
   * System Design Assurance
   */
  sda?: number

  /**
   * List of fields derived from MLAT data
   */
  mlat?: string[]

  /**
   * List of fields derived from TIS-B data
   */
  tisb?: string[]

  /**
   * Total number of Mode S messages processed (arbitrary)
   */
  messages?: number

  /**
   * How long ago (in seconds before “now”) a message was last received from this aircraft
   */
  seen?: number

  /**
   * Recent average RSSI (signal power), in dbFS; this will always be negative.
   */
  rssi?: number

  /**
   * Flight status alert bit
   */
  alert?: 0 | 1

  /**
   * Flight status special position identification bit
   */
  spi?: 0 | 1

  /**
   * Wind direction calculated from ground track, true heading, true airspeed and ground speed
   */
  wd?: number

  /**
   * Wind speed calculated from ground track, true heading, true airspeed and ground speed
   */
  ws?: number

  /**
   * outer/static air temperature (C) calculated from mach number and true airspeed
   */
  oat?: number

  /**
   * Total air temperature (C) are calculated from mach number and true airspeed
   */
  tat?: number

  /**
   * Object containing the last known position when regular lat and lon are older than 60 seconds.
   * Provides the last position and shows the age for the last position.
   */
  lastPosition?: {
    /**
     * Latitude of the last known position.
     */
    lat: number

    /**
     * Longitude of the last known position.
     */
    lon: number

    /**
     * Navigation Integrity Category.
     */
    nic?: number

    /**
     * Radius of Containment, meters; a measure of position integrity derived from NIC & supplementary bits.
     */
    rc?: number

    /**
     * Time since the last position was seen, in seconds.
     */
    seen_pos: number
  }

  /**
   * Rough estimated latitude position for the aircraft based on the receiver’s estimated coordinates.
   * Used if no ADS-B or MLAT position is available.
   */
  rr_lat?: number

  /**
   * Rough estimated longitude position for the aircraft based on the receiver’s estimated coordinates.
   * Used if no ADS-B or MLAT position is available.
   */
  rr_lon?: number

  /**
   * Experimental field, subject to change.
   */
  acas_ra?: any

  /**
   * Experimental field indicating the timestamp before the aircraft lost GPS or experienced heavy degradation.
   * Displayed for 15 minutes after GPS is lost or degraded.
   */
  gpsOkBefore?: number

  // Undocumented fields
  recentReceiverIds?: string[]
  desc?: string
  year?: string
  ownOp?: string
  dir?: number
}

export type ADSBEndpointResponse = {
  /**
   * Array of aircraft data objects.
   */
  ac: AircraftData[]
  /**
   * Shows if there is an error, default is “No error”.
   */
  msg: string
  /**
   * The time this file was generated, in milliseconds since Jan 1 1970 00:00:00 GMT.
   */
  now: number
  /**
   * Total aircraft returned.
   */
  total: number
  /**
   * The time this file was cached, in milliseconds since Jan 1 1970 00:00:00 GMT.
   */
  ctime: number
  /**
   * The server processing time this request required in milliseconds.
   */
  ptime: number
}
