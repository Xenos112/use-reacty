/* eslint-disable react/no-unstable-default-props */
import type { UseDraggableProps } from './types'
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useDraggable from '.'

function getText(screen: any) {
  const text = screen.getByText(/.*x: (.*), y: (.*), isDragging: (.*)/)
  const match = text.textContent?.match(/x: (.*), y: (.*), isDragging: (.*)/)
  const x = match?.[1]
  const y = match?.[2]
  const isDragging = match?.[3]

  return { x, y, isDragging }
}

function DraggableComponent({
  x = 0,
  y = 0,
  disabled = false,
  axis = 'both',
  onStart = () => { },
  onMove = () => { },
  onEnd = () => { },
}: UseDraggableProps) {
  const { ref, position, isDragging } = useDraggable<HTMLDivElement>({
    x,
    y,
    axis,
    disabled,
    onStart,
    onMove,
    onEnd,
  })

  return (
    <div>
      <div
        ref={ref}
        data-testid="draggable"
        style={{
          width: '100px',
          height: '100px',
        }}
      >
        <p>
          Position:
          {' '}
          {`x: ${position.x}, y: ${position.y}, isDragging: ${isDragging}`}
        </p>
      </div>
    </div>
  )
}

afterEach(() => {
  cleanup()
})

describe('useDraggable', () => {
  it('should render the draggable element at the initial position', () => {
    render(<DraggableComponent x={50} y={100} />)

    const draggable = screen.getByTestId('draggable')

    const { x, y, isDragging } = getText(screen)

    expect(x).toBe('50')
    expect(y).toBe('100')
    expect(isDragging).toBe('false')
    expect(draggable.style.left).toBe('50px')
    expect(draggable.style.top).toBe('100px')
  })

  it('should update position when dragged', async () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, {
      clientX: 0,
      clientY: 0,
    })
    fireEvent.mouseMove(draggable, {
      clientX: 50,
      clientY: 100,
    })
    fireEvent.mouseUp(draggable)

    const { x, y, isDragging } = getText(screen)

    expect(x).toBe('50')
    expect(y).toBe('100')
    expect(isDragging).toBe('false')
    expect(draggable.style.left).toBe('50px')
    expect(draggable.style.top).toBe('100px')
  })

  it('should update the internal state when dragged', async () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    const { x, y, isDragging } = getText(screen)

    expect(x).toBeTruthy()
    expect(y).toBeTruthy()
    expect(x).toBe('100')
    expect(y).toBe('200')
    expect(isDragging).toBe('false')

    expect(draggable.style.left).toMatch(/^100.*/)
    expect(draggable.style.top).toMatch(/^200.*/)
  })

  it('should start at the default position when no initial props are given', () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    expect(draggable.style.left).toMatch(/^0.*/)
    expect(draggable.style.top).toMatch(/^0.*/)
  })

  it('should not move when its desabled', () => {
    render(<DraggableComponent disabled x={50} y={50} />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    const { x, y, isDragging } = getText(screen)

    expect(x).toBe('50')
    expect(y).toBe('50')
    expect(isDragging).toBe('false')
    expect(draggable.style.left).toMatch(/^50.*/)
    expect(draggable.style.top).toMatch(/^50.*/)
  })

  it('should not move when disabled, but should move after enabling', () => {
    const { result } = renderHook(() => useState(true)) // disabled = true initially
    const [disabled, setDisabled] = result.current

    const { rerender } = render(
      <DraggableComponent disabled={disabled} x={50} y={50} />,
    )

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    const { x, y } = getText(screen)

    expect(x).toBe('50')
    expect(y).toBe('50')
    expect(draggable.style.left).toMatch(/^50.*/)
    expect(draggable.style.top).toMatch(/^50.*/)

    setDisabled(false)
    rerender(<DraggableComponent disabled={false} />)

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 150, clientY: 150 })
    fireEvent.mouseUp(draggable)

    const { x: newX, y: newY } = getText(screen)

    expect(newX).not.toBe('50')
    expect(newY).not.toBe('50')
  })

  it('should run the onStart when you pick the element', async () => {
    const onStart = vi.fn()
    render(<DraggableComponent onStart={onStart} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should not run the onStart when you dont pick the element', async () => {
    const onStart = vi.fn()
    render(<DraggableComponent onStart={onStart} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    expect(onStart).toHaveBeenCalledTimes(0)
    expect(draggable.style.left).toMatch(/^0.*/)
    expect(draggable.style.top).toMatch(/^0.*/)
  })

  it('should run the onMove when you move the element', async () => {
    const onMove = vi.fn()
    render(<DraggableComponent onMove={onMove} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    expect(onMove).toHaveBeenCalledTimes(1)
  })

  it('should not run the onMove when you pick the element but dont move it', async () => {
    const onMove = vi.fn()
    render(<DraggableComponent onMove={onMove} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseUp(draggable)

    expect(onMove).toHaveBeenCalledTimes(0)
  })

  it('should run the onEnd when you release the element', async () => {
    const onEnd = vi.fn()
    render(<DraggableComponent onEnd={onEnd} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('should not run the onEnd when you dont release the element', async () => {
    const onEnd = vi.fn()
    render(<DraggableComponent onEnd={onEnd} />)

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })

    expect(onEnd).toHaveBeenCalledTimes(0)
  })

  it('should run all the callbacks when you pick the element', async () => {
    const onStart = vi.fn()
    const onMove = vi.fn()
    const onEnd = vi.fn()
    render(
      <DraggableComponent onStart={onStart} onMove={onMove} onEnd={onEnd} />,
    )

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)

    expect(onStart).toHaveBeenCalledTimes(1)
    expect(onMove).toHaveBeenCalledTimes(1)
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(draggable.style.left).toMatch(/^100.*/)
    expect(draggable.style.top).toMatch(/^200.*/)
  })

  it('should run all the callbacks twice when you pick the element', async () => {
    const onStart = vi.fn()
    const onMove = vi.fn()
    const onEnd = vi.fn()
    render(
      <DraggableComponent onStart={onStart} onMove={onMove} onEnd={onEnd} />,
    )

    const draggable = screen.getByTestId('draggable')
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 100, clientY: 200 })
    fireEvent.mouseUp(draggable)
    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseUp(draggable)

    expect(onStart).toHaveBeenCalledTimes(2)
    expect(onMove).toHaveBeenCalledTimes(2)
    expect(onEnd).toHaveBeenCalledTimes(2)
    expect(draggable.style.left).toMatch(/^0.*/)
    expect(draggable.style.top).toMatch(/^0.*/)
  })

  it('should display as its dragging when you move it and then release it', async () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 100,
      clientY: 200,
      onmousemove() {
        const { isDragging } = getText(screen)
        expect(isDragging).toBe('true')
      },
    })
    fireEvent.mouseUp(draggable)

    const { isDragging } = getText(screen)
    expect(isDragging).toBe('false')
  })

  it('should move in the x only', () => {
    render(<DraggableComponent axis="x" />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 100,
      clientY: 200,
    })
    fireEvent.mouseUp(draggable)

    const { x, y } = getText(screen)
    expect(x).toBe('100')
    expect(y).toBe('0')
  })

  it('should move in the y only', () => {
    render(<DraggableComponent axis="y" />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 100,
      clientY: 200,
    })
    fireEvent.mouseUp(draggable)

    const { x, y } = getText(screen)
    expect(x).toBe('0')
    expect(y).toBe('200')
  })

  it('should move in the both axis', () => {
    render(<DraggableComponent axis="both" />) // default value

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 100,
      clientY: 200,
    })
    fireEvent.mouseUp(draggable)

    const { x, y } = getText(screen)
    expect(x).toBe('100')
    expect(y).toBe('200')
  })

  it('should toggle the axis', () => {
    const { result } = renderHook(() => useState<'x' | 'y'>('x'))

    const [axis, setAxis] = result.current

    const { rerender } = render(<DraggableComponent axis={axis} />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 100,
      clientY: 200,
    })
    fireEvent.mouseUp(draggable)

    const { x, y } = getText(screen)
    expect(x).toBe('100')
    expect(y).toBe('0')

    setAxis('y')
    rerender(<DraggableComponent axis="y" />)

    fireEvent.mouseDown(draggable, { clientX: 0, clientY: 0 })
    fireEvent.mouseMove(draggable, {
      clientX: 200,
      clientY: 300,
    })
    fireEvent.mouseUp(draggable)

    const { x: newX, y: newY } = getText(screen)
    expect(newX).toBe('100')
    expect(newY).toBe('300')
  })
})

describe('useDraggable#touch', () => {
  it('should update position when dragged', async () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.touchStart(draggable, {
      touches: [{
        clientX: 0,
        clientY: 0,
      }],
    })
    fireEvent.touchMove(draggable, {
      touches: [{
        clientX: 50,
        clientY: 100,
      }],
    })
    fireEvent.mouseUp(draggable)

    const { x, y, isDragging } = getText(screen)

    expect(x).toBe('50')
    expect(y).toBe('100')
    expect(isDragging).toBe('false')
    expect(draggable.style.left).toBe('50px')
    expect(draggable.style.top).toBe('100px')
  })

  it('should update the internal state when dragged', async () => {
    render(<DraggableComponent />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.touchStart(draggable, {
      touches: [{
        clientX: 0,
        clientY: 0,
      }],
    })
    fireEvent.touchMove(draggable, {
      touches: [{
        clientX: 100,
        clientY: 200,
      }],
    })
    fireEvent.touchEnd(draggable)

    const { x, y, isDragging } = getText(screen)

    expect(x).toBeTruthy()
    expect(y).toBeTruthy()
    expect(x).toBe('100')
    expect(y).toBe('200')
    expect(isDragging).toBe('false')

    expect(draggable.style.left).toMatch(/^100.*/)
    expect(draggable.style.top).toMatch(/^200.*/)
  })

  it('should move in the y only', () => {
    render(<DraggableComponent axis="y" />)

    const draggable = screen.getByTestId('draggable')

    fireEvent.touchStart(draggable, {
      touches: [{
        clientX: 0,
        clientY: 0,
      }],
    })
    fireEvent.touchMove(draggable, {
      touches: [{
        clientX: 100,
        clientY: 200,
      }],
    })
    fireEvent.touchEnd(draggable)

    const { x, y } = getText(screen)
    expect(x).toBe('0')
    expect(y).toBe('200')
  })
})
