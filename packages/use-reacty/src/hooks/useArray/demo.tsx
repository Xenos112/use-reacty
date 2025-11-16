import type { CSSProperties, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useArray } from 'use-reacty'

interface Task {
  id: number
  title: string
  completed: boolean
}

const secondaryButtonStyles: CSSProperties = {
  background: 'var(--vp-c-bg)',
  color: 'var(--vp-c-text-1)',
  border: '1px solid var(--vp-c-divider)',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9em',
}

const initialTasks: Task[] = [
  { id: 1, title: 'Draft release notes', completed: false },
  { id: 2, title: 'Review pull requests', completed: true },
  { id: 3, title: 'Prep next sprint', completed: false },
]

export default function UseArrayDemo() {
  const { array: tasks, push, update, filter, remove, clear, set } = useArray<Task>(
    initialTasks,
  )
  const [title, setTitle] = useState('')
  const [nextId, setNextId] = useState(initialTasks.length + 1)

  const completedCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }

    push({
      id: nextId,
      title: trimmed,
      completed: false,
    })
    setNextId(id => id + 1)
    setTitle('')
  }

  const toggleTask = (taskId: number) => {
    const index = tasks.findIndex(task => task.id === taskId)
    if (index === -1)
      return

    const task = tasks[index]
    update(index, {
      ...task,
      completed: !task.completed,
    })
  }

  const resetTasks = () => {
    set(initialTasks.map(task => ({ ...task })))
  }

  return (
    <div
      style={{
        background: 'var(--vp-c-bg-soft)',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={title}
          placeholder="Add a task"
          onChange={event => setTitle(event.target.value)}
          style={{
            flex: '1',
            minWidth: '180px',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--vp-c-divider)',
            background: 'var(--vp-c-bg)',
            color: 'var(--vp-c-text-1)',
          }}
        />

        <button
          type="submit"
          style={{
            background: 'var(--vp-c-brand)',
            color: 'var(--vp-c-text-inverse)',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Push Task
        </button>
      </form>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          fontSize: '0.9em',
          color: 'var(--vp-c-text-2)',
        }}
      >
        <span>
          Total:
          {tasks.length}
        </span>
        <span>
          Completed:
          {completedCount}
        </span>
        <span>
          Pending:
          {tasks.length - completedCount}
        </span>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {tasks.map((task, index) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--vp-c-divider)',
              background: 'var(--vp-c-bg)',
            }}
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1px solid var(--vp-c-divider)',
                background: task.completed ? 'var(--vp-c-brand-soft)' : 'transparent',
                cursor: 'pointer',
              }}
              aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.completed ? '✓' : ''}
            </button>

            <div
              style={{
                flex: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--vp-c-text-3)' : 'var(--vp-c-text-1)',
              }}
            >
              {task.title}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--vp-c-text-2)',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </li>
        ))}

        {!tasks.length && (
          <li
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px dashed var(--vp-c-divider)',
              textAlign: 'center',
              color: 'var(--vp-c-text-3)',
            }}
          >
            The array is empty — try pushing a new task!
          </li>
        )}
      </ul>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => filter(task => !task.completed as unknown as Task)}
          style={secondaryButtonStyles}
        >
          Filter Pending
        </button>

        <button type="button" onClick={clear} style={secondaryButtonStyles}>
          Clear All
        </button>

        <button type="button" onClick={resetTasks} style={secondaryButtonStyles}>
          Reset Sample Data
        </button>
      </div>
    </div>
  )
}
