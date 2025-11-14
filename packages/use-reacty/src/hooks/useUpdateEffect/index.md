---
title: useUpdateEffect
description: A React hook that runs an effect only on updates, skipping the first render
---

# useUpdateEffect

A React hook that runs a callback function only when dependencies change, excluding the initial render. This is useful when you want to perform side effects only on updates, not on mount.

[[toc]]

## Features

- 🔄 Update-only effects
- ⏭️ Skips first render
- 🎭 TypeScript support
- 🎯 Dependency tracking

## Basic Usage

```tsx
import { useUpdateEffect } from 'use-reacty'

function UpdateTracker() {
  const [count, setCount] = useState(0)
  const [updateCount, setUpdateCount] = useState(0)

  useUpdateEffect(() => {
    setUpdateCount(prev => prev + 1)
    console.log('Count updated:', count)
  }, [count])

  return (
    <div>
      <p>Count: {count}</p>
      <p>Updates: {updateCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}
```

## Type Definitions

```typescript
function useUpdateEffect(
  // Callback function to run on updates
  callback: () => void,
  // Optional dependency array (same as useEffect)
  deps?: DependencyList
): void
```

## Advanced Usage

### With Form Validation

```tsx
function FormComponent() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useUpdateEffect(() => {
    if (email && !email.includes('@')) {
      setError('Invalid email format')
    } else {
      setError('')
    }
  }, [email])

  return (
    <div>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  )
}
```

### Tracking Changes

```tsx
function ChangeTracker() {
  const [value, setValue] = useState('')
  const [hasChanged, setHasChanged] = useState(false)

  useUpdateEffect(() => {
    setHasChanged(true)
    // Log changes for analytics
    console.log('Value changed:', value)
  }, [value])

  return (
    <div>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {hasChanged && <p>Value has been modified</p>}
    </div>
  )
}
```

### With Cleanup

```tsx
function SubscriptionComponent() {
  const [userId, setUserId] = useState(1)

  useUpdateEffect(() => {
    const subscription = subscribeToUser(userId)

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  return (
    <div>
      <button onClick={() => setUserId(prev => prev + 1)}>
        Switch User
      </button>
    </div>
  )
}
```

## Comparison with useEffect

| Feature      | useEffect    | useUpdateEffect |
| ------------ | ------------ | --------------- |
| First render | ✅ Runs      | ❌ Skips        |
| Updates      | ✅ Runs      | ✅ Runs         |
| Cleanup      | ✅ Supported | ✅ Supported    |

## Best Practices

1. **Use for Update-Only Logic**

   ```tsx
   function UserProfile({ userId }) {
     const [profile, setProfile] = useState(null)

     // Only fetch on userId changes, not initial mount
     useUpdateEffect(() => {
       fetchUserProfile(userId).then(setProfile)
     }, [userId])

     return <div>{profile?.name}</div>
   }
   ```

2. **Form Validation**

   ```tsx
   function LoginForm() {
     const [password, setPassword] = useState('')
     const [strength, setStrength] = useState('')

     useUpdateEffect(() => {
       if (password.length < 6) {
         setStrength('Weak')
       } else if (password.length < 10) {
         setStrength('Medium')
       } else {
         setStrength('Strong')
       }
     }, [password])

     return (
       <div>
         <input
           type="password"
           value={password}
           onChange={e => setPassword(e.target.value)}
         />
         <span>Strength: {strength}</span>
       </div>
     )
   }
   ```

3. **Avoiding Initial Side Effects**

   ```tsx
   function AnalyticsTracker({ event }) {
     useUpdateEffect(() => {
       // Only track when event changes, not on mount
       analytics.track('event_changed', event)
     }, [event])

     return <div>Tracking: {event}</div>
   }
   ```

## When to Use

- ✅ You need to run effects only on updates, not on mount
- ✅ Form validation that shouldn't trigger on initial render
- ✅ Tracking changes without logging initial state
- ✅ Subscriptions that should only update, not initialize

## When NOT to Use

- ❌ You need the effect to run on mount
- ❌ Initialization logic
- ❌ Setup that should happen once

## Live Demo

<div>
<div ref="demo"></div>
</div>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import UseUpdateEffect from './demo.tsx'

const demo = ref()

onMounted(() => {
  const root = createRoot(demo.value)
  root.render(createElement(UseUpdateEffect, {}, null))
})
</script>
