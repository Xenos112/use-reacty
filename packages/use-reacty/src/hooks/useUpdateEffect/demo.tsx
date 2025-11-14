import { useState } from 'react'
import { useUpdateEffect } from 'use-reacty'

export default function UseUpdateEffect() {
  const [count, setCount] = useState(0)
  const [updateCount, setUpdateCount] = useState(0)
  const [message, setMessage] = useState('Initial render - effect not triggered')

  useUpdateEffect(() => {
    setUpdateCount(prev => prev + 1)
    setMessage(`Update #${updateCount + 1} - effect triggered!`)
  }, [count])

  return (
    <div style={{
      background: 'var(--vp-c-bg-soft)',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
    >
      <div style={{
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
          Increment Count
        </button>

        <div style={{
          fontSize: '0.9em',
          color: 'var(--vp-c-text-1)',
          fontFamily: 'monospace',
          padding: '8px 12px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          border: '1px solid var(--vp-c-divider)',
        }}
        >
          Count:
          {' '}
          {count}
        </div>

        <div style={{
          fontSize: '0.9em',
          color: 'var(--vp-c-text-1)',
          fontFamily: 'monospace',
          padding: '8px 12px',
          background: 'var(--vp-c-bg)',
          borderRadius: '6px',
          border: '1px solid var(--vp-c-divider)',
        }}
        >
          Updates:
          {' '}
          {updateCount}
        </div>
      </div>

      <div style={{
        fontSize: '0.9em',
        color: 'var(--vp-c-text-2)',
        padding: '12px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        border: '1px solid var(--vp-c-divider)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      >
        <span>🔄</span>
        <span>{message}</span>
      </div>

      <div style={{
        fontSize: '0.85em',
        color: 'var(--vp-c-text-3)',
        padding: '8px 12px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        border: '1px solid var(--vp-c-divider)',
      }}
      >
        💡 Note: The effect runs on updates but skips the first render
      </div>
    </div>
  )
}
