import { useState } from 'react'
import { usePrevious } from 'use-reacty'

export default function UsePreviousDemo() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div
      style={{
        background: 'var(--vp-c-bg-soft)',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setCount(prev => prev + 1)}
          style={{
            background: 'var(--vp-c-bg)',
            color: 'var(--vp-c-text-1)',
            border: '1px solid var(--vp-c-divider)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9em',
            transition: 'all 0.2s',
          }}
        >
          Increment
        </button>

        <div
          style={{
            fontSize: '0.9em',
            color: 'var(--vp-c-text-1)',
            fontFamily: 'monospace',
            padding: '8px 12px',
            background: 'var(--vp-c-bg)',
            borderRadius: '6px',
            border: '1px solid var(--vp-c-divider)',
          }}
        >
          Current:
          {' '}
          {count}
        </div>

        <div
          style={{
            fontSize: '0.9em',
            color: 'var(--vp-c-text-1)',
            fontFamily: 'monospace',
            padding: '8px 12px',
            background: 'var(--vp-c-bg)',
            borderRadius: '6px',
            border: '1px solid var(--vp-c-divider)',
          }}
        >
          Previous:
          {' '}
          {previousCount ?? 'null'}
        </div>
      </div>

      <div
        style={{
          fontSize: '0.85em',
          color: 'var(--vp-c-text-3)',
          padding: '8px 12px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          border: '1px solid var(--vp-c-divider)',
        }}
      >
        💡 The `usePrevious` hook returns the value from the previous render.
      </div>
    </div>
  )
}
