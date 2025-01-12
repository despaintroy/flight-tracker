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
        <link rel="manifest" href="manifest.json" />
        <meta name="theme-color" content="#292929" />
        <title>Flight Tracker</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
