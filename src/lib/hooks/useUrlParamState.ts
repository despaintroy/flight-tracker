import {useState} from "react"
import {z} from "zod"
import useDebounce from "@/lib/hooks/useDebounce"

type UseUrlParamState<T> = {
  key: string
  defaultValue: T
  schema: z.ZodType<T>
  debounce?: number
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  storeDefaultValue?: boolean
}

export const useUrlParamState = <T>({
  key,
  defaultValue,
  schema,
  serialize = (value) => JSON.stringify(value),
  deserialize = (value) => JSON.parse(value),
  debounce = 500,
  storeDefaultValue = false
}: UseUrlParamState<T>) => {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return defaultValue

    const urlParams = new URLSearchParams(window.location.search)
    const value = urlParams.get(key)
    if (!value) return defaultValue
    try {
      return schema.parse(deserialize(value))
    } catch {
      return defaultValue
    }
  })

  useDebounce(
    state,
    (value) => {
      const serialized = serialize(value)
      const serializedDefault = serialize(defaultValue)
      const urlParams = new URLSearchParams(window.location.search)

      if (!storeDefaultValue && serialized === serializedDefault) {
        urlParams.delete(key)
      } else {
        urlParams.set(key, serialized)
      }

      window.history.replaceState({}, "", "?" + urlParams.toString())
    },
    debounce
  )

  return [state, setState] as const
}
