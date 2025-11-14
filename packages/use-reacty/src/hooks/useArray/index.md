---
title: useArray
description: A React hook that wraps array state with ergonomic helper methods like push, update, filter, remove, and clear.
---

# useArray

Manage array state in React components with a composable helper that ships with the most common mutations baked in. Instead of spreading and slicing manually, `useArray` exposes semantic helpers that preserve immutability for you.

[[toc]]

## Features

- 🧱 Opinionated helpers for push, update, remove, filter, and clear
- 🧵 Fully typed generics, works with primitives or complex objects
- ⚡ Immutable updates without extra boilerplate
- ♻️ Reuses the standard React state setter via `set`

## Basic Usage

```tsx
import { useArray } from 'use-reacty'

function Checklist() {
  const { array: tasks, push, update, remove, clear } = useArray([
    { id: 1, label: 'Write docs', done: false },
  ])

  const addTask = label => push({ id: crypto.randomUUID(), label, done: false })
  const toggleTask = id => {
    const index = tasks.findIndex(task => task.id === id)
    update(index, { ...tasks[index], done: !tasks[index].done })
  }

  return (
    <div>
      <button onClick={() => addTask('Ship release')}>Push</button>
      <button onClick={() => clear()}>Clear</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              {task.label}
            </label>
            <button onClick={() => remove(tasks.indexOf(task))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Type Definitions

```typescript
function useArray<T>(initialData: T[]): {
  array: T[]
  set: React.Dispatch<React.SetStateAction<T[]>>
  push: (item: T) => void
  update: (index: number, newItem: T) => void
  filter: (predicate: (item: T, index: number, list: T[]) => boolean) => void
  remove: (index: number) => void
  clear: () => void
}
```

## Advanced Usage

### Working with object collections

```tsx
type Task = { id: number; title: string; completed: boolean }
const { array: tasks, update, remove } = useArray<Task>(seedTasks)

const toggleTask = (taskId: number) => {
  const index = tasks.findIndex(task => task.id === taskId)
  if (index === -1) return

  update(index, { ...tasks[index], completed: !tasks[index].completed })
}

const deleteTask = (taskId: number) => {
  const index = tasks.findIndex(task => task.id === taskId)
  if (index !== -1) {
    remove(index)
  }
}
```

### Filtering and resetting

```tsx
const {
  array: notifications,
  filter,
  set,
  clear,
} = useArray<Notification>(initialNotifications)

const dismissRead = () => filter(notification => !notification.read)
const reset = () => set(initialNotifications)
const empty = () => clear()
```

### Bulk replacements with `set`

```tsx
const { array, set } = useArray(['🍎', '🍌', '🍇'])

const moveItem = (from: number, to: number) => {
  const next = [...array]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  set(next)
}
```

## Best Practices

1. **Derive indices before calling helpers**: find the index in the current array snapshot and pass it to `update` or `remove`.
2. **Return booleans from `filter`**: keep callbacks pure and deterministic.
3. **Prefer `set` for bulk replacements**: when the new data depends on multiple items, compute the next array and call `set(next)`.
4. **Avoid mutating items inline**: always spread objects when updating to keep React change detection reliable.

## When to Use

- ✅ Managing checklists, carts, or ordered collections
- ✅ Applying chained transformations (filter → push → update)
- ✅ Sharing array logic between components without extracting reducers

## When NOT to Use

- ❌ Arrays that require complex reducers or history tracking
- ❌ Data stored outside of React (e.g., Zustand, Redux)
- ❌ Scenarios where mutations must be queued or debounced manually

## Live Demo

<div>
<div ref="demo"></div>
</div>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import UseArrayDemo from './demo.tsx'

const demo = ref()

onMounted(() => {
  const root = createRoot(demo.value)
  root.render(createElement(UseArrayDemo, {}, null))
})
</script>
