"use client"

import {FC, useEffect} from "react"
import {useColorScheme} from "@mui/joy"

const ColorScheme: FC = () => {
  const {setMode} = useColorScheme()

  useEffect(() => setMode("dark"), [setMode])

  return null
}

export default ColorScheme
