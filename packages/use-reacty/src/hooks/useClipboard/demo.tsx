import { useState } from 'react'
import { useClipboard } from 'use-reacty'

export default function UseClipboard() {
  const [input, setInput] = useState('Try copying this text!')
  const { copy, isSupported, copied, text, error } = useClipboard()

  return (
    <div
      style={{
        background: 'var(--vp-c-bg-soft)',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      {!isSupported && (
        <div
          style={{
            color: 'var(--vp-c-danger-1)',
            padding: '10px',
            borderRadius: '6px',
            background: 'var(--vp-c-danger-soft)',
          }}
        >
          ⚠️ Clipboard API is not supported in your browser
        </div>
      )}

      {error && error.message && (
        <div
          style={{
            color: 'var(--vp-c-danger-1)',
            padding: '10px',
            borderRadius: '6px',
            background: 'var(--vp-c-danger-soft)',
          }}
        >
          An error occurred:
          {' '}
          {error.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--vp-c-divider)',
            background: 'var(--vp-c-bg)',
            color: 'var(--vp-c-text-1)',
          }}
          placeholder="Type something to copy..."
        />
        <button
          type="button"
          onClick={() => copy(input)}
          disabled={!isSupported}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: copied
              ? 'var(--vp-c-success-1)'
              : 'var(--vp-c-brand)',
            color: 'white',
            cursor: isSupported ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            opacity: isSupported ? 1 : 0.5,
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {text && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            background: 'var(--vp-c-bg)',
            border: '1px solid var(--vp-c-divider)',
          }}
        >
          <div style={{
            fontSize: '0.9em',
            color: 'var(--vp-c-text-2)',
            marginBottom: '4px',
          }}
          >
            Last copied text:
          </div>
          <div style={{
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}
          >
            {text}
          </div>
        </div>
      )}
    </div>
  )
}
