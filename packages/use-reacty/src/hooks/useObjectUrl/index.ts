import { useEffect, useState } from 'react'

/**
 * @name useObjectUrl
 * @description a hook to create an object url from a file or blob.
 * @param target the file or blob to create an object url from.
 * @returns the object url.
 */
function useObjectUrl(target?: File | Blob | MediaSource) {
  const [objectUrl, setObjectUrl] = useState<string>()

  useEffect(() => {
    if (!target)
      return
    const url = URL.createObjectURL(target)
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [target])

  return objectUrl
}

export default useObjectUrl
