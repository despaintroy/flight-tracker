"use client"

import {FC, useEffect} from "react"
import {useColorScheme} from "@mui/joy"

const ColorScheme: FC = () => {
  const {mode, setMode, systemMode} = useColorScheme()

  console.log({mode, systemMode})

  useEffect(() => {
    setMode("system")
  }, [setMode])

  return null
}

export default ColorScheme
