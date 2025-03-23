import {useState} from "react"
import {z} from "zod"
import useDebounce from "@/lib/hooks/useDebounce"

type UseStorageState<T> = {
  key: string
  defaultValue: T
  schema: z.ZodType<T>
  debounce?: number
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export const useStorageState = <T>({
  key,
  defaultValue,
  schema,
  serialize = (value) => JSON.stringify(value),
  deserialize = (value) => JSON.parse(value),
  debounce = 500
}: UseStorageState<T>) => {
  const [state, setState] = useState(() => {
    const value = localStorage.getItem(key)
    if (!value) return defaultValue
    try {
      return schema.parse(deserialize(value))
    } catch {
      return defaultValue
    }
  })

  useDebounce(
    state,
    (value) => localStorage.setItem(key, serialize(value)),
    debounce
  )

  return [state, setState] as const
}
