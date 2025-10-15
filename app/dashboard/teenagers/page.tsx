'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NotificationSettings from '@/components/NotificationSettings'
import { notificationManager } from '@/lib/notifications'
import Toast from '@/components/Toast'
import { StorageManager } from '@/lib/storage'
import StatsCharts from '@/components/StatsCharts'
import { LocalAuthManager } from '@/lib/localAuth'

type TabType = 'tasks' | 'calendar' | 'pomodoro' | 'routines' | 'stats'

interface ToastData {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface Task {
  id: string
  title: string
  category: 'estudos' | 'saude' | 'domestico' | 'lazer' | 'pessoal'
  subject?: string
  status: 'todo' | 'in-progress' | 'completed'
  points: number
  deadline?: Date
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple'
  type: 'task' | 'deadline' | 'event'
}

interface Routine {
  id: string
  name: string
  tasks: string[]
  completedTasks: Set<number>
}

export default function TeenagersDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('tasks')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')
  
  // Pomodoro Timer States
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutos em segundos
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work')
  const [showPomodoroModal, setShowPomodoroModal] = useState(false)

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Prova de Matemática', date: new Date(2025, 9, 15), color: 'red', type: 'deadline' },
    { id: '2', title: 'Trabalho de História', date: new Date(2025, 9, 20), color: 'yellow', type: 'task' },
    { id: '3', title: 'Consulta Médica', date: new Date(2025, 9, 18), color: 'blue', type: 'event' },
  ])
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [eventForm, setEventForm] = useState<{
    title: string
    date: string
    color: 'red' | 'yellow' | 'green' | 'blue' | 'purple'
    type: 'task' | 'deadline' | 'event'
  }>({
    title: '',
    date: '',
    color: 'blue',
    type: 'event'
  })

  // Tasks States
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Estudar para prova de matemática', category: 'estudos', subject: 'matematica', status: 'in-progress', points: 50, deadline: new Date(2025, 9, 15) },
    { id: '2', title: 'Fazer exercícios de português', category: 'estudos', subject: 'portugues', status: 'todo', points: 30 },
    { id: '3', title: 'Organizar quarto', category: 'domestico', status: 'todo', points: 20 },
    { id: '4', title: 'Correr 30 minutos', category: 'saude', status: 'completed', points: 40 },
    { id: '5', title: 'Jogar videogame', category: 'lazer', status: 'todo', points: 0 },
  ])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState<{
    title: string
    category: 'estudos' | 'saude' | 'domestico' | 'lazer' | 'pessoal'
    subject?: string
    status: 'todo' | 'in-progress' | 'completed'
    points: number
  }>({
    title: '',
    category: 'estudos',
    status: 'todo',
    points: 0
  })

  // Routines States
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: '1',
      name: 'Rotina Matinal',
      tasks: ['Acordar cedo', 'Tomar café', 'Arrumar cama', 'Estudar 1h'],
      completedTasks: new Set()
    }
  ])
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false)
  const [newRoutineForm, setNewRoutineForm] = useState({
    name: '',
    tasks: ['']
  })

  // Toast State
  const [toast, setToast] = useState<ToastData | null>(null)

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Show Toast Function
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type })
  }

  // Pomodoro Stats
  const [pomodoroStats, setPomodoroStats] = useState({
    sessionsCompleted: 0,
    pointsEarned: 0
  })

  // Statistics
  const [totalPoints, setTotalPoints] = useState(0)

  // Rewards System
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewards, setRewards] = useState([
    { id: '1', name: 'R$ 20 mesada extra', pointsCost: 100, claimed: false },
    { id: '2', name: '1 hora extra de videogame', pointsCost: 50, claimed: false },
    { id: '3', name: 'Escolher jantar do dia', pointsCost: 30, claimed: false },
    { id: '4', name: 'Sair com amigos no fim de semana', pointsCost: 80, claimed: false },
    { id: '5', name: 'Dormir 1h mais tarde', pointsCost: 40, claimed: false },
  ])

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => {
          if (time <= 1) {
            setIsPomodoroRunning(false)
            
            if (pomodoroMode === 'work') {
              showToast('⏱️ Tempo de trabalho concluído! Faça uma pausa.', 'success')
              setPomodoroStats(prev => ({ sessionsCompleted: prev.sessionsCompleted + 1, pointsEarned: prev.pointsEarned + 50 }))
              setTotalPoints(prev => prev + 50)
              setPomodoroMode('break')
              return 5 * 60 // 5 minutos de pausa
            } else {
              showToast('✅ Pausa concluída! Hora de trabalhar.', 'info')
              setPomodoroMode('work')
              return 25 * 60 // 25 minutos de trabalho
            }
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPomodoroRunning, pomodoroTime, pomodoroMode])

  // Load data from localStorage on mount
  useEffect(() => {
    const userId = 'teenager-1' // TODO: Get from session/auth
    
    const savedTasks = StorageManager.load(userId, 'tasks', tasks)
    const savedRoutines = StorageManager.load(userId, 'routines', routines)
    const savedEvents = StorageManager.load(userId, 'events', calendarEvents)
    const savedPoints = StorageManager.load(userId, 'totalPoints', totalPoints)
    const savedPomodoroStats = StorageManager.load(userId, 'pomodoroStats', pomodoroStats)
    const savedRewards = StorageManager.load(userId, 'rewards', rewards)
    
    setTasks(savedTasks)
    setRoutines(savedRoutines.map((r: any) => ({
      ...r,
      completedTasks: new Set(r.completedTasks || [])
    })))
    setCalendarEvents(savedEvents.map((e: any) => ({
      ...e,
      date: new Date(e.date)
    })))
    setTotalPoints(savedPoints)
    setPomodoroStats(savedPomodoroStats)
    setRewards(savedRewards)
  }, [])

  // Auto-save tasks
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      StorageManager.save(userId, 'tasks', tasks)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [tasks])

  // Auto-save routines
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      const routinesToSave = routines.map(r => ({
        ...r,
        completedTasks: Array.from(r.completedTasks)
      }))
      StorageManager.save(userId, 'routines', routinesToSave)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [routines])

  // Auto-save calendar events
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      StorageManager.save(userId, 'events', calendarEvents)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [calendarEvents])

  // Auto-save points
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      StorageManager.save(userId, 'totalPoints', totalPoints)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [totalPoints])

  // Auto-save pomodoro stats
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      StorageManager.save(userId, 'pomodoroStats', pomodoroStats)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [pomodoroStats])

  // Auto-save rewards
  useEffect(() => {
    const userId = 'teenager-1'
    const timeoutId = setTimeout(() => {
      StorageManager.save(userId, 'rewards', rewards)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [rewards])

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate points based on category
  const calculatePoints = (category: string, basePoints: number, subject?: string) => {
    if (category === 'estudos' || category === 'lazer') {
      return basePoints // Teenager escolhe
    } else {
      return basePoints // Pais definem (domestico, saude, pessoal)
    }
  }

  // Task Management Functions
  const addNewTask = () => {
    if (!newTaskForm.title) {
      showToast('Por favor, preencha o título da tarefa', 'warning')
      return
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskForm.title,
      category: newTaskForm.category,
      subject: newTaskForm.subject,
      status: newTaskForm.status,
      points: calculatePoints(newTaskForm.category, newTaskForm.points, newTaskForm.subject)
    }
    
    setTasks([...tasks, newTask])
    setShowNewTaskModal(false)
    setNewTaskForm({
      title: '',
      category: 'estudos',
      status: 'todo',
      points: 0
    })
    showToast(`✅ Tarefa "${newTask.title}" criada com sucesso!`, 'success')
  }

  const toggleTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const oldStatus = t.status
        
        // GANHAR PONTOS: Se mudou para completed
        if (newStatus === 'completed' && oldStatus !== 'completed' && t.points > 0) {
          setTotalPoints(prev => prev + t.points)
          showToast(`🎉 Parabéns! +${t.points} pontos`, 'success')
        }
        
        // PERDER PONTOS: Se estava completed e mudou para qualquer outro status
        else if (oldStatus === 'completed' && newStatus !== 'completed' && t.points > 0) {
          setTotalPoints(prev => prev - t.points)
          showToast(`⚠️ Tarefa não concluída. -${t.points} pontos`, 'warning')
        }
        
        // Mensagens de status
        if (newStatus === 'in-progress' && oldStatus === 'todo') {
          showToast(`▶️ "${t.title}" em progresso!`, 'info')
        }
        
        return { ...t, status: newStatus }
      }
      return t
    }))
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const saveEditedTask = () => {
    if (!editingTask) return
    
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t))
    setShowTaskModal(false)
    setEditingTask(null)
    showToast('✏️ Tarefa atualizada!', 'success')
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      setTasks(tasks.filter(t => t.id !== taskId))
      showToast(`🗑️ Tarefa "${task.title}" removida`, 'info')
    }
  }

  // Calendar Functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1))
  }

  // Smart color suggestion based on date
  const suggestEventColor = (date: Date): 'red' | 'yellow' | 'green' | 'blue' | 'purple' => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 7) return 'red'      // Urgente (0-7 dias)
    if (diffDays <= 14) return 'yellow'  // Importante (8-14 dias)
    if (diffDays <= 30) return 'green'   // Tranquilo (15-30 dias)
    if (diffDays > 30) return 'blue'     // Planejamento (30+ dias)
    return 'purple'                       // Opcional
  }

  const addEvent = () => {
    if (!eventForm.title || !eventForm.date) {
      showToast('Preencha título e data do evento', 'warning')
      return
    }

    const eventDate = new Date(eventForm.date)
    const suggestedColor = eventForm.type === 'deadline' ? 'red' : suggestEventColor(eventDate)

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventForm.title,
      date: eventDate,
      color: eventForm.color || suggestedColor,
      type: eventForm.type
    }

    setCalendarEvents([...calendarEvents, newEvent])
    setShowEventModal(false)
    setEventForm({ title: '', date: '', color: 'blue', type: 'event' })
    showToast(`📅 Evento "${newEvent.title}" adicionado!`, 'success')
  }

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      date: event.date.toISOString().split('T')[0],
      color: event.color,
      type: event.type
    })
    setShowEventModal(true)
  }

  const saveEditedEvent = () => {
    if (!editingEvent || !eventForm.title || !eventForm.date) return

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: eventForm.title,
      date: new Date(eventForm.date),
      color: eventForm.color,
      type: eventForm.type
    }

    setCalendarEvents(calendarEvents.map(e => e.id === editingEvent.id ? updatedEvent : e))
    setShowEventModal(false)
    setEditingEvent(null)
    setEventForm({ title: '', date: '', color: 'blue', type: 'event' })
    showToast('✏️ Evento atualizado!', 'success')
  }

  const deleteEvent = (eventId: string) => {
    const event = calendarEvents.find(e => e.id === eventId)
    if (!event) return
    
    if (confirm('Deseja remover este evento?')) {
      setCalendarEvents(calendarEvents.filter(e => e.id !== eventId))
      showToast(`🗑️ Evento "${event.title}" removido`, 'info')
    }
  }

  // Get event color classes
  const getEventColorClasses = (color: string) => {
    const colors = {
      red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', emoji: '🔴' },
      yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', emoji: '🟡' },
      green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', emoji: '🟢' },
      blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', emoji: '🔵' },
      purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', emoji: '🟣' },
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  // Routine Functions
  const addNewRoutine = () => {
    if (!newRoutineForm.name || newRoutineForm.tasks.every(t => !t.trim())) {
      showToast('Preencha o nome e pelo menos uma tarefa', 'warning')
      return
    }
    
    const newRoutine: Routine = {
      id: Date.now().toString(),
      name: newRoutineForm.name,
      tasks: newRoutineForm.tasks.filter(t => t.trim()),
      completedTasks: new Set()
    }
    
    setRoutines([...routines, newRoutine])
    setShowNewRoutineModal(false)
    setNewRoutineForm({ name: '', tasks: [''] })
    showToast(`✅ Rotina "${newRoutine.name}" criada!`, 'success')
  }

  const toggleRoutineTask = (routineId: string, taskIndex: number) => {
    setRoutines(routines.map(routine => {
      if (routine.id === routineId) {
        const newCompleted = new Set(routine.completedTasks)
        if (newCompleted.has(taskIndex)) {
          newCompleted.delete(taskIndex)
        } else {
          newCompleted.add(taskIndex)
          // Se completou todas as tarefas
          if (newCompleted.size === routine.tasks.length) {
            showToast(`🎉 Rotina "${routine.name}" completa!`, 'success')
          }
        }
        return { ...routine, completedTasks: newCompleted }
      }
      return routine
    }))
  }

  const deleteRoutine = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId)
    if (!routine) return
    
    if (confirm('Deseja remover esta rotina?')) {
      setRoutines(routines.filter(r => r.id !== routineId))
      showToast(`🗑️ Rotina "${routine.name}" removida`, 'info')
    }
  }

  // Rewards Functions
  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward) return

    if (totalPoints < reward.pointsCost) {
      showToast(`❌ Pontos insuficientes! Você precisa de ${reward.pointsCost} pontos`, 'error')
      return
    }

    if (confirm(`Resgatar "${reward.name}" por ${reward.pointsCost} pontos?`)) {
      setTotalPoints(prev => prev - reward.pointsCost)
      setRewards(rewards.map(r => r.id === rewardId ? { ...r, claimed: true } : r))
      showToast(`🎁 Recompensa resgatada! "${reward.name}"`, 'success')
      
      // Notificar os pais
      if (notificationManager) {
        notificationManager.sendNotification({
          title: '🎁 Recompensa Resgatada!',
          body: `Seu filho resgatou: ${reward.name}`,
          icon: '🎁',
          requireInteraction: true
        })
      }
    }
  }

  const resetReward = (rewardId: string) => {
    setRewards(rewards.map(r => r.id === rewardId ? { ...r, claimed: false } : r))
    showToast('Recompensa resetada pelos pais', 'info')
  }

  const handleLogout = () => {
    LocalAuthManager.logout()
    router.push('/login')
  }

  // Auto-reset subject filter when leaving estudos
  useEffect(() => {
    if (categoryFilter !== 'estudos') {
      setSubjectFilter('all')
    }
  }, [categoryFilter])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false
    if (subjectFilter !== 'all' && task.subject !== subjectFilter) return false
    return true
  })

  const completedTasks = filteredTasks.filter(t => t.status === 'completed')
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress')
  const todoTasks = filteredTasks.filter(t => t.status === 'todo')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Teenagers</h1>
            <p className="text-slate-400 text-sm">Organize suas tarefas e rotinas</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Pomodoro Widget */}
            <button
              onClick={() => setShowPomodoroModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              <span className="text-xl">⏱️</span>
              <span className="font-mono font-bold">{formatTime(pomodoroTime)}</span>
            </button>

            {/* Points Display */}
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50">
              <div className="text-xs text-yellow-400/80">Pontos</div>
              <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
            </div>

            {/* Rewards Button */}
            <button
              onClick={() => setShowRewardsModal(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span className="text-xl">🎁</span>
              <span className="font-semibold">Recompensas</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="container mx-auto px-6 mt-6">
        <div className="flex gap-2 bg-slate-800/50 rounded-xl p-2 backdrop-blur-md border border-slate-700/50">
          {[
            { id: 'tasks', label: 'Todas as Tarefas', icon: '✅' },
            { id: 'calendar', label: 'Calendário', icon: '📅' },
            { id: 'pomodoro', label: 'Pomodoro', icon: '⏱️' },
            { id: 'routines', label: 'Rotinas', icon: '🔄' },
            { id: 'stats', label: 'Estatísticas', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">📋 Todas as Tarefas</h2>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                + Nova Tarefa
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex gap-3 flex-wrap">
              {[
                { id: 'all', label: 'Todas', icon: '📋' },
                { id: 'estudos', label: 'Estudos', icon: '📚' },
                { id: 'domestico', label: 'Doméstico', icon: '🏠' },
                { id: 'saude', label: 'Saúde', icon: '💪' },
                { id: 'lazer', label: 'Lazer', icon: '🎮' },
                { id: 'pessoal', label: 'Pessoal', icon: '✨' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Subject Filters (only for estudos) */}
            {categoryFilter === 'estudos' && (
              <div className="flex gap-3 flex-wrap">
                <span className="text-slate-400 self-center">Matérias:</span>
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'matematica', label: 'Matemática' },
                  { id: 'portugues', label: 'Português' },
                  { id: 'historia', label: 'História' },
                  { id: 'geografia', label: 'Geografia' },
                  { id: 'ciencias', label: 'Ciências' },
                  { id: 'biologia', label: 'Biologia' },
                  { id: 'fisica', label: 'Física' },
                  { id: 'quimica', label: 'Química' },
                  { id: 'ingles', label: 'Inglês' },
                  { id: 'artes', label: 'Artes' },
                  { id: 'educacao_fisica', label: 'Ed. Física' },
                ].map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSubjectFilter(subject.id)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all transform hover:scale-105 active:scale-95 ${
                      subjectFilter === subject.id
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
            )}

            {/* A Fazer */}
            {todoTasks.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">🔵 A Fazer ({todoTasks.length})</h3>
                <div className="grid gap-4">
                  {todoTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">{task.title}</h4>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 capitalize">
                                {task.category}
                              </span>
                              {task.subject && (
                                <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 capitalize">
                                  {task.subject.replace('_', ' ')}
                                </span>
                              )}
                              <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                {task.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => toggleTaskStatus(task.id, e.target.value as any)}
                            className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-sm"
                          >
                            <option value="todo">A Fazer</option>
                            <option value="in-progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                          </select>
                          <button
                            onClick={() => openEditTask(task)}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Em Progresso */}
            {inProgressTasks.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">🟡 Em Progresso ({inProgressTasks.length})</h3>
                <div className="grid gap-4">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 border border-yellow-500/50 hover:border-yellow-500 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">{task.title}</h4>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 capitalize">
                                {task.category}
                              </span>
                              {task.subject && (
                                <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 capitalize">
                                  {task.subject.replace('_', ' ')}
                                </span>
                              )}
                              <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                {task.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => toggleTaskStatus(task.id, e.target.value as any)}
                            className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-sm"
                          >
                            <option value="todo">A Fazer</option>
                            <option value="in-progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                          </select>
                          <button
                            onClick={() => openEditTask(task)}
                            className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concluídas */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-400">✅ Concluídas ({completedTasks.length})</h3>
                <div className="grid gap-4">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-800/30 backdrop-blur-md rounded-xl p-4 border border-green-500/30 opacity-70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">✓</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white line-through mb-2">{task.title}</h4>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300 capitalize">
                                {task.category}
                              </span>
                              <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                                +{task.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={task.status}
                            onChange={(e) => toggleTaskStatus(task.id, e.target.value as any)}
                            className="px-3 py-1 rounded-lg bg-slate-700 border border-slate-600 text-sm"
                          >
                            <option value="todo">A Fazer</option>
                            <option value="in-progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                          </select>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Calendário</h2>
              <button
                onClick={() => {
                  setEditingEvent(null)
                  setEventForm({ title: '', date: '', color: 'blue', type: 'event' })
                  setShowEventModal(true)
                }}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                + Novo Evento
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => changeMonth(-1)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
                >
                  ←
                </button>
                <h3 className="text-xl font-bold">
                  {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-slate-400 font-semibold py-2">
                    {day}
                  </div>
                ))}

                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  const dayEvents = calendarEvents.filter(
                    e => e.date.getDate() === day &&
                         e.date.getMonth() === currentMonth.getMonth() &&
                         e.date.getFullYear() === currentMonth.getFullYear()
                  )
                  const isToday = new Date().toDateString() === date.toDateString()

                  return (
                    <div
                      key={day}
                      className={`aspect-square p-2 rounded-lg border transition-all ${
                        isToday
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-slate-700 bg-slate-800/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayEvents.map((event) => {
                          const colorClasses = getEventColorClasses(event.color)
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${colorClasses.bg} border ${colorClasses.border} cursor-pointer hover:scale-105 transition-all group relative`}
                              onClick={() => openEditEvent(event)}
                            >
                              <div className="flex items-center gap-1">
                                <span>{colorClasses.emoji}</span>
                                <span className="truncate flex-1">{event.title}</span>
                              </div>
                              <div className="absolute hidden group-hover:flex gap-1 top-0 right-0 bg-slate-800 rounded p-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openEditEvent(event)
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-500 rounded hover:bg-blue-600"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteEvent(event.id)
                                  }}
                                  className="text-xs px-2 py-1 bg-red-500 rounded hover:bg-red-600"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Legend */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold mb-4">📖 Legenda</h3>
              
              {/* Event Types */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Tipos de Evento:</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Tarefas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Deadlines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Eventos</span>
                  </div>
                </div>
              </div>

              {/* Colors by Urgency */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Cores por Urgência:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="text-2xl mb-1">🔴</div>
                    <div className="font-semibold text-red-400">Vermelho</div>
                    <div className="text-xs text-slate-400 mt-1">Urgente (0-7 dias)</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="text-2xl mb-1">🟡</div>
                    <div className="font-semibold text-yellow-400">Amarelo</div>
                    <div className="text-xs text-slate-400 mt-1">Importante (8-14 dias)</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="text-2xl mb-1">🟢</div>
                    <div className="font-semibold text-green-400">Verde</div>
                    <div className="text-xs text-slate-400 mt-1">Tranquilo (15-30 dias)</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="text-2xl mb-1">🔵</div>
                    <div className="font-semibold text-blue-400">Azul</div>
                    <div className="text-xs text-slate-400 mt-1">Planejamento (30+ dias)</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <div className="text-2xl mb-1">🟣</div>
                    <div className="font-semibold text-purple-400">Roxo</div>
                    <div className="text-xs text-slate-400 mt-1">Opcional</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  💡 <strong>Dica:</strong> O sistema sugere automaticamente a cor com base na proximidade da data!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* POMODORO TAB */}
        {activeTab === 'pomodoro' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 text-center">
              <h2 className="text-2xl font-bold mb-6">⏱️ Timer Pomodoro</h2>
              
              <div className="mb-8">
                <div className="text-6xl font-mono font-bold mb-4">{formatTime(pomodoroTime)}</div>
                <div className="text-lg text-slate-300">
                  😤 Foco
                </div>
              </div>

              <div className="flex gap-4 justify-center mb-8">
                <button
                  onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isPomodoroRunning
                      ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-900'
                      : 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-slate-900'
                  }`}
                >
                  {isPomodoroRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                </button>
                <button
                  onClick={() => {
                    setIsPomodoroRunning(false)
                    setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60)
                  }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-slate-900 font-semibold transition-all"
                >
                  🔄 Resetar
                </button>
              </div>
            </div>

            {/* Estatísticas do Pomodoro */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-xl font-bold mb-4">📊 Estatísticas</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Sessões Completas</div>
                  <div className="text-3xl font-bold">{pomodoroStats.sessionsCompleted}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Pontos Ganhos</div>
                  <div className="text-3xl font-bold text-cyan-400">{pomodoroStats.pointsEarned}</div>
                </div>
              </div>
            </div>

            {/* Como funciona */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-xl p-6 border border-cyan-500/20">
              <h3 className="text-lg font-bold mb-3">📌 Como funciona?</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• 25 minutos de foco intenso</li>
                <li>• 5 minutos de pausa</li>
                <li>• +50 pontos por sessão completa</li>
                <li>• Repita e seja mais produtivo!</li>
              </ul>
            </div>
          </div>
        )}

        {/* ROUTINES TAB */}
        {activeTab === 'routines' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🔄 Minhas Rotinas
              </h2>
              <button
                onClick={() => setShowNewRoutineModal(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all transform hover:scale-105 font-semibold"
              >
                + Adicionar Rotina
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routines.map((routine) => {
                const progress = (routine.completedTasks.size / routine.tasks.length) * 100
                const isComplete = progress === 100

                return (
                  <div
                    key={routine.id}
                    className="bg-gradient-to-br from-slate-800/70 to-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/80 transition-all"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{routine.name.toLowerCase().includes('matinal') || routine.name.toLowerCase().includes('manhã') ? '🌅' : '🌙'}</span>
                        <div>
                          <h3 className="text-xl font-bold">{routine.name}</h3>
                          <p className="text-sm text-slate-400">0 de {routine.tasks.length} completas</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRoutine(routine.id)}
                        className="text-slate-400 hover:text-red-400 transition-all transform hover:scale-110"
                        title="Deletar rotina"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {routine.tasks.map((task, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-all group"
                        >
                          <input
                            type="checkbox"
                            checked={routine.completedTasks.has(index)}
                            onChange={() => toggleRoutineTask(routine.id, index)}
                            className="w-5 h-5 rounded border-2 border-slate-500 checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                          />
                          <span className={`flex-1 transition-all ${routine.completedTasks.has(index) ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {routines.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <div className="text-6xl mb-4">🔄</div>
                <p className="text-lg">Nenhuma rotina criada ainda</p>
                <p className="text-sm mt-2">Crie sua primeira rotina para organizar suas atividades diárias!</p>
              </div>
            )}
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                📊 Estatísticas & Progresso
              </h2>
              <button
                onClick={() => {
                  const { exportStatsToPDF } = require('@/lib/exportPDF')
                  exportStatsToPDF({ tasks, totalPoints, pomodoroStats })
                  showToast('📄 Relatório PDF gerado com sucesso!', 'success')
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-xl">📥</span>
                <span className="font-semibold">Exportar PDF</span>
              </button>
            </div>

            {/* Stats Cards - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-blue-400 text-sm font-semibold">Total de Tarefas</div>
                  <span className="text-2xl">📝</span>
                </div>
                <div className="text-4xl font-bold text-white">{tasks.length}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {tasks.filter(t => t.status === 'in-progress').length} em progresso
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 backdrop-blur-md rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-green-400 text-sm font-semibold">Concluídas</div>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-4xl font-bold text-green-400">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {tasks.filter(t => t.status === 'todo').length} pendentes
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/5 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-yellow-400 text-sm font-semibold">Pontos Totais</div>
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="text-4xl font-bold text-yellow-400">{totalPoints}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0)} pontos ganhos
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-purple-400 text-sm font-semibold">Taxa de Sucesso</div>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-4xl font-bold text-purple-400">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) >= 70 ? 'Excelente!' : 'Continue assim!' : 'Adicione tarefas'}
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📂 Distribuição por Categoria
                </h3>
                <div className="space-y-4">
                  {['estudos', 'domestico', 'saude', 'lazer', 'pessoal'].map((cat) => {
                    const catTasks = tasks.filter(t => t.category === cat)
                    const catCompleted = catTasks.filter(t => t.status === 'completed').length
                    const percentage = catTasks.length > 0 ? (catCompleted / catTasks.length) * 100 : 0
                    
                    const categoryIcons: Record<string, string> = {
                      estudos: '📚',
                      domestico: '🏠',
                      saude: '💪',
                      lazer: '🎮',
                      pessoal: '⭐'
                    }
                    
                    const categoryColors: Record<string, string> = {
                      estudos: 'from-blue-500 to-cyan-500',
                      domestico: 'from-orange-500 to-amber-500',
                      saude: 'from-green-500 to-emerald-500',
                      lazer: 'from-purple-500 to-pink-500',
                      pessoal: 'from-yellow-500 to-orange-500'
                    }

                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{categoryIcons[cat]}</span>
                            <span className="capitalize font-medium">{cat}</span>
                          </div>
                          <span className="text-slate-400 font-semibold">
                            {catCompleted}/{catTasks.length}
                            <span className="text-xs ml-1">({catTasks.length > 0 ? Math.round(percentage) : 0}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${categoryColors[cat]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Points by Category */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  💰 Pontos por Categoria
                </h3>
                <div className="space-y-3">
                  {['estudos', 'domestico', 'saude', 'lazer', 'pessoal'].map((cat) => {
                    const catPoints = tasks
                      .filter(t => t.category === cat && t.status === 'completed')
                      .reduce((sum, t) => sum + t.points, 0)
                    
                    const totalEarnedPoints = tasks
                      .filter(t => t.status === 'completed')
                      .reduce((sum, t) => sum + t.points, 0)
                    
                    const pointsPercentage = totalEarnedPoints > 0 ? (catPoints / totalEarnedPoints) * 100 : 0

                    const categoryIcons: Record<string, string> = {
                      estudos: '📚',
                      domestico: '🏠',
                      saude: '💪',
                      lazer: '🎮',
                      pessoal: '⭐'
                    }

                    return (
                      <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categoryIcons[cat]}</span>
                          <span className="capitalize font-medium">{cat}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold text-lg">{catPoints} pts</div>
                          <div className="text-xs text-slate-400">{Math.round(pointsPercentage)}% do total</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-yellow-400">Total Ganho:</span>
                    <span className="text-xl font-bold text-yellow-400">
                      {tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0)} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🎯 Atividade Recente
              </h3>
              {tasks.filter(t => t.status === 'completed').length > 0 ? (
                <div className="space-y-2">
                  {tasks.filter(t => t.status === 'completed').slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-xl">✓</span>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-slate-400 capitalize">{task.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-bold">+{task.points}</span>
                        <span className="text-yellow-400 text-sm">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>Complete tarefas para ver seu histórico aqui!</p>
                </div>
              )}
            </div>

            {/* Achievements Section */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🏆 Conquistas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg text-center transition-all ${tasks.filter(t => t.status === 'completed').length >= 5 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50' : 'bg-slate-700/30 border border-slate-600 opacity-50'}`}>
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="text-sm font-semibold">Iniciante</div>
                  <div className="text-xs text-slate-400">5 tarefas</div>
                </div>
                
                <div className={`p-4 rounded-lg text-center transition-all ${tasks.filter(t => t.status === 'completed').length >= 20 ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50' : 'bg-slate-700/30 border border-slate-600 opacity-50'}`}>
                  <div className="text-3xl mb-2">💪</div>
                  <div className="text-sm font-semibold">Dedicado</div>
                  <div className="text-xs text-slate-400">20 tarefas</div>
                </div>
                
                <div className={`p-4 rounded-lg text-center transition-all ${totalPoints >= 500 ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50' : 'bg-slate-700/30 border border-slate-600 opacity-50'}`}>
                  <div className="text-3xl mb-2">💎</div>
                  <div className="text-sm font-semibold">Rico</div>
                  <div className="text-xs text-slate-400">500 pontos</div>
                </div>
                
                <div className={`p-4 rounded-lg text-center transition-all ${pomodoroStats.sessionsCompleted >= 10 ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50' : 'bg-slate-700/30 border border-slate-600 opacity-50'}`}>
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-sm font-semibold">Focado</div>
                  <div className="text-xs text-slate-400">10 pomodoros</div>
                </div>
              </div>
            </div>

            {/* Advanced Charts Section */}
            <StatsCharts tasks={tasks} pomodoroStats={pomodoroStats} />
          </div>
        )}
      </div>

      {/* Pomodoro Modal */}
      {showPomodoroModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">⏱️ Timer Pomodoro</h3>
              <button
                onClick={() => setShowPomodoroModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-8">
              {/* SVG Circle Progress */}
              <div className="relative inline-block">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={
                      2 * Math.PI * 88 * (1 - pomodoroTime / (pomodoroMode === 'work' ? 25 * 60 : 5 * 60))
                    }
                    className={pomodoroMode === 'work' ? 'text-blue-500' : 'text-green-500'}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl font-mono font-bold">{formatTime(pomodoroTime)}</div>
                </div>
              </div>
              
              <div className="mt-4 text-slate-400">
                {pomodoroMode === 'work' ? 'Trabalho (25min)' : 'Intervalo (5min)'}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isPomodoroRunning
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isPomodoroRunning ? '⏸ Pausar' : '▶️ Iniciar'}
              </button>
              <button
                onClick={() => {
                  setIsPomodoroRunning(false)
                  setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60)
                }}
                className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {editingEvent ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setEditingEvent(null)
                  setEventForm({ title: '', date: '', color: 'blue', type: 'event' })
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nome do evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="event">Evento</option>
                  <option value="task">Tarefa</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cor</label>
                <div className="flex gap-2">
                  {(['red', 'yellow', 'green', 'blue', 'purple'] as const).map((color) => {
                    const colorClasses = getEventColorClasses(color)
                    return (
                      <button
                        key={color}
                        onClick={() => setEventForm({ ...eventForm, color })}
                        className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                          eventForm.color === color
                            ? `${colorClasses.border} ${colorClasses.bg}`
                            : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {colorClasses.emoji}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowEventModal(false)
                  setEditingEvent(null)
                  setEventForm({ title: '', date: '', color: 'blue', type: 'event' })
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={editingEvent ? saveEditedEvent : addEvent}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                {editingEvent ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Nova Tarefa</h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nome da tarefa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={newTaskForm.category}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="estudos">Estudos</option>
                  <option value="domestico">Doméstico</option>
                  <option value="saude">Saúde</option>
                  <option value="lazer">Lazer</option>
                  <option value="pessoal">Pessoal</option>
                </select>
              </div>

              {newTaskForm.category === 'estudos' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Matéria</label>
                  <select
                    value={newTaskForm.subject || ''}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="matematica">Matemática</option>
                    <option value="portugues">Português</option>
                    <option value="historia">História</option>
                    <option value="geografia">Geografia</option>
                    <option value="ciencias">Ciências</option>
                    <option value="biologia">Biologia</option>
                    <option value="fisica">Física</option>
                    <option value="quimica">Química</option>
                    <option value="ingles">Inglês</option>
                    <option value="artes">Artes</option>
                    <option value="educacao_fisica">Ed. Física</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newTaskForm.status}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="todo">A Fazer</option>
                  <option value="in-progress">Em Progresso</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pontos</label>
                <input
                  type="number"
                  value={newTaskForm.points}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={addNewTask}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Routine Modal */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Nova Rotina</h3>
              <button
                onClick={() => setShowNewRoutineModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Rotina</label>
                <input
                  type="text"
                  value={newRoutineForm.name}
                  onChange={(e) => setNewRoutineForm({ ...newRoutineForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: Rotina Matinal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tarefas</label>
                <div className="space-y-2">
                  {newRoutineForm.tasks.map((task, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => {
                          const newTasks = [...newRoutineForm.tasks]
                          newTasks[index] = e.target.value
                          setNewRoutineForm({ ...newRoutineForm, tasks: newTasks })
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                        placeholder={`Tarefa ${index + 1}`}
                      />
                      {newRoutineForm.tasks.length > 1 && (
                        <button
                          onClick={() => {
                            const newTasks = newRoutineForm.tasks.filter((_, i) => i !== index)
                            setNewRoutineForm({ ...newRoutineForm, tasks: newTasks })
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setNewRoutineForm({ ...newRoutineForm, tasks: [...newRoutineForm.tasks, ''] })}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  + Adicionar tarefa
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowNewRoutineModal(false)
                  setNewRoutineForm({ name: '', tasks: [''] })
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={addNewRoutine}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Editar Tarefa</h3>
              <button
                onClick={() => {
                  setShowTaskModal(false)
                  setEditingTask(null)
                }}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pontos</label>
                <input
                  type="number"
                  value={editingTask.points}
                  onChange={(e) => setEditingTask({ ...editingTask, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowTaskModal(false)
                  setEditingTask(null)
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditedTask}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-scale-in">
          <div className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    🎁 Recompensas Disponíveis
                  </h2>
                  <p className="text-sm text-white/80 mt-1">Seus pontos: {totalPoints}</p>
                </div>
                <button
                  onClick={() => setShowRewardsModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 transform duration-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {rewards.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-6xl mb-4">🎁</div>
                  <p>Nenhuma recompensa disponível ainda.</p>
                  <p className="text-sm mt-2">Seus pais podem adicionar recompensas para você!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => {
                    const canClaim = totalPoints >= reward.pointsCost && !reward.claimed
                    const insufficient = totalPoints < reward.pointsCost && !reward.claimed
                    
                    return (
                      <div
                        key={reward.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          reward.claimed
                            ? 'bg-slate-700/50 border-slate-600 opacity-60'
                            : canClaim
                            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/50 hover:border-green-400 hover:scale-105 transform'
                            : 'bg-slate-700/30 border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg">{reward.name}</h3>
                          {reward.claimed && (
                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                              ✓ Resgatada
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xl">⭐</span>
                            <span className="font-bold text-yellow-400">{reward.pointsCost}</span>
                            <span className="text-sm text-slate-400">pontos</span>
                          </div>

                          {reward.claimed ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-lg bg-slate-700 text-slate-500 cursor-not-allowed text-sm"
                            >
                              Resgatada
                            </button>
                          ) : insufficient ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-lg bg-slate-700 text-slate-400 cursor-not-allowed text-sm"
                            >
                              Insuficiente
                            </button>
                          ) : (
                            <button
                              onClick={() => claimReward(reward.id)}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 text-sm font-semibold"
                            >
                              Resgatar
                            </button>
                          )}
                        </div>

                        {insufficient && (
                          <div className="mt-2 text-xs text-orange-400/80">
                            Faltam {reward.pointsCost - totalPoints} pontos
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-300">
                  💡 <strong>Dica:</strong> Complete suas tarefas e rotinas para ganhar mais pontos e resgatar recompensas incríveis!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
