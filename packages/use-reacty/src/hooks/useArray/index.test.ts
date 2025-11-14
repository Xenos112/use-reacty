import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useArray from '.'

describe('useArray', () => {
  it('initializes with provided data and updates via the setter', () => {
    const initial = ['alpha', 'beta']
    const { result } = renderHook(() => useArray(initial))

    expect(result.current.array).toEqual(initial)

    act(() => {
      result.current.set(['gamma'])
    })

    expect(result.current.array).toEqual(['gamma'])
  })

  it('push adds a new item to the end of the array', () => {
    const { result } = renderHook(() => useArray([1, 2]))

    act(() => {
      result.current.push(3)
    })

    expect(result.current.array).toEqual([1, 2, 3])
  })

  it('update replaces the value at the provided index', () => {
    const { result } = renderHook(() => useArray(['first', 'second', 'third']))

    act(() => {
      result.current.update(1, 'updated')
    })

    expect(result.current.array).toEqual(['first', 'updated', 'third'])
  })

  it('filter keeps elements that satisfy the predicate', () => {
    const predicate = vi.fn((value: number) => value % 2 === 0)
    const { result } = renderHook(() => useArray([1, 2, 3, 4]))

    act(() => {
      result.current.filter(predicate)
    })

    expect(predicate).toHaveBeenCalledTimes(4)
    expect(result.current.array).toEqual([2, 4])
  })

  it('remove deletes the item at the requested index', () => {
    const { result } = renderHook(() => useArray(['keep', 'delete', 'stay']))

    act(() => {
      result.current.remove(1)
    })

    expect(result.current.array).toEqual(['keep', 'stay'])
  })

  it('clear resets the array to an empty list', () => {
    const { result } = renderHook(() => useArray(['a', 'b']))

    act(() => {
      result.current.clear()
    })

    expect(result.current.array).toEqual([])
  })
})
