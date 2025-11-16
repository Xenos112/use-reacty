import type { DependencyList } from 'react'
import { useEffect, useRef } from 'react'

/**
 * @name useUpdateEffect
 * @description a hook to run function when update excluding the first render
 * @param callback - a callback function
 * @param deps - optional list of dependencies
 */
function useUpdateEffect(callback: () => void, deps?: DependencyList) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    return callback()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps ?? []), callback])
}

export default useUpdateEffect
