import "./globals.css"
import "mapbox-gl/dist/mapbox-gl.css"
import * as React from "react"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import {Metadata} from "next"
import {ToastProvider} from "@/lib/providers/ToastContext"
import {AircraftHistoryProvider} from "@/lib/providers/AircraftHistoryContext"
import ColorScheme from "@/components/ColorScheme"

export const metadata: Metadata = {
  title: "Flight Tracker",
  authors: {name: "Troy DeSpain"},
  creator: "Troy DeSpain"
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="theme-color" content="#fff" />
      </head>

      <body>
        <ThemeRegistry>
          <ToastProvider>
            <ColorScheme />
            <AircraftHistoryProvider>{children}</AircraftHistoryProvider>
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
