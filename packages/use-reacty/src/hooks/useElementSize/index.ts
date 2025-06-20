import type { RefObject } from 'react'
import type { Size } from './types'
import useElementBounding from '../useElementBounding'

/**
 * @name useElementSize
 * @description A hook work with element sizes in more of a reactive way.
 * @param ref The ref object to listen to the resize event.
 * @returns The size object with the width and height of the element.
 */
function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>): Size {
  const { width, height } = useElementBounding(ref)

  return { width, height }
}

export default useElementSize
