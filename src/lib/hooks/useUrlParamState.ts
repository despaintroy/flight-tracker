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
}

export const useUrlParamState = <T>({
  key,
  defaultValue,
  schema,
  serialize = (value) => JSON.stringify(value),
  deserialize = (value) => JSON.parse(value),
  debounce = 500
}: UseUrlParamState<T>) => {
  const [state, setState] = useState(() => {
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
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set(key, serialize(value))
      window.history.replaceState({}, "", "?" + urlParams.toString())
    },
    debounce
  )

  return [state, setState] as const
}
