import { useEffect, useRef } from 'react'

/**
 * @name usePrevious
 * @description A React hook that returns the value from the previous render.
 * @param value The value to track.
 * @returns The value from the previous render.
 */
function usePrevious<T>(value: T) {
  const ref = useRef<T>(null)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
