import type { Options, ReturnType } from './types'
import { useState } from 'react'
import useSupported from '../useSupported'

/**
 * @name useClipboard
 * @description hook to copy text to the clipboard
 * @returns  ReturnType - the hook returns an object with the copied state, the text to copy and a boolean indicating if the browser supports the clipboard api.
 */
function useClipboard({
  timeout = 1000,
  onCopy = () => { },
}: Options = {}): ReturnType {
  const [copied, setCopied] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const isSupported = useSupported(() => 'clipboard' in navigator)

  const copy = (text: string) => {
    try {
      setCopied(true)
      setError('')

      setTimeout(() => {
        setCopied(false)
      }, timeout)

      if (!isSupported)
        return

      navigator.clipboard.writeText(text)
      onCopy(text)
      setText(text)
    }
    catch (e) {
      setCopied(false)
      setError((e as Error).message)
    }
  }

  return {
    copy,
    isSupported,
    copied,
    text,
    error,
  }
}

export default useClipboard
