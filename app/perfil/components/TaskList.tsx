'use client'

import { TaskManager } from '@/lib/taskManager'

export default function TaskList({
  userId,
  tasks,
  compact = true,
  largeButtons = false,
}: {
  userId: string
  tasks: ReturnType<typeof TaskManager.getChildTasks>
  compact?: boolean
  largeButtons?: boolean
}) {
  const complete = (taskId: string) => {
    TaskManager.completeTask(taskId, userId)
    // Note: In a fuller implementation, we would refresh parent state via callback
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma tarefa por enquanto.</p>
  }

  return (
    <ul className="space-y-2">
      {tasks.map(t => (
        <li key={t.id} className={`border rounded-lg p-3 flex items-center justify-between ${compact ? '' : 'text-base'}`}>
          <div>
            <div className="font-medium">{t.title}</div>
            {t.description && <div className="text-xs text-gray-500">{t.description}</div>}
          </div>
          {t.status === 'pending' && (
            <button
              className={`${largeButtons ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'} rounded-md bg-emerald-600 text-white hover:bg-emerald-700`}
              onClick={() => complete(t.id)}
            >
              Feito
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
