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

export async function searchTypes(
  query: string,
  limit: number = 10
): Promise<AircraftType[]> {
  return new Promise((resolve, reject) => {
    const csvFilePath = path.resolve("./public/icao_list.csv")
    const results: AircraftType[] = []

    // Open the CSV file and parse it
    fs.createReadStream(csvFilePath)
      .pipe(parse({columns: true, trim: true, skipEmptyLines: true}))
      .on("data", (row) => {
        const parsedRow = aircraftTypeSchema.safeParse(row)

        const normalizeValue = (value: string) =>
          value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

        const match = (() => {
          if (!parsedRow.success) return false

          return [parsedRow.data.aircraftType, parsedRow.data.manufacturerModel]
            .map(normalizeValue)
            .some((value) => value.includes(normalizeValue(query)))
        })()

        if (parsedRow.success && match) results.push(parsedRow.data)
      })
      .on("end", () => resolve(results.slice(0, limit)))
      .on("error", (error) => reject(error))
  })
}
