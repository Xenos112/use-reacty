import { useRef, useState } from 'react'
import { useEvent } from 'use-reacty'

export default function UseEvent() {
  const [count, setCount] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEvent('click', () => {
    setCount(prev => prev + 1)
  }, buttonRef)

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
      <button
        type="button"
        ref={buttonRef}
        style={{
          background: 'var(--vp-c-bg)',
          color: 'var(--vp-c-text-1)',
          border: '1px solid var(--vp-c-divider)',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9em',
          transition: 'all 0.2s',
          width: 'fit-content',
        }}
      >
        Clicked
        {' '}
        {count}
        {count === 1 ? 'time' : 'times'}
      </button>

      <div style={{
        fontSize: '0.9em',
        color: 'var(--vp-c-text-2)',
        padding: '8px 12px',
        background: 'var(--vp-c-bg)',
        borderRadius: '6px',
        border: '1px solid var(--vp-c-divider)',
      }}
      >
        Event listener added via useEvent hook
      </div>
    </div>
  )
}
