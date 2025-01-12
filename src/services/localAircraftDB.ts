"use client"

import {z} from "zod"
import {safeJSONParse} from "@/lib/helpers"

const INDEX_STORAGE_KEY = "localAircraftDBIndex"
const MAX_HISTORY_MS = 1000 * 60 * 5 // 5 minutes
const STALE_TIME_MS = 1000 * 60 * 2 // 2 minutes

const makeHexKey = (hex: string) => `hex-history:${hex}`

const indexSchema = z.record(z.string(), z.number()) // hex -> timestamp

const historyItemSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  alt_baro: z.union([z.number(), z.literal("ground")]).optional(),
  time: z.number()
})

export type HistoryItem = z.infer<typeof historyItemSchema>

const historyItemsSchema = z.array(historyItemSchema)

const getIndex = () => {
  const indexString = localStorage.getItem(INDEX_STORAGE_KEY)
  if (!indexString) return {}
  return indexSchema.catch({}).parse(safeJSONParse(indexString))
}

const updateIndex = (hex: string, timestamp: number) => {
  const index = getIndex()
  index[hex] = timestamp
  localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(index))
}

const getHistory = (hex: string) => {
  const key = makeHexKey(hex)
  const historyString = localStorage.getItem(key)
  if (!historyString) return []
  return historyItemsSchema.catch([]).parse(safeJSONParse(historyString))
}

const getHistories = (hexes: string[]): Record<string, HistoryItem[]> => {
  return Object.fromEntries(hexes.map((hex) => [hex, getHistory(hex)]))
}

const listHexes = () => Object.keys(getIndex())

const addHistoryItems = (hex: string, newHistoryItems: HistoryItem[]) => {
  if (newHistoryItems.length === 0) return

  const sorted = newHistoryItems.sort((a, b) => a.time - b.time)
  let history = getHistory(hex)

  const currentTime = Date.now()
  const oldestAllowedTime = currentTime - MAX_HISTORY_MS

  if (history.at(0)?.time ?? currentTime > oldestAllowedTime) {
    const cutoffIndex = history.findIndex(({time}) => time > oldestAllowedTime)
    history = history.slice(cutoffIndex)
  }

  const mostRecentStoredTime = history.at(-1)?.time ?? 0
  const sortedCutoffIndex = sorted.findIndex(
    ({time}) => time > mostRecentStoredTime
  )
  const newHistory = history.concat(sorted.slice(sortedCutoffIndex))

  localStorage.setItem(makeHexKey(hex), JSON.stringify(newHistory))
  updateIndex(hex, newHistory.at(-1)?.time ?? 0)
}

const bulkAddHistoryItems = (hexes: Record<string, HistoryItem[]>) => {
  Object.entries(hexes).forEach(([hex, historyItems]) =>
    addHistoryItems(hex, historyItems)
  )
}

const clearStaleHistories = (lastEntryBeforeTime: number) => {
  const index = getIndex()
  const hexesToDelete = Object.entries(index)
    .filter(([, timestamp]) => timestamp < lastEntryBeforeTime)
    .map(([hex]) => hex)

  hexesToDelete.forEach((hex) => {
    localStorage.removeItem(makeHexKey(hex))
    delete index[hex]
  })

  localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(index))
}

setInterval(
  () => {
    const staleTime = Date.now() - STALE_TIME_MS
    clearStaleHistories(staleTime)
  },
  1000 * 60 // every minute
)

const LOCAL_AIRCRAFT_DB = {
  listHexes,
  getHistory,
  getHistories,
  addHistoryItems,
  bulkAddHistoryItems
}

export default LOCAL_AIRCRAFT_DB
