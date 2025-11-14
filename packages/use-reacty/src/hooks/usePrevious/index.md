---
title: usePrevious
description: A React hook that returns the value from the previous render.
---

# usePrevious

A simple React hook that tracks the value of a variable from the previous render. This is useful for comparing props or state between renders.

[[toc]]

## Features

- 🔄 Tracks previous value
- 📦 Works with any data type
- 🎭 TypeScript support
- ⚡️ Minimal and efficient

## Basic Usage

```tsx
import { useState } from 'react'
import { usePrevious } from 'use-reacty'

function Counter() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {previousCount ?? 'N/A'}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
```

## Type Definitions

```typescript
function usePrevious<T>(value: T): T | null
```

## Advanced Usage

### Comparing Props

You can use `usePrevious` to detect when a prop has changed.

```tsx
import { useEffect } from 'react'
import { usePrevious } from 'use-reacty'

function UserProfile({ userId }) {
  const previousUserId = usePrevious(userId)

  useEffect(() => {
    if (previousUserId !== userId) {
      console.log(`User changed from ${previousUserId} to ${userId}`)
      // Fetch new user data
    }
  }, [userId, previousUserId])

  return <div>Displaying profile for user {userId}</div>
}
```

### Tracking State Changes

Monitor changes in complex state objects.

```tsx
import { useState } from 'react'
import { usePrevious } from 'use-reacty'

function SettingsForm() {
  const [settings, setSettings] = useState({ theme: 'light', notifications: true })
  const previousSettings = usePrevious(settings)

  const hasThemeChanged = previousSettings?.theme !== settings.theme
  const hasNotificationsChanged = previousSettings?.notifications !== settings.notifications

  return (
    <div>
      {hasThemeChanged && <p>Theme has changed.</p>}
      {hasNotificationsChanged && <p>Notification settings have changed.</p>}
      {/* Form inputs to update settings */}
    </div>
  )
}
```

## Best Practices

1.  **Initial Value**: The hook returns `null` on the initial render, so handle this case in your component.
2.  **Comparisons**: When comparing objects or arrays, be mindful of reference equality. If the object/array is recreated on each render, `usePrevious` will always see it as a new value.

## Live Demo

<div>
<div ref="demo"></div>
</div>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import UsePreviousDemo from './demo.tsx'

const demo = ref()

onMounted(() => {
  const root = createRoot(demo.value)
  root.render(createElement(UsePreviousDemo, {}, null))
})
</script>
