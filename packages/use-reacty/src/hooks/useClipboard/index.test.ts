import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useClipboard from '.'
import useSupported from '../useSupported'

// Mock useSupported
vi.mock('../useSupported', () => ({
  default: vi.fn(),
}))

const mockWriteText = vi.fn()

describe('useClipboard Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    })
    vi.useFakeTimers()
  })

  it('should have correct initial state', () => {
    ;(useSupported as vi.Mock).mockReturnValue(true)
    const { result } = renderHook(() => useClipboard())

    expect(result.current.copied).toBe(false)
    expect(result.current.text).toBe('')
    expect(result.current.error.message).toBe('')
    expect(result.current.isSupported).toBe(true)
  })

  it('should copy text successfully and reset state after timeout', () => {
    ;(useSupported as vi.Mock).mockReturnValue(true)
    const onCopy = vi.fn()
    const { result } = renderHook(() => useClipboard({ timeout: 2000, onCopy }))
    const textToCopy = 'Hello World'

    act(() => {
      result.current.copy(textToCopy)
    })

    expect(result.current.copied).toBe(true)
    expect(result.current.text).toBe(textToCopy)
    expect(result.current.error.message).toBe('')
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy)
    expect(onCopy).toHaveBeenCalledWith(textToCopy)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.copied).toBe(false)
  })

  it('should handle synchronous errors during copy and update error state', () => {
    ;(useSupported as vi.Mock).mockReturnValue(true)
    const errorMessage = 'onCopy failed'
    const onCopy = vi.fn().mockImplementation(() => {
      throw new Error(errorMessage)
    })

    const { result } = renderHook(() => useClipboard({ onCopy }))
    const textToCopy = 'This will fail'

    act(() => {
      result.current.copy(textToCopy)
    })

    expect(result.current.copied).toBe(false)
    expect(result.current.text).toBe('') // Text state should not be updated on error
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe(errorMessage)
    // Note: writeText is still called in the current implementation before the error is thrown
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy)
  })

  it('should not call writeText if clipboard API is not supported', () => {
    ;(useSupported as vi.Mock).mockReturnValue(false)
    const { result } = renderHook(() => useClipboard())
    const textToCopy = 'No API support'

    act(() => {
      result.current.copy(textToCopy)
    })

    expect(result.current.isSupported).toBe(false)
    expect(mockWriteText).not.toHaveBeenCalled()
    expect(result.current.copied).toBe(true) // Optimistically set to true
    expect(result.current.error.message).toBe('')

    act(() => {
      vi.runAllTimers()
    })
    expect(result.current.copied).toBe(false)
  })
})