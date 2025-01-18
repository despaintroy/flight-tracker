import axios from "axios"
import {ADSBEndpointResponse} from "@/services/adsbTypes"

const BASE_URL = "https://api.airplanes.live/v2"

export namespace ADSB {
  type GetRadiusParams = {
    lat: number
    lon: number
    radius_nm: number
  }

  export const getRadius = async (
    params: GetRadiusParams
  ): Promise<ADSBEndpointResponse> => {
    const {lat, lon} = params
    const radius = Math.min(params.radius_nm, 250)
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/point/${lat}/${lon}/${radius}`
    )
    return response.data
  }

  export const getMilitary = async (): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/military`
    )
    return response.data
  }

  export const getLADD = async (): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(`${BASE_URL}/ladd`)
    return response.data
  }

  export const getPIA = async (): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(`${BASE_URL}/pia`)
    return response.data
  }

  export const getHex = async (hex: string): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/hex/${hex}`
    )
    return response.data
  }

  export const getCallsign = async (
    callsign: string
  ): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/callsign/${callsign}`
    )
    return response.data
  }

  export const getRegistration = async (
    registration: string
  ): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/reg/${registration}`
    )
    return response.data
  }

  export const getType = async (
    aircraftType: string
  ): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/type/${aircraftType}`
    )
    return response.data
  }

  export const getSquawk = async (
    squawk: string
  ): Promise<ADSBEndpointResponse> => {
    const response = await axios.get<ADSBEndpointResponse>(
      `${BASE_URL}/squawk/${squawk}`
    )
    return response.data
  }
}
