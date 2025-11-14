import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useUpdateEffect from '.'

describe('useUpdateEffect', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('skips running the callback on the initial render', () => {
    const callback = vi.fn()

    renderHook(() => {
      useUpdateEffect(callback, [])
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('runs the callback when dependencies change', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ value }) => {
        useUpdateEffect(() => {
          callback(value)
        }, [value])
      },
      { initialProps: { value: 1 } },
    )

    expect(callback).not.toHaveBeenCalled()

    rerender({ value: 2 })
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(2)

    rerender({ value: 3 })
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith(3)
  })

  it('does not rerun when dependencies stay the same', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ value }) => {
        useUpdateEffect(callback, [value])
      },
      { initialProps: { value: 'stable' } },
    )

    rerender({ value: 'stable' })
    rerender({ value: 'stable' })

    expect(callback).not.toHaveBeenCalled()
  })

  it('falls back to running on every update when no deps are provided', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ flag }) => {
        useUpdateEffect(() => {
          callback(flag)
        })
      },
      { initialProps: { flag: false } },
    )

    rerender({ flag: true })
    rerender({ flag: false })

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback.mock.calls[0][0]).toBe(true)
    expect(callback.mock.calls[1][0]).toBe(false)
  })

  it('runs cleanup functions before the next invocation and on unmount', () => {
    const cleanup = vi.fn()
    const callback = vi.fn(() => cleanup)

    const { rerender, unmount } = renderHook(
      ({ value }) => {
        useUpdateEffect(callback, [value])
      },
      { initialProps: { value: 'first' } },
    )

    rerender({ value: 'second' })
    expect(callback).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledTimes(0)

    rerender({ value: 'third' })
    expect(callback).toHaveBeenCalledTimes(2)
    expect(cleanup).toHaveBeenCalledTimes(1)

    unmount()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  it('works alongside internal component state updates', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => {
      const [count, setCount] = useState(0)

      useUpdateEffect(() => {
        callback(count)
      }, [count])

      return { setCount }
    })

    act(() => result.current.setCount(1))
    act(() => result.current.setCount(2))

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith(2)
  })
})
