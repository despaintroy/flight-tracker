import {useEffect} from "react"

const useDebounce = <T>(
  value: T,
  callback: (value: T) => void,
  delay: number
) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback(value)
    }, delay)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay])
}

export default useDebounce
