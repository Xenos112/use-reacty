---
title: useClipboard
description: A React hook for seamless clipboard operations with automatic state management
---

# useClipboard

A powerful React hook that provides a simple interface for clipboard operations with automatic state management and browser compatibility checks.

[[toc]]

## Features

- 📋 Easy text copying
- ✨ Automatic state management
- 🔍 Browser compatibility detection
- ⏱️ Configurable feedback duration
- 🎭 TypeScript-first design
- 🔄 Copy success indication

## Basic Usage

```tsx
import { useClipboard } from 'use-reacty'

function CopyButton() {
  const { copy, copied } = useClipboard()

  return (
    <button onClick={() => copy('Hello World!')}>
      {copied ? 'Copied!' : 'Copy Text'}
    </button>
  )
}
```

## Type Definitions

```typescript
interface UseClipboardOptions {
  // Duration (in ms) to show the copied state
  timeout?: number
  // Callback function when text is copied
  onCopy?: (text: string) => void
}

interface UseClipboardReturn {
  // Function to copy text to clipboard
  copy: (text: string) => void
  // Whether the browser supports clipboard API
  isSupported: boolean
  // The last copied text
  text: string
  // Whether text was just copied
  copied: boolean
  // Contains an error object if the last copy attempt failed
  error: Error
}
```

## Advanced Usage

### With Custom Timeout

```tsx
function CustomTimeout() {
  const { copy, copied } = useClipboard({
    // Show "Copied!" for 2 seconds
    timeout: 2000
  })

  return (
    <div>
      <button onClick={() => copy('Custom timeout text')}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
```

### With Copy Callback

```tsx
function WithCallback() {
  const { copy } = useClipboard({
    onCopy: (text) => {
      console.log(`Copied: ${text}`)
      // Trigger notifications or other side effects
    }
  })

  return (
    <button onClick={() => copy('Text with callback')}>
      Copy with Callback
    </button>
  )
}
```

### With Input Field

```tsx
function CopyInput() {
  const [input, setInput] = useState('')
  const { copy, copied, text } = useClipboard()

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type something..."
      />
      <button
        onClick={() => copy(input)}
        disabled={!input}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <p>
        Last copied text:
        {text}
      </p>
    </div>
  )
}
```

## Best Practices

1. **Browser Compatibility**

   ```tsx
   function SafeCopy() {
     const { copy, isSupported } = useClipboard()

     if (!isSupported) {
       return <p>Clipboard is not supported in your browser</p>
     }

     return <button onClick={() => copy('text')}>Copy</button>
   }
   ```

2. **User Feedback**

   ```tsx
   function CopyWithFeedback() {
     const { copy, copied } = useClipboard()

     return (
       <div>
         <button
           onClick={() => copy('text')}
           className={copied ? 'success' : ''}
         >
           {copied ? '✓ Copied!' : 'Copy'}
         </button>
       </div>
     )
   }
   ```

3. **Error Handling**

   The `useClipboard` hook includes an `error` state that will be updated if a synchronous error occurs during the copy attempt. You can monitor this state to display feedback to the user.

   ```tsx
   function SafeCopyWithFeedback() {
     const { copy, error, isSupported } = useClipboard()

     const handleCopy = (text: string) => {
       if (!isSupported) {
         alert('Clipboard API not supported. Please copy manually.')
         return
       }
       copy(text)
     }

     return (
       <div>
         <button onClick={() => handleCopy('text')}>Copy</button>
         {error && error.message && (
           <p style={{ color: 'red' }}>
             Failed to copy: {error.message}
           </p>
         )}
       </div>
     )
   }
   ```

## Live Demo

<div>
<div ref="demo"></div>
</div>

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import UseClipboard from './demo.tsx'

const demo = ref()

onMounted(() => {
  const root = createRoot(demo.value)
  root.render(createElement(UseClipboard, {}, null))
})
</script>
