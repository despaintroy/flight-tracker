"use server"

import fs from "fs"
import path from "path"
import {parse} from "csv-parse"
import {z} from "zod"

const aircraftTypeSchema = z.object({
  aircraftType: z.string(),
  class: z.string(),
  engines: z.string(),
  manufacturerModel: z.string()
})

export type AircraftType = z.infer<typeof aircraftTypeSchema>

function normalizeValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
}

export async function searchTypes(
  query: string,
  limit: number = 10
): Promise<AircraftType[]> {
  return new Promise((resolve, reject) => {
    const csvFilePath = path.resolve("./public/icao_list.csv")
    const normalizedQuery = normalizeValue(query)
    const results: AircraftType[] = []

    const stream = fs
      .createReadStream(csvFilePath)
      .pipe(parse({columns: true, trim: true, skipEmptyLines: true}))

    // Open the CSV file and parse it
    stream
      .on("data", (row) => {
        const parsedRow = aircraftTypeSchema.safeParse(row)
        if (!parsedRow.success) {
          console.error("Invalid row:", row)
          return
        }

        const {aircraftType, manufacturerModel} = parsedRow.data
        const fieldsToSearch = [
          normalizeValue(aircraftType),
          normalizeValue(manufacturerModel)
        ]

        if (fieldsToSearch.some((value) => value.includes(normalizedQuery)))
          results.push(parsedRow.data)

        if (results.length >= limit) stream.destroy()
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error))
  })
}
