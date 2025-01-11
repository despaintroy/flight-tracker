export const knotsToMph = (knots: number) => knots * 1.15078

export const safeJSONParse = (json: string): unknown => {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}
