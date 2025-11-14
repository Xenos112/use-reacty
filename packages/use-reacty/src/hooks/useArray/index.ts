import { useState } from 'react'

/**
 * @name useArray
 * @description hook to work with arrays with ease in react
 * @param data - the initial data
 * @returns  functions to work with array like push, delete, clear
 */
function useArray<T>(data: T[]) {
  const [array, setArray] = useState<T[]>(data)

  function push(newItem: T) {
    setArray(items => [...items, newItem])
  }

  function update(index: number, newItem: T) {
    setArray(items => [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index + 1, items.length),
    ])
  }

  function filter(callback: (item: T, index: number, list: T[]) => T) {
    setArray(items => items.filter(callback))
  }

  function remove(index: number) {
    setArray(items => [...items.slice(0, index), ...items.slice(index + 1, items.length)])
  }

  function clear() {
    setArray([])
  }

  return {
    array,
    set: setArray,
    push,
    update,
    filter,
    remove,
    clear,
  }
}

export default useArray
