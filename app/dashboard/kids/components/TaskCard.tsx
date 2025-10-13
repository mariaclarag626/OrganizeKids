'use client'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    points: number
    isCompleted: boolean
    icon?: string
  }
  onComplete: (taskId: string) => void
  isCompleting?: boolean
}

export function TaskCard({ task, onComplete, isCompleting }: TaskCardProps) {
  const icon = task.icon || '📋'
  
  return (
    <div
      className={`bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-105 ${
        task.isCompleted ? 'opacity-75 border-4 border-green-400' : 'border-4 border-transparent hover:border-yellow-300'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{icon}</div>
          <div>
            <h3 className={`text-xl font-bold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 font-bold text-lg">⭐ {task.points} pontos</span>
            </div>
          </div>
        </div>
      </div>
      {!task.isCompleted ? (
        <button
          onClick={() => onComplete(task.id)}
          disabled={isCompleting}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleting ? '⏳ Completando...' : '✨ Completar Tarefa!'}
        </button>
      ) : (
        <div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-center">
          ✅ Completada!
        </div>
      )}
    </div>
  )
}
