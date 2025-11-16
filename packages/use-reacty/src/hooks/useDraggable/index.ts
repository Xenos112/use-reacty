/* eslint-disable react-hooks/exhaustive-deps */
import type { Position, ReturnType, UseDraggableProps } from './types'
import { useLayoutEffect, useRef, useState } from 'react'
import getCoordinates from '../../utils/getCoordinates'

// TODO: add a localStorage key to save the position in the session
/**
 * @name useDraggable
 * @param opts - options for the hook
 * @param opts.x - start position of x
 * @param opts.y - start position of y
 * @param opts.disabled - disables the move of the draggable
 * @param opts.axis - could be 'x', 'y' or 'both'
 * @param opts.preventDefault - prevent default of the callback event
 * @param opts.onStart - callback to run when start dragging
 * @param opts.onEnd - callback to run when stop dragging
 * @param opts.onMove - callback to run when when moving
 * @returns a ref and position object and boolean to indicate the state of drag
 * @description A hook that makes an element draggable
 * @example const { ref, position,isDragging } = useDraggable<HTMLDivElement>({ y: 100 })
 */
function useDraggable<T extends HTMLElement>({
  x = 0,
  y = 0,
  disabled = false,
  axis = 'both',
  preventDefault = false,
  onStart = (_position: Position = { x: 0, y: 0 }) => { },
  onMove = (_position: Position = { x: 0, y: 0 }) => { },
  onEnd = (_position: Position = { x: 0, y: 0 }) => { },
}: UseDraggableProps = {}): ReturnType<T> {
  const ref = useRef<T>(null)
  let startX: number | null = 0
  let startY: number | null = 0
  const [position, setPosition] = useState<Position>({ x, y })
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState<Position>({ x, y })

  useLayoutEffect(() => {
    if (ref.current) {
      const currentX = `${lastPosition.x ? lastPosition.x : x}px`
      const currentY = `${lastPosition.y ? lastPosition.y : y}px`

      ref.current.style.position = 'fixed'
      ref.current.style.left = currentX
      ref.current.style.top = currentY
      ref.current.style.cursor = 'move'
      ref.current.style.zIndex = '1000'

      // prevent user actions
      ref.current.style.userSelect = 'none'
      ref.current.style.touchAction = 'none'

      // Helper to get coordinates from mouse or touch event

      const handleStart = (event: MouseEvent | TouchEvent) => {
        if (preventDefault)
          event.preventDefault()
        if (disabled)
          return

        const { clientX, clientY } = getCoordinates(event)
        const offsetX = ref.current!.offsetLeft!
        const offsetY = ref.current!.offsetTop!

        startX = clientX - offsetX
        startY = clientY - offsetY

        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', handleEnd)
        document.addEventListener('touchmove', handleMove, { passive: false })
        document.addEventListener('touchend', handleEnd)

        onStart({ x: offsetX, y: offsetY })
        setLastPosition({ x: offsetX, y: offsetY })
      }

      function handleMove(event: MouseEvent | TouchEvent) {
        if (preventDefault)
          event.preventDefault()
        if (startX !== null && startY !== null) {
          const { clientX, clientY } = getCoordinates(event)
          const newLeft = clientX - startX
          const newTop = clientY - startY

          onMove({ x: newLeft, y: newTop })
          setIsDragging(true)

          switch (axis) {
            case 'x':
              ref.current!.style.left = `${newLeft}px`
              setPosition(prev => ({ ...prev, x: newLeft }))
              break
            case 'y':
              ref.current!.style.top = `${newTop}px`
              setPosition(prev => ({ ...prev, y: newTop }))
              break
            case 'both':
            default:
              ref.current!.style.left = `${newLeft}px`
              ref.current!.style.top = `${newTop}px`
              setPosition({ x: newLeft, y: newTop })
              break
          }
        }
      }

      function handleEnd() {
        startX = null
        startY = null
        const offsetX = ref.current!.offsetLeft!
        const offsetY = ref.current!.offsetTop!

        onEnd({ x: offsetX, y: offsetY })
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }

      ref.current.addEventListener('mousedown', handleStart)
      ref.current.addEventListener('touchstart', handleStart, { passive: false })

      return () => {
        if (ref.current) {
          ref.current.removeEventListener('mousedown', handleStart)

          ref.current.removeEventListener('touchstart', handleStart)
        }
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [x, y, disabled, axis])

  return {
    ref,
    position,
    isDragging,
  }
}

export default useDraggable
