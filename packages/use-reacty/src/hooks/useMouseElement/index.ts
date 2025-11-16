/* eslint-disable react-web-api/no-leaked-event-listener */
import type { RefObject } from 'react'
import type { Coords } from '../useMouse/types'
import { useEffect, useState } from 'react'
import getCoordinates from '../../utils/getCoordinates'

/**
 * @name useMouseElement
 * @param ref - The ref object to observe.
 * @returns The mouse position.
 * @description A hook To work with mouse positions.
 */
function useMouseElement<T extends HTMLElement>(
  ref: RefObject<T | null>,
): Readonly<Coords> {
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 })

  useEffect(() => {
    if (ref.current) {
      function onMove(e: PointerEvent | TouchEvent) {
        const { clientX, clientY } = getCoordinates(e)
        setCoords({ x: clientX, y: clientY })
      }

      ref.current.addEventListener('pointermove', onMove)
      ref.current.addEventListener('touchmove', onMove)

      return () => {
        ref.current!.removeEventListener('pointermove', onMove)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current!.removeEventListener('touchmove', onMove)
      }
    }
  }, [ref])

  return coords
}

export default useMouseElement
