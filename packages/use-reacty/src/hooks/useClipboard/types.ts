export interface ReturnType {
  copy: (text: string) => void
  isSupported: boolean
  text: string
  copied: boolean
  error: string
}

export interface Options {
  timeout?: number
  onCopy?: (text: string) => void
}
