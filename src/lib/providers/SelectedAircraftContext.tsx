"use client"

import {createContext, FC, PropsWithChildren, useContext, useState} from "react"

export type NormalizedAircraftData = {}

type SelectedAircraftContextType = {
  selectedAircraft: NormalizedAircraftData | null
  selectedHex: string | null
  setSelectedHex: (hex: string | null) => void
}

const SelectedAircraftContext = createContext<SelectedAircraftContextType>({
  selectedAircraft: null,
  selectedHex: null,
  setSelectedHex: () => {}
})

const SelectedAircraftProvider: FC<PropsWithChildren> = (props) => {
  const [selectedHex, setSelectedHex] = useState<string | null>(null)
  const [selectedAircraft, setSelectedAircraft] =
    useState<NormalizedAircraftData | null>(null)

  return (
    <SelectedAircraftContext.Provider
      value={{setSelectedHex, selectedHex, selectedAircraft}}
    >
      {props.children}
    </SelectedAircraftContext.Provider>
  )
}

export const useSelectedAircraft = () => {
  return useContext(SelectedAircraftContext)
}

export default SelectedAircraftProvider
