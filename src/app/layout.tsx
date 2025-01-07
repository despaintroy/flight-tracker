import "./globals.css"
import * as React from "react"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import {Metadata} from "next"
import {ToastProvider} from "@/lib/providers/ToastContext"

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
          <ToastProvider>{children}</ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
