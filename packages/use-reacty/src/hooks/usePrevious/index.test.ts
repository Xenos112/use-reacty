import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import usePrevious from '.'

describe('usePrevious', () => {
  it('should return null on initial render', () => {
    const { result } = renderHook(() => usePrevious('initial'))
    expect(result.current).toBe(null)
  })

  it('should return the previous value after a re-render', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' },
    })

    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    rerender({ value: 'third' })
    expect(result.current).toBe('second')
  })

  it('should work with numbers', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    })

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)
  })

  it('should work with booleans', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: true },
    })

    rerender({ value: false })
    expect(result.current).toBe(true)

    rerender({ value: true })
    expect(result.current).toBe(false)
  })

  it('should work with objects', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    })

    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      {
        initialProps: { value: null as string | null | undefined },
      },
    )

    rerender({ value: 'not-null' })
    expect(result.current).toBe(null)

    rerender({ value: undefined })
    expect(result.current).toBe('not-null')

    rerender({ value: 'final' })
    expect(result.current).toBe(undefined)
  })
})
