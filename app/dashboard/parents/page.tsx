'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/components/Toast'

interface Task {
  id: string
  title: string
  subtitle?: string
  time: string
  icon: string
  color: string
  completed: boolean
  date?: string
  childId?: string
  category: string // Categoria da tarefa
  recurrence: 'once' | 'daily' | 'weekly' | 'monthly' // Recorrência
  weekDays?: number[] // Para recorrência semanal (0-6, domingo-sábado)
  points: number // Pontuação ao completar
  priority: 'low' | 'medium' | 'high' // Prioridade
}

interface Child {
  id: string
  name: string
  gender: 'son' | 'daughter'
  code: string
  codeExpires: Date
  avatar?: string
  tasksCompleted: number
  totalPoints: number
}

export default function ParentsDashboard() {
  const router = useRouter()
  
  // Flag para controlar salvamento no localStorage
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Estados do dashboard antigo
  const [activeTab, setActiveTab] = useState('todo')
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: '',
    notes: '',
    date: '',
    time: '',
    childId: '',
    category: 'hygiene', // Categoria padrão
    recurrence: 'once' as 'once' | 'daily' | 'weekly' | 'monthly',
    weekDays: [] as number[],
    points: 10,
    priority: 'medium' as 'low' | 'medium' | 'high'
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [historyFilter, setHistoryFilter] = useState('Mensal')
  
  // Novos estados para gerenciamento de membros
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [children, setChildren] = useState<Child[]>([
    {
      id: '1',
      name: 'João',
      gender: 'son',
      code: 'PLANET-L9X2K-A4B7C9',
      codeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tasksCompleted: 15,
      totalPoints: 450
    },
    {
      id: '2',
      name: 'Maria',
      gender: 'daughter',
      code: 'PLANET-M8Y3L-B5C8D0',
      codeExpires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      tasksCompleted: 20,
      totalPoints: 600
    }
  ])
  const [newChildName, setNewChildName] = useState('')
  const [newChildGender, setNewChildGender] = useState<'son' | 'daughter'>('son')
  const [selectedChild, setSelectedChild] = useState<string | null>(null) // Para filtrar tarefas por filho
  
  // Novos estados para melhorias
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedTaskPoints, setCompletedTaskPoints] = useState(0)
  const [showRewardsModal, setShowRewardsModal] = useState(false)
  const [rewards, setRewards] = useState<Array<{
    id: string
    name: string
    cost: number
    icon: string
    description: string
  }>>([])
  const [newReward, setNewReward] = useState({
    name: '',
    cost: 50,
    icon: '🎁',
    description: ''
  })

  // Estados para rotinas
  const [routines, setRoutines] = useState<Array<{
    id: string
    name: string
    type: 'morning' | 'night' | 'custom'
    tasks: Array<{ id: string; title: string; completed: boolean }>
    icon: string
  }>>([
    {
      id: '1',
      name: 'Rotina Matinal',
      type: 'morning',
      icon: '🌅',
      tasks: [
        { id: '1', title: 'Escovar os dentes', completed: false },
        { id: '2', title: 'Arrumar a cama', completed: false },
        { id: '3', title: 'Tomar café', completed: false }
      ]
    },
    {
      id: '2',
      name: 'Rotina Noturna',
      type: 'night',
      icon: '🌙',
      tasks: [
        { id: '1', title: 'Jantar', completed: false },
        { id: '2', title: 'Escovar os dentes', completed: false },
        { id: '3', title: 'Ler um livro', completed: false },
        { id: '4', title: 'Dormir cedo', completed: false }
      ]
    }
  ])
  const [showAddRoutine, setShowAddRoutine] = useState(false)
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    type: 'custom' as 'morning' | 'night' | 'custom',
    tasks: ['']
  })

  // Sistema de conquistas
  const [achievements, setAchievements] = useState([
    { id: '1', name: 'Primeira Tarefa', icon: '🎯', description: 'Complete sua primeira tarefa', unlocked: false, condition: () => tasks.filter(t => t.completed).length >= 1 },
    { id: '2', name: 'Maratonista', icon: '🏃', description: 'Complete 10 tarefas', unlocked: false, condition: () => tasks.filter(t => t.completed).length >= 10 },
    { id: '3', name: 'Perfeccionista', icon: '⭐', description: 'Complete 20 tarefas sem falhar', unlocked: false, condition: () => tasks.filter(t => t.completed).length >= 20 },
    { id: '4', name: 'Rei/Rainha', icon: '👑', description: 'Seja o 1º no ranking', unlocked: false, condition: () => true },
    { id: '5', name: 'Milionário', icon: '💰', description: 'Acumule 1000 pontos', unlocked: false, condition: () => stats.totalPoints >= 1000 },
    { id: '6', name: 'Streak Master', icon: '🔥', description: '7 dias consecutivos', unlocked: false, condition: () => true },
  ])
  const [showAchievements, setShowAchievements] = useState(false)

  // Estados para Toast e Edição
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'task' | 'child'; id: string } | null>(null)

  // Categorias de tarefas com ícones
  const taskCategories = [
    { id: 'hygiene', name: 'Higiene', icon: '🧼', color: 'bg-blue-400' },
    { id: 'school', name: 'Escola', icon: '📚', color: 'bg-purple-400' },
    { id: 'domestic', name: 'Doméstico', icon: '🏠', color: 'bg-green-400' },
    { id: 'food', name: 'Alimentação', icon: '🍽️', color: 'bg-orange-400' },
    { id: 'leisure', name: 'Lazer', icon: '🎮', color: 'bg-pink-400' },
    { id: 'sleep', name: 'Sono', icon: '💤', color: 'bg-indigo-400' },
    { id: 'responsibility', name: 'Responsabilidades', icon: '🎯', color: 'bg-yellow-400' }
  ]

  // LocalStorage - Carregar dados ao montar
  useEffect(() => {
    const savedTasks = localStorage.getItem('organizekids_tasks')
    const savedChildren = localStorage.getItem('organizekids_children')
    const savedRewards = localStorage.getItem('organizekids_rewards')
    const savedRoutines = localStorage.getItem('organizekids_routines')

    if (savedTasks) {
      const parsed = JSON.parse(savedTasks)
      console.log('📥 Carregando tarefas do localStorage:', parsed.length, 'tarefas')
      setTasks(parsed)
    }
    if (savedChildren) {
      const parsed = JSON.parse(savedChildren)
      console.log('📥 Carregando filhos do localStorage:', parsed.length, 'filhos')
      setChildren(parsed)
    }
    if (savedRewards) setRewards(JSON.parse(savedRewards))
    if (savedRoutines) setRoutines(JSON.parse(savedRoutines))
  }, [])

  // LocalStorage - Salvar dados quando mudam (com flag para evitar salvar na primeira renderização)
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      return
    }
    console.log('💾 Salvando tarefas no localStorage:', tasks.length, 'tarefas')
    localStorage.setItem('organizekids_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('organizekids_children', JSON.stringify(children))
  }, [children])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('organizekids_rewards', JSON.stringify(rewards))
  }, [rewards])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('organizekids_routines', JSON.stringify(routines))
  }, [routines])

  // Sistema de Recorrência - Regenerar tarefas recorrentes
  useEffect(() => {
    const checkAndRegenerateTasks = () => {
      const today = new Date().toISOString().split('T')[0]
      const lastCheck = localStorage.getItem('organizekids_lastcheck')
      
      // Se já verificou hoje, não faz nada
      if (lastCheck === today) return

      // Marca que verificou hoje
      localStorage.setItem('organizekids_lastcheck', today)

      const category = taskCategories.find(c => c.id === 'hygiene') || taskCategories[0]

      // Filtra tarefas que precisam ser regeneradas
      const tasksToRegenerate: Task[] = []

      tasks.forEach(task => {
        // Pula tarefas que não são recorrentes ou que já foram completadas hoje
        if (task.recurrence === 'once') return
        
        const taskDate = task.date || today
        const isOldTask = taskDate < today

        // Diária: cria nova se a tarefa é de um dia anterior
        if (task.recurrence === 'daily' && isOldTask) {
          tasksToRegenerate.push({
            ...task,
            id: `${Date.now()}-${Math.random()}`,
            date: today,
            completed: false
          })
        }

        // Semanal: verifica se hoje é um dos dias da semana
        if (task.recurrence === 'weekly' && task.weekDays && task.weekDays.length > 0) {
          const todayWeekDay = new Date().getDay() // 0 = domingo, 6 = sábado
          
          if (task.weekDays.includes(todayWeekDay) && isOldTask) {
            tasksToRegenerate.push({
              ...task,
              id: `${Date.now()}-${Math.random()}`,
              date: today,
              completed: false
            })
          }
        }

        // Mensal: verifica se hoje é o mesmo dia do mês
        if (task.recurrence === 'monthly') {
          const taskDay = new Date(taskDate).getDate()
          const todayDay = new Date().getDate()
          
          if (taskDay === todayDay && isOldTask) {
            tasksToRegenerate.push({
              ...task,
              id: `${Date.now()}-${Math.random()}`,
              date: today,
              completed: false
            })
          }
        }
      })

      // Adiciona as novas tarefas se houver alguma
      if (tasksToRegenerate.length > 0) {
        const updatedTasks = [...tasks, ...tasksToRegenerate]
        setTasks(updatedTasks)
        // Salva explicitamente no localStorage
        localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
        console.log(`✅ ${tasksToRegenerate.length} tarefa(s) recorrente(s) regenerada(s) para hoje!`)
      }
    }

    // Verifica imediatamente ao carregar
    checkAndRegenerateTasks()

    // Verifica a cada hora (3600000ms) se mudou o dia
    const interval = setInterval(checkAndRegenerateTasks, 3600000)

    return () => clearInterval(interval)
  }, [tasks, taskCategories])

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setToast({ message: 'Por favor, adicione um título para a tarefa', type: 'error' })
      return
    }

    const category = taskCategories.find(c => c.id === newTask.category)

    // Se está editando uma tarefa existente
    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: newTask.title,
        subtitle: newTask.notes || undefined,
        time: newTask.time || '00:00',
        icon: category?.icon || '📝',
        color: category?.color || 'bg-blue-400',
        date: newTask.date || undefined,
        childId: newTask.childId || undefined,
        category: newTask.category,
        recurrence: newTask.recurrence,
        weekDays: newTask.weekDays,
        points: newTask.points,
        priority: newTask.priority
      }

      const updatedTasks = tasks.map(t => t.id === editingTask.id ? updatedTask : t)
      setTasks(updatedTasks)
      // Salvar imediatamente
      localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
      
      setToast({ message: 'Tarefa atualizada com sucesso! ✨', type: 'success' })
      setEditingTask(null)
    } else {
      // Define a data automaticamente para tarefas recorrentes
      const today = new Date().toISOString().split('T')[0]
      const taskDate = newTask.recurrence !== 'once' ? today : (newTask.date || undefined)

      // Se não selecionou filho específico, cria para todos
      if (!newTask.childId && children.length > 0) {
        const newTasks = children.map(child => ({
          id: `${Date.now()}-${child.id}`,
          title: newTask.title,
          subtitle: newTask.notes || undefined,
          time: newTask.time || '00:00',
          icon: category?.icon || '📝',
          color: category?.color || 'bg-blue-400',
          completed: false,
          date: taskDate,
          childId: child.id,
          category: newTask.category,
          recurrence: newTask.recurrence,
          weekDays: newTask.weekDays,
          points: newTask.points,
          priority: newTask.priority
        }))
        
        const updatedTasks = [...tasks, ...newTasks]
        setTasks(updatedTasks)
        // Salvar imediatamente
        console.log('✅ Criando', newTasks.length, 'tarefas para todos os filhos. Total de tarefas:', updatedTasks.length)
        localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
        
        const count = children.length
        setToast({ 
          message: `${count} tarefas criadas com sucesso! 🎉`, 
          type: 'success' 
        })
      } else {
        // Cria tarefa para filho específico ou sem filho
        const task: Task = {
          id: Date.now().toString(),
          title: newTask.title,
          subtitle: newTask.notes || undefined,
          time: newTask.time || '00:00',
          icon: category?.icon || '📝',
          color: category?.color || 'bg-blue-400',
          completed: false,
          date: taskDate,
          childId: newTask.childId || undefined,
          category: newTask.category,
          recurrence: newTask.recurrence,
          weekDays: newTask.weekDays,
          points: newTask.points,
          priority: newTask.priority
        }

        const updatedTasks = [...tasks, task]
        setTasks(updatedTasks)
        // Salvar imediatamente
        console.log('✅ Criando 1 tarefa. Total de tarefas:', updatedTasks.length)
        console.log('📋 Tarefa criada:', task)
        localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
        
        setToast({ message: '1 tarefa criada com sucesso! 🎉', type: 'success' })
      }
    }

    // Resetar formulário
    setNewTask({ 
      title: '', 
      notes: '', 
      date: '', 
      time: '', 
      childId: '',
      category: 'hygiene',
      recurrence: 'once',
      weekDays: [],
      points: 10,
      priority: 'medium'
    })
    setShowAddTask(false)
    setShowDatePicker(false)
  }

  // Função para deletar tarefa
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    // Salvar imediatamente
    localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
    
    setToast({ message: 'Tarefa deletada com sucesso!', type: 'success' })
    setConfirmDelete(null)
  }

  // Função para deletar filho
  const handleDeleteChild = (childId: string) => {
    const updatedChildren = children.filter(c => c.id !== childId)
    setChildren(updatedChildren)
    // Salvar imediatamente
    localStorage.setItem('organizekids_children', JSON.stringify(updatedChildren))
    
    // Remove tarefas do filho também
    const updatedTasks = tasks.filter(t => t.childId !== childId)
    setTasks(updatedTasks)
    // Salvar imediatamente
    localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))
    
    setToast({ message: 'Filho removido com sucesso!', type: 'success' })
    setConfirmDelete(null)
  }

  const generateCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PLANET-${timestamp}-${random}`
  }

  const handleAddChild = () => {
    if (!newChildName.trim()) {
      setToast({ message: 'Por favor, adicione um nome para o filho', type: 'error' })
      return
    }

    const newChild: Child = {
      id: Date.now().toString(),
      name: newChildName,
      gender: newChildGender,
      code: generateCode(),
      codeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tasksCompleted: 0,
      totalPoints: 0
    }

    const updatedChildren = [...children, newChild]
    setChildren(updatedChildren)
    // Salvar imediatamente
    localStorage.setItem('organizekids_children', JSON.stringify(updatedChildren))
    
    setNewChildName('')
    setNewChildGender('son')
    setToast({ message: `${newChildName} adicionado com sucesso! 🎉`, type: 'success' })
  }

  const regenerateCode = (childId: string) => {
    const updatedChildren = children.map(child => 
      child.id === childId 
        ? { ...child, code: generateCode(), codeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
        : child
    )
    setChildren(updatedChildren)
    // Salvar imediatamente
    localStorage.setItem('organizekids_children', JSON.stringify(updatedChildren))
    
    setToast({ message: 'Código regenerado com sucesso!', type: 'success' })
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setToast({ message: 'Código copiado para área de transferência! 📋', type: 'success' })
  }

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_type')
    router.push('/')
  }

  // Função para completar tarefa com animação
  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    // Mostrar confete
    setCompletedTaskPoints(task.points)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    // Marcar tarefa como completa
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    )
    setTasks(updatedTasks)
    // Salvar imediatamente
    localStorage.setItem('organizekids_tasks', JSON.stringify(updatedTasks))

    // Adicionar pontos ao filho
    if (task.childId) {
      const updatedChildren = children.map(c => 
        c.id === task.childId 
          ? { ...c, totalPoints: c.totalPoints + task.points, tasksCompleted: c.tasksCompleted + 1 }
          : c
      )
      setChildren(updatedChildren)
      // Salvar imediatamente
      localStorage.setItem('organizekids_children', JSON.stringify(updatedChildren))
    }
  }

  // Estatísticas calculadas
  const stats = {
    totalPoints: children.reduce((sum, child) => sum + child.totalPoints, 0),
    tasksCompletedToday: tasks.filter(t => t.completed && t.date === new Date().toISOString().split('T')[0]).length,
    totalTasksToday: tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length,
    activeChildren: children.length
  }

  // Filtrar tarefas por filho selecionado e busca
  const filteredTasks = tasks.filter(task => {
    const matchesChild = selectedChild ? task.childId === selectedChild : true
    const matchesSearch = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchesChild && matchesSearch
  })

  return (
    <div 
      className='min-h-screen relative overflow-hidden'
      style={{
        backgroundImage: 'url(/space-background-new.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Gradient overlay */}
      <div 
        className='absolute inset-0'
        style={{
          background: 'linear-gradient(135deg, rgba(27, 3, 55, 0.45) 0%, rgba(18, 3, 38, 0.55) 100%)',
        }}
      />

      {/* Animação de Confete */}
      {showConfetti && (
        <div className='fixed inset-0 z-50 pointer-events-none flex items-center justify-center'>
          {/* Confete */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className='absolute w-2 h-2 animate-bounce'
              style={{
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: `${50 + (Math.random() - 0.5) * 60}%`,
                background: ['#FFD700', '#FF6B9D', '#5FB6D9', '#94D6E8', '#A78BFA'][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                animation: `fall ${1 + Math.random()}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}
          
          {/* Texto de Pontos */}
          <div 
            className='text-6xl font-bold text-yellow-400 animate-ping'
            style={{
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              animation: 'float 2s ease-out forwards'
            }}
          >
            +{completedTaskPoints} pts! 🎉
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float {
          0% {
            transform: scale(0) translateY(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) translateY(-30px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>

      {/* Modal de Gerenciar Membros */}
      {showMembersModal && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowMembersModal(false)}
        >
          <div 
            className='w-full max-w-2xl bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-white text-2xl font-bold'>👨‍👩‍👧‍👦 Gerenciar Membros</h2>
              <button
                onClick={() => setShowMembersModal(false)}
                className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
              >
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Lista de Filhos */}
            <div className='space-y-4 mb-6'>
              {children.map(child => (
                <div 
                  key={child.id}
                  className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='text-3xl'>{child.gender === 'son' ? '👦' : '👧'}</div>
                      <div>
                        <h3 className='text-white font-bold text-lg'>{child.name}</h3>
                        <p className='text-white/70 text-sm'>
                          {child.tasksCompleted} tarefas • {child.totalPoints} pontos
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => setConfirmDelete({ type: 'child', id: child.id })}
                        className='w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110'
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        }}
                        title='Deletar filho'
                      >
                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}
                        className='px-4 py-2 rounded-xl text-sm font-medium transition-all'
                        style={{
                          background: selectedChild === child.id 
                            ? 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 100%)'
                            : 'rgba(255,255,255,0.1)',
                          color: 'white'
                        }}
                      >
                        {selectedChild === child.id ? 'Vendo perfil' : 'Ver perfil'}
                      </button>
                    </div>
                  </div>

                  <div className='bg-black/20 rounded-xl p-3'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-white/70 text-sm'>Código de Acesso:</span>
                      <span className='text-white/50 text-xs'>
                        Expira: {new Date(child.codeExpires).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <code className='flex-1 bg-black/30 px-3 py-2 rounded-lg text-cyan-400 font-mono text-sm'>
                        {child.code}
                      </code>
                      <button
                        onClick={() => copyCode(child.code)}
                        className='p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all'
                        title='Copiar código'
                      >
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                        </svg>
                      </button>
                      <button
                        onClick={() => regenerateCode(child.id)}
                        className='p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all'
                        title='Gerar novo código'
                      >
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar novo filho */}
            <div className='border-t border-white/20 pt-6'>
              <h3 className='text-white font-bold mb-4'>Adicionar Novo Filho</h3>
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Nome do filho'
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className='w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                />
                <div className='flex space-x-3'>
                  <button
                    onClick={() => setNewChildGender('son')}
                    className='flex-1 py-3 rounded-xl font-medium transition-all'
                    style={{
                      background: newChildGender === 'son' 
                        ? 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 100%)'
                        : 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  >
                    👦 Filho
                  </button>
                  <button
                    onClick={() => setNewChildGender('daughter')}
                    className='flex-1 py-3 rounded-xl font-medium transition-all'
                    style={{
                      background: newChildGender === 'daughter' 
                        ? 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)'
                        : 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  >
                    👧 Filha
                  </button>
                </div>
                <button
                  onClick={handleAddChild}
                  disabled={!newChildName.trim()}
                  className='w-full py-4 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  style={{
                    background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 100%)',
                    boxShadow: '0 4px 15px rgba(95, 182, 217, 0.4)'
                  }}
                >
                  Adicionar Filho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Recompensas */}
      {showRewardsModal && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowRewardsModal(false)}
        >
          <div 
            className='w-full max-w-2xl bg-gradient-to-b from-yellow-900/95 to-orange-900/95 backdrop-blur-md rounded-3xl p-6 space-y-6 shadow-2xl border border-yellow-300/20 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-2xl font-bold'>🎁 Sistema de Recompensas</h2>
              <button
                onClick={() => setShowRewardsModal(false)}
                className='text-white/70 hover:text-white transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Formulário para Criar Recompensa */}
            <div className='bg-white/10 rounded-2xl p-4 space-y-3'>
              <h3 className='text-white font-bold text-lg'>➕ Criar Nova Recompensa</h3>
              
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-white/70 text-sm mb-1 block'>Nome da Recompensa</label>
                  <input
                    type='text'
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder='Ex: 30min videogame'
                    className='w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                  />
                </div>
                
                <div>
                  <label className='text-white/70 text-sm mb-1 block'>Custo em Pontos</label>
                  <input
                    type='number'
                    value={newReward.cost}
                    onChange={(e) => setNewReward({ ...newReward, cost: parseInt(e.target.value) || 0 })}
                    className='w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400'
                  />
                </div>
              </div>

              <div>
                <label className='text-white/70 text-sm mb-1 block'>Descrição</label>
                <input
                  type='text'
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  placeholder='Descrição opcional'
                  className='w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                />
              </div>

              <button
                onClick={() => {
                  if (newReward.name && newReward.cost > 0) {
                    const updatedRewards = [...rewards, {
                      id: Date.now().toString(),
                      ...newReward
                    }]
                    setRewards(updatedRewards)
                    // Salvar imediatamente
                    localStorage.setItem('organizekids_rewards', JSON.stringify(updatedRewards))
                    
                    setNewReward({ name: '', cost: 50, icon: '🎁', description: '' })
                  }
                }}
                className='w-full py-3 rounded-xl text-white font-bold transition-all'
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                }}
              >
                ➕ Criar Recompensa
              </button>
            </div>

            {/* Lista de Recompensas */}
            <div className='space-y-3'>
              <h3 className='text-white font-bold text-lg'>🎯 Recompensas Disponíveis</h3>
              
              {rewards.length > 0 ? (
                rewards.map(reward => (
                  <div 
                    key={reward.id}
                    className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-3xl'>{reward.icon}</span>
                      <div>
                        <p className='text-white font-bold'>{reward.name}</p>
                        {reward.description && (
                          <p className='text-white/70 text-sm'>{reward.description}</p>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-yellow-400 font-bold text-xl'>{reward.cost}</p>
                      <p className='text-white/70 text-xs'>pontos</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <p className='text-white/50 text-lg'>Nenhuma recompensa criada ainda</p>
                  <p className='text-white/40 text-sm mt-2'>Crie a primeira recompensa acima! 🎁</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conquistas */}
      {showAchievements && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowAchievements(false)}
        >
          <div 
            className='w-full max-w-2xl bg-gradient-to-b from-yellow-900/95 to-amber-900/95 backdrop-blur-md rounded-3xl p-6 space-y-6 shadow-2xl border border-yellow-300/20 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-2xl font-bold'>🏆 Conquistas</h2>
              <button
                onClick={() => setShowAchievements(false)}
                className='text-white/70 hover:text-white transition-colors'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Progresso Geral */}
            <div className='bg-white/10 rounded-2xl p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-white font-bold'>Progresso Total</span>
                <span className='text-white/70'>
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </span>
              </div>
              <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden'>
                <div 
                  className='h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500'
                  style={{ 
                    width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Lista de Conquistas */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
                      : 'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className='flex items-start space-x-3'>
                    <div className={`text-4xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-white font-bold mb-1'>{achievement.name}</h3>
                      <p className='text-white/70 text-sm'>{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className='mt-2 flex items-center space-x-1'>
                          <span className='text-green-400 text-xs'>✓ Desbloqueado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dica */}
            <div className='bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4'>
              <p className='text-blue-200 text-sm'>
                💡 <strong>Dica:</strong> Complete mais tarefas e ganhe pontos para desbloquear todas as conquistas!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Tarefa */}
      {showAddTask && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTask(false)
              setShowDatePicker(false)
            }
          }}
        >
          <div 
            className='w-full max-w-2xl bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl p-6 space-y-4 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-xl font-bold'>
                {editingTask ? '✏️ Editar Tarefa' : '✨ Criar Nova Tarefa'}
              </h2>
              <button
                onClick={() => {
                  setShowAddTask(false)
                  setEditingTask(null)
                  setNewTask({ 
                    title: '', 
                    notes: '', 
                    date: '', 
                    time: '', 
                    childId: '',
                    category: 'hygiene',
                    recurrence: 'once',
                    weekDays: [],
                    points: 10,
                    priority: 'medium'
                  })
                }}
                className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
              >
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Categoria */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Categoria</label>
              <div className='grid grid-cols-3 gap-2'>
                {taskCategories.map(cat => (
                  <button
                    key={cat.id}
                    type='button'
                    onClick={() => setNewTask({ ...newTask, category: cat.id })}
                    className='p-3 rounded-xl flex flex-col items-center space-y-1 transition-all border-2'
                    style={{
                      background: newTask.category === cat.id 
                        ? 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
                        : 'rgba(255,255,255,0.05)',
                      borderColor: newTask.category === cat.id ? '#5FB6D9' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <span className='text-2xl'>{cat.icon}</span>
                    <span className='text-white text-xs'>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nome da tarefa */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Nome da Tarefa</label>
              <input
                type="text"
                placeholder="Ex: Escovar os dentes"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all'
              />
            </div>

            {/* Selecionar filho */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Para Qual Filho?</label>
              <select
                value={newTask.childId}
                onChange={(e) => setNewTask({ ...newTask, childId: e.target.value })}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all'
              >
                <option value="" className='bg-purple-900'>👨‍👩‍👧‍👦 Todos os filhos</option>
                {children.map(child => (
                  <option key={child.id} value={child.id} className='bg-purple-900'>
                    {child.gender === 'son' ? '👦' : '👧'} {child.name}
                  </option>
                ))}
              </select>
              {!newTask.childId && (
                <p className='text-cyan-300 text-xs mt-1'>💡 A tarefa será criada para todos os filhos</p>
              )}
            </div>

            {/* Recorrência */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Recorrência</label>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { id: 'once', label: 'Uma vez', icon: '1️⃣' },
                  { id: 'daily', label: 'Diariamente', icon: '📅' },
                  { id: 'weekly', label: 'Semanalmente', icon: '🗓️' },
                  { id: 'monthly', label: 'Mensalmente', icon: '📆' }
                ].map(rec => (
                  <button
                    key={rec.id}
                    type='button'
                    onClick={() => setNewTask({ ...newTask, recurrence: rec.id as any })}
                    className='p-3 rounded-xl flex items-center space-x-2 transition-all border-2'
                    style={{
                      background: newTask.recurrence === rec.id 
                        ? 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
                        : 'rgba(255,255,255,0.05)',
                      borderColor: newTask.recurrence === rec.id ? '#5FB6D9' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <span>{rec.icon}</span>
                    <span className='text-white text-sm'>{rec.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dias da semana (se recorrência semanal) */}
            {newTask.recurrence === 'weekly' && (
              <div>
                <label className='text-white text-sm font-medium mb-2 block'>Dias da Semana</label>
                <div className='flex space-x-2'>
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => {
                        const days = newTask.weekDays.includes(index)
                          ? newTask.weekDays.filter(d => d !== index)
                          : [...newTask.weekDays, index]
                        setNewTask({ ...newTask, weekDays: days })
                      }}
                      className='w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm transition-all'
                      style={{
                        background: newTask.weekDays.includes(index)
                          ? 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 100%)'
                          : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Data e Hora */}
            <div className='flex space-x-3'>
              <div className='flex-1'>
                <label className='text-white text-sm font-medium mb-2 block'>Data</label>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                />
              </div>
              <div className='flex-1'>
                <label className='text-white text-sm font-medium mb-2 block'>Hora</label>
                <input
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                />
              </div>
            </div>

            {/* Pontuação e Prioridade */}
            <div className='flex space-x-3'>
              <div className='flex-1'>
                <label className='text-white text-sm font-medium mb-2 block'>Pontos</label>
                <div className='flex space-x-2'>
                  {[10, 20, 50, 100].map(pts => (
                    <button
                      key={pts}
                      type='button'
                      onClick={() => setNewTask({ ...newTask, points: pts })}
                      className='flex-1 py-2 rounded-xl text-white font-bold transition-all'
                      style={{
                        background: newTask.points === pts
                          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                          : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      {pts}
                    </button>
                  ))}
                </div>
              </div>
              <div className='flex-1'>
                <label className='text-white text-sm font-medium mb-2 block'>Prioridade</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                >
                  <option value="low" className='bg-purple-900'>🟢 Baixa</option>
                  <option value="medium" className='bg-purple-900'>🟡 Média</option>
                  <option value="high" className='bg-purple-900'>🔴 Alta</option>
                </select>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Observações</label>
              <textarea
                placeholder="Adicione detalhes sobre a tarefa..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                rows={3}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none transition-all'
              />
            </div>

            {/* Botão Adicionar/Salvar */}
            <button
              onClick={handleAddTask}
              disabled={!newTask.title.trim()}
              className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl text-white font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              {editingTask ? 'Salvar Alterações' : 'Adicionar'}
            </button>
          </div>
        </div>
      )}

      {/* Modal Adicionar Rotina */}
      {showAddRoutine && (
        <div 
          className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setShowAddRoutine(false)}
        >
          <div 
            className='w-full max-w-2xl bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-md rounded-3xl p-6 space-y-4 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <h2 className='text-white text-xl font-bold'>🔄 Criar Nova Rotina</h2>
              <button
                onClick={() => {
                  setShowAddRoutine(false)
                  setNewRoutine({ name: '', type: 'custom', tasks: [''] })
                }}
                className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'
              >
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Nome da Rotina */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Nome da Rotina</label>
              <input
                type="text"
                placeholder="Ex: Rotina de Estudos"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                className='w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all'
              />
            </div>

            {/* Tipo de Rotina */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Tipo de Rotina</label>
              <div className='grid grid-cols-3 gap-3'>
                <button
                  type='button'
                  onClick={() => setNewRoutine({ ...newRoutine, type: 'morning' })}
                  className='p-4 rounded-xl flex flex-col items-center space-y-2 transition-all border-2'
                  style={{
                    background: newRoutine.type === 'morning' 
                      ? 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: newRoutine.type === 'morning' ? '#5FB6D9' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <span className='text-3xl'>🌅</span>
                  <span className='text-white text-sm font-medium'>Matinal</span>
                </button>
                <button
                  type='button'
                  onClick={() => setNewRoutine({ ...newRoutine, type: 'night' })}
                  className='p-4 rounded-xl flex flex-col items-center space-y-2 transition-all border-2'
                  style={{
                    background: newRoutine.type === 'night' 
                      ? 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: newRoutine.type === 'night' ? '#5FB6D9' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <span className='text-3xl'>🌙</span>
                  <span className='text-white text-sm font-medium'>Noturna</span>
                </button>
                <button
                  type='button'
                  onClick={() => setNewRoutine({ ...newRoutine, type: 'custom' })}
                  className='p-4 rounded-xl flex flex-col items-center space-y-2 transition-all border-2'
                  style={{
                    background: newRoutine.type === 'custom' 
                      ? 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: newRoutine.type === 'custom' ? '#5FB6D9' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <span className='text-3xl'>⚙️</span>
                  <span className='text-white text-sm font-medium'>Customizada</span>
                </button>
              </div>
            </div>

            {/* Tarefas da Rotina */}
            <div>
              <label className='text-white text-sm font-medium mb-2 block'>Tarefas da Rotina</label>
              <div className='space-y-2'>
                {newRoutine.tasks.map((task, index) => (
                  <div key={index} className='flex items-center space-x-2'>
                    <input
                      type="text"
                      placeholder={`Tarefa ${index + 1}`}
                      value={task}
                      onChange={(e) => {
                        const updatedTasks = [...newRoutine.tasks]
                        updatedTasks[index] = e.target.value
                        setNewRoutine({ ...newRoutine, tasks: updatedTasks })
                      }}
                      className='flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all'
                    />
                    {newRoutine.tasks.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedTasks = newRoutine.tasks.filter((_, i) => i !== index)
                          setNewRoutine({ ...newRoutine, tasks: updatedTasks })
                        }}
                        className='w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition-all'
                      >
                        <svg className='w-4 h-4 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setNewRoutine({ ...newRoutine, tasks: [...newRoutine.tasks, ''] })}
                className='mt-3 w-full py-2 rounded-xl border-2 border-dashed border-white/30 text-white/70 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center justify-center space-x-2'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                <span>Adicionar Tarefa</span>
              </button>
            </div>

            {/* Botão Criar */}
            <button
              onClick={() => {
                if (!newRoutine.name.trim()) {
                  setToast({ message: 'Por favor, adicione um nome para a rotina', type: 'error' })
                  return
                }
                
                const validTasks = newRoutine.tasks.filter(t => t.trim())
                if (validTasks.length === 0) {
                  setToast({ message: 'Por favor, adicione pelo menos uma tarefa', type: 'error' })
                  return
                }

                const iconMap = {
                  morning: '🌅',
                  night: '🌙',
                  custom: '⚙️'
                }

                const routine = {
                  id: Date.now().toString(),
                  name: newRoutine.name,
                  type: newRoutine.type,
                  icon: iconMap[newRoutine.type],
                  tasks: validTasks.map((title, i) => ({
                    id: `${Date.now()}-${i}`,
                    title,
                    completed: false
                  }))
                }

                const updatedRoutines = [...routines, routine]
                setRoutines(updatedRoutines)
                // Salvar imediatamente
                localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                
                setNewRoutine({ name: '', type: 'custom', tasks: [''] })
                setShowAddRoutine(false)
                setToast({ message: 'Rotina criada com sucesso! 🎉', type: 'success' })
              }}
              disabled={!newRoutine.name.trim()}
              className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-4 rounded-2xl text-white font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              Criar Rotina
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 pt-8'>
          <div>
            <h1 className='text-white text-2xl font-bold'>
              {selectedChild ? `Perfil de ${children.find(c => c.id === selectedChild)?.name}` : 'Dashboard dos Pais'}
            </h1>
            {selectedChild && (
              <button
                onClick={() => setSelectedChild(null)}
                className='text-cyan-400 text-sm mt-1 hover:underline'
              >
                ← Voltar para visão geral
              </button>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setShowMembersModal(true)}
              className='px-4 py-2 backdrop-blur-md rounded-xl flex items-center space-x-2 border border-white/30 hover:shadow-lg transition-all'
              style={{
                background: 'linear-gradient(135deg, rgba(95, 182, 217, 0.3) 0%, rgba(65, 127, 166, 0.3) 100%)'
              }}
            >
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
              <span className='text-white font-medium text-sm'>Membros</span>
            </button>
            <button 
              onClick={() => setShowAddTask(true)}
              className='px-4 py-2 backdrop-blur-md rounded-xl flex items-center space-x-2 border border-white/30 hover:shadow-lg transition-all'
              style={{
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              }}
            >
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              <span className='text-white font-medium text-sm'>Criar Tarefa</span>
            </button>
            <button
              onClick={() => setShowAchievements(true)}
              className='px-4 py-2 backdrop-blur-md rounded-xl flex items-center space-x-2 border border-white/30 hover:shadow-lg transition-all'
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)'
              }}
            >
              <span className='text-2xl'>🏆</span>
              <span className='text-white font-medium text-sm'>Conquistas</span>
            </button>
            <button
              onClick={handleLogout}
              className='px-4 py-2 rounded-xl text-white font-medium transition-all text-sm'
              style={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)',
                boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
              }}
            >
              Sair
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className='px-4 mb-6'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {/* Total de Pontos */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'>
              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-2xl'>⭐</span>
                <span className='text-white/70 text-xs'>Pontos Totais</span>
              </div>
              <p className='text-white text-2xl font-bold'>{stats.totalPoints}</p>
            </div>

            {/* Tarefas Hoje */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'>
              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-2xl'>✅</span>
                <span className='text-white/70 text-xs'>Tarefas Hoje</span>
              </div>
              <p className='text-white text-2xl font-bold'>
                {stats.tasksCompletedToday}/{stats.totalTasksToday}
              </p>
            </div>

            {/* Crianças Ativas */}
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20'>
              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-2xl'>👨‍👩‍👧‍👦</span>
                <span className='text-white/70 text-xs'>Crianças</span>
              </div>
              <p className='text-white text-2xl font-bold'>{stats.activeChildren}</p>
            </div>

            {/* Botão Recompensas */}
            <button
              onClick={() => setShowRewardsModal(true)}
              className='bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-md rounded-2xl p-4 border border-yellow-300/30 hover:scale-105 transition-all'
            >
              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-2xl'>🎁</span>
                <span className='text-white/70 text-xs'>Recompensas</span>
              </div>
              <p className='text-white text-sm font-bold'>{rewards.length} disponíveis</p>
            </button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className='px-4 mb-6'>
          <div className='flex flex-col sm:flex-row gap-3'>
            {/* Busca */}
            <div className='flex-1 relative'>
              <input
                type='text'
                placeholder='🔍 Buscar tarefa...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
              />
            </div>

            {/* Filtro por Filho */}
            <select
              value={selectedChild || ''}
              onChange={(e) => setSelectedChild(e.target.value || null)}
              className='px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
              style={{
                backgroundImage: 'none',
              }}
            >
              <option value='' style={{ background: '#1B0337', color: 'white' }}>👨‍👩‍👧‍👦 Todos os filhos</option>
              {children.map(child => (
                <option key={child.id} value={child.id} style={{ background: '#1B0337', color: 'white' }}>
                  {child.gender === 'son' ? '👦' : '👧'} {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className='px-4 mb-6'>
          <div className='flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20'>
            <button
              onClick={() => setActiveTab('todo')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'todo'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'todo' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              📝 Tarefas
            </button>
            <button
              onClick={() => setActiveTab('routine')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'routine'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'routine' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              🔄 Rotinas
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'progress'
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
              style={activeTab === 'progress' ? {
                background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)'
              } : {}}
            >
              📊 Progresso
            </button>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className='flex-1 px-4 pb-20'>
          {/* Tab de Tarefas */}
          {activeTab === 'todo' && (
            <div className='space-y-6'>
              {/* HOJE */}
              <div>
                <h2 className='text-white text-lg font-bold mb-4'>HOJE</h2>
                <div className='space-y-3'>
                  {(() => {
                    const today = new Date().toISOString().split('T')[0]
                    const todayTasks = filteredTasks.filter(task => 
                      !task.completed && (!task.date || task.date === today)
                    )
                    console.log('📅 Tarefas para hoje:', todayTasks.length, 'de', filteredTasks.length, 'filtradas')
                    return todayTasks.length > 0 ? (
                      todayTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border flex items-center justify-between transition-all ${
                          task.priority === 'high' 
                            ? 'border-red-400 shadow-lg shadow-red-500/50 animate-pulse' 
                            : 'border-white/20'
                        }`}
                      >
                        <div className='flex items-center space-x-3 flex-1'>
                          <div className={`w-10 h-10 ${task.color} rounded-full flex items-center justify-center text-xl`}>
                            {task.icon}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2'>
                              <p className='text-white font-medium'>{task.title}</p>
                              {task.priority === 'high' && <span className='text-red-400 text-xs'>🔴</span>}
                              {task.priority === 'medium' && <span className='text-yellow-400 text-xs'>🟡</span>}
                            </div>
                            {task.subtitle && <p className='text-white/70 text-sm'>{task.subtitle}</p>}
                            <div className='flex items-center space-x-3 mt-1'>
                              {task.childId && (
                                <span className='text-cyan-400 text-xs'>
                                  {children.find(c => c.id === task.childId)?.name}
                                </span>
                              )}
                              <span className='text-yellow-400 text-xs font-bold'>
                                +{task.points} pts
                              </span>
                              {task.recurrence !== 'once' && (
                                <span className='text-purple-400 text-xs'>
                                  {task.recurrence === 'daily' ? '📅 Diária' : 
                                   task.recurrence === 'weekly' ? '🗓️ Semanal' : 
                                   '📆 Mensal'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <div className='text-white/70 text-sm'>{task.time}</div>
                          <button
                            onClick={() => {
                              setEditingTask(task)
                              setNewTask({
                                title: task.title,
                                notes: '',
                                date: task.date || '',
                                time: task.time,
                                childId: task.childId || '',
                                category: task.category,
                                recurrence: task.recurrence,
                                weekDays: task.weekDays || [],
                                points: task.points,
                                priority: task.priority
                              })
                              setShowAddTask(true)
                            }}
                            className='w-8 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-all flex items-center justify-center'
                            title='Editar tarefa'
                          >
                            <svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ type: 'task', id: task.id })}
                            className='w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all flex items-center justify-center'
                            title='Deletar tarefa'
                          >
                            <svg className='w-4 h-4 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className='w-6 h-6 border-2 border-white/30 rounded-full hover:bg-green-500 hover:border-green-500 transition-all flex items-center justify-center'
                          >
                            {task.completed && (
                              <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center'>
                      <div className='text-6xl mb-4'>✨</div>
                      <p className='text-white text-lg font-bold mb-2'>Nenhuma tarefa para hoje!</p>
                      <p className='text-white/50 mb-4'>Comece criando a primeira tarefa</p>
                      <button
                        onClick={() => setShowAddTask(true)}
                        className='px-6 py-3 rounded-xl text-white font-bold transition-all'
                        style={{
                          background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 50%, #94D6E8 100%)',
                          boxShadow: '0 4px 15px rgba(95, 182, 217, 0.3)',
                        }}
                      >
                        ➕ Criar Primeira Tarefa
                      </button>
                    </div>
                  )
                  })()}
                </div>
              </div>

              {/* Tarefas com Data */}
              {Object.keys(
                filteredTasks
                  .filter(task => !task.completed && task.date)
                  .reduce((acc, task) => {
                    const date = task.date || ''
                    if (!acc[date]) acc[date] = []
                    acc[date].push(task)
                    return acc
                  }, {} as Record<string, Task[]>)
              ).map(date => (
                <div key={date}>
                  <h2 className='text-white text-lg font-bold mb-4'>{new Date(date).toLocaleDateString('pt-BR')}</h2>
                  <div className='space-y-3'>
                    {filteredTasks.filter(task => !task.completed && task.date === date).map((task) => (
                      <div key={task.id} className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          <div className={`w-6 h-6 ${task.color} rounded-full flex items-center justify-center`}>
                            <span className='text-white text-xs'>{task.icon}</span>
                          </div>
                          <div>
                            <p className='text-white font-medium'>{task.title}</p>
                            {task.subtitle && <p className='text-white/70 text-sm'>{task.subtitle}</p>}
                            {task.childId && (
                              <p className='text-cyan-400 text-xs mt-1'>
                                Para: {children.find(c => c.id === task.childId)?.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <div className='text-white/70 text-sm'>{task.time}</div>
                          <button
                            onClick={() => {
                              setTasks(tasks.map(t => 
                                t.id === task.id ? { ...t, completed: true } : t
                              ))
                            }}
                            className='w-6 h-6 border-2 border-white/30 rounded-full hover:bg-green-500 hover:border-green-500 transition-all'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* COMPLETADAS HOJE */}
              <div>
                <div 
                  className='flex items-center cursor-pointer mb-4'
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <h2 className='text-white text-lg font-bold mr-2'>COMPLETADAS HOJE</h2>
                  <svg 
                    className={`w-5 h-5 text-white transform transition-transform ${
                      showCompleted ? 'rotate-180' : ''
                    }`} 
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>
                
                {showCompleted && (
                  <div className='space-y-3'>
                    {filteredTasks.filter(task => task.completed).length > 0 ? (
                      filteredTasks.filter(task => task.completed).map((task) => (
                        <div key={task.id} className='bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center space-x-3 opacity-70'>
                          <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                            </svg>
                          </div>
                          <div>
                            <p className='text-white font-medium line-through'>{task.title}</p>
                            {task.childId && (
                              <p className='text-cyan-400 text-xs mt-1'>
                                {children.find(c => c.id === task.childId)?.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='text-center py-4'>
                        <p className='text-white/50'>Nenhuma tarefa completada ainda.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab de Rotinas */}
          {activeTab === 'routine' && (
            <div className='space-y-6'>
              {/* Header com botão de adicionar */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-white text-xl font-bold'>🔄 Rotinas Diárias</h2>
                <button
                  onClick={() => setShowAddRoutine(true)}
                  className='px-4 py-2 rounded-xl text-white font-medium transition-all flex items-center space-x-2'
                  style={{
                    background: 'linear-gradient(135deg, #5FB6D9 0%, #417FA6 100%)',
                    boxShadow: '0 4px 15px rgba(95, 182, 217, 0.3)',
                  }}
                >
                  <span>➕</span>
                  <span>Nova Rotina</span>
                </button>
              </div>

              {/* Lista de Rotinas */}
              <div className='space-y-4'>
                {routines.length === 0 ? (
                  <div className='bg-white/5 backdrop-blur-md rounded-2xl p-12 border border-white/10 text-center'>
                    <div className='text-6xl mb-4'>🌟</div>
                    <h3 className='text-white text-xl font-bold mb-2'>Nenhuma rotina criada ainda</h3>
                    <p className='text-white/60 mb-6'>Comece adicionando uma rotina usando os templates abaixo!</p>
                    <button
                      onClick={() => setShowAddRoutine(true)}
                      className='px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all'
                    >
                      ➕ Criar Primeira Rotina
                    </button>
                  </div>
                ) : (
                  routines.map(routine => {
                    const progress = (routine.tasks.filter(t => t.completed).length / routine.tasks.length) * 100
                    const isComplete = progress === 100
                    
                    return (
                      <div 
                        key={routine.id}
                        className={`bg-gradient-to-br backdrop-blur-md rounded-2xl p-6 border-2 transition-all ${
                          isComplete 
                            ? 'from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-xl shadow-green-500/20' 
                            : 'from-white/10 to-white/5 border-white/20'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center space-x-3'>
                            <div className={`text-4xl ${isComplete ? 'animate-bounce' : ''}`}>
                              {isComplete ? '🎉' : routine.icon}
                            </div>
                            <div>
                              <h3 className='text-white font-bold text-xl'>{routine.name}</h3>
                              <p className='text-white/60 text-sm'>
                                {routine.tasks.filter(t => t.completed).length}/{routine.tasks.length} tarefas concluídas
                              </p>
                            </div>
                          </div>
                          
                          {/* Círculo de Progresso */}
                          <div className='relative w-20 h-20'>
                            <svg className='w-20 h-20 transform -rotate-90' viewBox='0 0 80 80'>
                              <circle
                                cx='40'
                                cy='40'
                                r='32'
                                fill='transparent'
                                stroke='rgba(255,255,255,0.1)'
                                strokeWidth='6'
                              />
                              <circle
                                cx='40'
                                cy='40'
                                r='32'
                                fill='transparent'
                                stroke={isComplete ? '#10b981' : '#3b82f6'}
                                strokeWidth='6'
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - progress / 100)}`}
                                strokeLinecap='round'
                                className='transition-all duration-500'
                              />
                            </svg>
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <span className='text-white font-bold text-sm'>{Math.round(progress)}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Mensagem de Conclusão */}
                        {isComplete && (
                          <div className='mb-4 p-3 bg-green-500/20 rounded-xl border border-green-400/30'>
                            <p className='text-green-100 text-sm font-medium text-center flex items-center justify-center space-x-2'>
                              <span>✨</span>
                              <span>Parabéns! Rotina completada com sucesso!</span>
                              <span>✨</span>
                            </p>
                          </div>
                        )}

                        {/* Checklist com Visual Melhorado */}
                        <div className='space-y-2 mb-4'>
                          {routine.tasks.map((task, index) => (
                            <div 
                              key={task.id}
                              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                                task.completed 
                                  ? 'bg-green-500/10 border border-green-400/30' 
                                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className='flex items-center space-x-3 flex-1'>
                                <span className='text-white/40 font-mono text-sm w-6'>{index + 1}.</span>
                                <button
                                  onClick={() => {
                                    const updatedRoutines = routines.map(r => 
                                      r.id === routine.id 
                                        ? {
                                            ...r,
                                            tasks: r.tasks.map(t => 
                                              t.id === task.id ? { ...t, completed: !t.completed } : t
                                            )
                                          }
                                        : r
                                    )
                                    setRoutines(updatedRoutines)
                                    localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                                    
                                    // Confete ao completar
                                    if (!task.completed && updatedRoutines.find(r => r.id === routine.id)?.tasks.every(t => t.completed)) {
                                      setToast({ message: '🎉 Rotina completada! Parabéns!', type: 'success' })
                                    }
                                  }}
                                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    task.completed 
                                      ? 'bg-green-500 border-green-500 scale-110' 
                                      : 'border-white/30 hover:border-green-400 hover:scale-110'
                                  }`}
                                >
                                  {task.completed && (
                                    <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                                    </svg>
                                  )}
                                </button>
                                <span className={`text-white font-medium flex-1 transition-all ${
                                  task.completed ? 'line-through opacity-60' : ''
                                }`}>
                                  {task.title}
                                </span>
                              </div>
                              {task.completed && (
                                <span className='text-xl animate-bounce'>✅</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Botões de Ação */}
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => {
                              const updatedRoutines = routines.map(r => 
                                r.id === routine.id 
                                  ? { ...r, tasks: r.tasks.map(t => ({ ...t, completed: false })) }
                                  : r
                              )
                              setRoutines(updatedRoutines)
                              localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                              setToast({ message: '🔄 Rotina resetada!', type: 'info' })
                            }}
                            className='flex-1 py-3 rounded-xl text-white/70 hover:text-white text-sm font-medium transition-all border border-white/20 hover:bg-white/10 flex items-center justify-center space-x-2'
                          >
                            <span>🔄</span>
                            <span>Resetar</span>
                          </button>
                          <button
                            onClick={() => {
                              const updatedRoutines = routines.filter(r => r.id !== routine.id)
                              setRoutines(updatedRoutines)
                              localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                              setToast({ message: '🗑️ Rotina removida!', type: 'info' })
                            }}
                            className='py-3 px-4 rounded-xl text-red-400 hover:text-red-300 text-sm font-medium transition-all border border-red-400/30 hover:bg-red-500/10'
                          >
                            �️
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Templates Prontos - VERSÃO MELHORADA */}
              <div className='bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-300/30'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-white font-bold text-xl flex items-center space-x-2'>
                    <span className='text-2xl'>✨</span>
                    <span>Templates de Rotinas</span>
                  </h3>
                  <span className='text-white/60 text-sm'>Clique para adicionar</span>
                </div>

                {/* Templates Matinais */}
                <div className='mb-6'>
                  <h4 className='text-white/80 font-semibold text-sm mb-3 flex items-center space-x-2'>
                    <span>🌅</span>
                    <span>ROTINAS MATINAIS</span>
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    {[
                      { 
                        name: 'Rotina Escolar Completa', 
                        icon: '📚', 
                        tasks: [
                          'Acordar no horário',
                          'Arrumar a cama',
                          'Escovar os dentes',
                          'Tomar banho',
                          'Vestir uniforme',
                          'Tomar café da manhã',
                          'Arrumar mochila',
                          'Conferir lição de casa',
                          'Ir para escola'
                        ],
                        color: 'from-blue-500/30 to-cyan-500/30 border-cyan-400/40'
                      },
                      { 
                        name: 'Manhã de Fim de Semana', 
                        icon: '☀️', 
                        tasks: [
                          'Acordar sem pressa',
                          'Escovar os dentes',
                          'Tomar café com a família',
                          'Arrumar o quarto',
                          'Guardar brinquedos',
                          'Tempo de leitura'
                        ],
                        color: 'from-yellow-500/30 to-orange-500/30 border-yellow-400/40'
                      },
                      { 
                        name: 'Higiene Matinal', 
                        icon: '🧼', 
                        tasks: [
                          'Lavar o rosto',
                          'Escovar os dentes',
                          'Pentear o cabelo',
                          'Passar desodorante',
                          'Trocar de roupa',
                          'Lavar as mãos'
                        ],
                        color: 'from-green-500/30 to-emerald-500/30 border-green-400/40'
                      }
                    ].map((template, idx) => (
                      <button
                        key={`morning-${idx}`}
                        onClick={() => {
                          const newRoutine = {
                            id: Date.now().toString(),
                            name: template.name,
                            type: 'custom' as const,
                            icon: template.icon,
                            tasks: template.tasks.map((t, i) => ({
                              id: `${i}`,
                              title: t,
                              completed: false
                            }))
                          }
                          const updatedRoutines = [...routines, newRoutine]
                          setRoutines(updatedRoutines)
                          localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                          setToast({ message: `✨ Rotina "${template.name}" adicionada!`, type: 'success' })
                        }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${template.color} hover:scale-105 transition-all text-left border-2 group`}
                      >
                        <div className='text-3xl mb-2'>{template.icon}</div>
                        <p className='text-white font-bold text-sm mb-1'>{template.name}</p>
                        <p className='text-white/60 text-xs'>{template.tasks.length} tarefas</p>
                        <div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <div className='text-white/50 text-xs'>Clique para adicionar →</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Templates Noturnos */}
                <div>
                  <h4 className='text-white/80 font-semibold text-sm mb-3 flex items-center space-x-2'>
                    <span>🌙</span>
                    <span>ROTINAS NOTURNAS</span>
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    {[
                      { 
                        name: 'Preparar para Dormir', 
                        icon: '😴', 
                        tasks: [
                          'Jantar em família',
                          'Guardar brinquedos',
                          'Tomar banho',
                          'Escovar os dentes',
                          'Vestir pijama',
                          'Preparar mochila do dia seguinte',
                          'Ler um livro',
                          'Oração/Meditação',
                          'Dormir no horário'
                        ],
                        color: 'from-indigo-500/30 to-purple-500/30 border-indigo-400/40'
                      },
                      { 
                        name: 'Rotina de Lição de Casa', 
                        icon: '📝', 
                        tasks: [
                          'Lavar as mãos',
                          'Organizar mesa de estudos',
                          'Fazer lição de casa',
                          'Revisar matéria do dia',
                          'Preparar material para amanhã',
                          'Guardar livros na mochila',
                          'Tempo livre'
                        ],
                        color: 'from-pink-500/30 to-rose-500/30 border-pink-400/40'
                      },
                      { 
                        name: 'Fim de Dia Relaxante', 
                        icon: '🌟', 
                        tasks: [
                          'Jantar com calma',
                          'Conversar sobre o dia',
                          'Atividade em família',
                          'Tomar banho morno',
                          'Colocar pijama',
                          'História antes de dormir',
                          'Abraço de boa noite',
                          'Luzes apagadas'
                        ],
                        color: 'from-violet-500/30 to-fuchsia-500/30 border-violet-400/40'
                      }
                    ].map((template, idx) => (
                      <button
                        key={`night-${idx}`}
                        onClick={() => {
                          const newRoutine = {
                            id: Date.now().toString(),
                            name: template.name,
                            type: 'custom' as const,
                            icon: template.icon,
                            tasks: template.tasks.map((t, i) => ({
                              id: `${i}`,
                              title: t,
                              completed: false
                            }))
                          }
                          const updatedRoutines = [...routines, newRoutine]
                          setRoutines(updatedRoutines)
                          localStorage.setItem('organizekids_routines', JSON.stringify(updatedRoutines))
                          setToast({ message: `🌙 Rotina "${template.name}" adicionada!`, type: 'success' })
                        }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${template.color} hover:scale-105 transition-all text-left border-2 group`}
                      >
                        <div className='text-3xl mb-2'>{template.icon}</div>
                        <p className='text-white font-bold text-sm mb-1'>{template.name}</p>
                        <p className='text-white/60 text-xs'>{template.tasks.length} tarefas</p>
                        <div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <div className='text-white/50 text-xs'>Clique para adicionar →</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dica */}
                <div className='mt-6 p-4 bg-white/5 rounded-xl border border-white/10'>
                  <p className='text-white/70 text-sm flex items-start space-x-2'>
                    <span className='text-lg'>💡</span>
                    <span>
                      <strong className='text-white'>Dica:</strong> As rotinas ajudam as crianças a desenvolver autonomia e responsabilidade. 
                      Incentive-as a marcar cada tarefa conforme concluem!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab de Progresso */}
          {activeTab === 'progress' && (
            <div className='space-y-6'>
              {/* Progresso Diário */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-6'>Progresso Diário</h3>
                <div className='flex justify-center'>
                  <div className='relative w-40 h-40'>
                    <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 160 160'>
                      <circle cx='80' cy='80' r='60' fill='#1E0C3A' />
                      <circle cx='80' cy='80' r='70' stroke='#5D5A72' strokeWidth='20' fill='transparent' opacity='0.6' />
                      <circle
                        cx='80'
                        cy='80'
                        r='70'
                        stroke='url(#dailyProgressGradient)'
                        strokeWidth='20'
                        fill='transparent'
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - (() => {
                          const todayTasks = filteredTasks.filter(task => !task.date)
                          return todayTasks.length > 0 ? todayTasks.filter(t => t.completed).length / todayTasks.length : 0
                        })())}`}
                        className='transition-all duration-1000'
                      />
                      <defs>
                        <linearGradient id='dailyProgressGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                          <stop offset='0%' stopColor='#46B9FF' />
                          <stop offset='100%' stopColor='#A07CFF' />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-3xl font-bold text-white'>
                          {(() => {
                            const todayTasks = filteredTasks.filter(task => !task.date)
                            return todayTasks.length > 0 ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) : 0
                          })()}%
                        </div>
                        <div className='text-white/70 text-xs'>Concluído</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas Semanais */}
              <div className='grid grid-cols-2 gap-4'>
                {/* Streak */}
                <div className='bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-4 border border-orange-300/30'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-2xl'>🔥</span>
                    <span className='text-white/70 text-sm'>Sequência</span>
                  </div>
                  <p className='text-white text-3xl font-bold'>7 dias</p>
                  <p className='text-orange-300 text-xs mt-1'>Continue assim!</p>
                </div>

                {/* Taxa de Conclusão */}
                <div className='bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-green-300/30'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-2xl'>📈</span>
                    <span className='text-white/70 text-sm'>Taxa Semanal</span>
                  </div>
                  <p className='text-white text-3xl font-bold'>
                    {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
                  </p>
                  <p className='text-green-300 text-xs mt-1'>De conclusão</p>
                </div>

                {/* Categoria Mais Feita */}
                <div className='bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-4 border border-purple-300/30'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-2xl'>🎯</span>
                    <span className='text-white/70 text-sm'>Top Categoria</span>
                  </div>
                  <p className='text-white text-xl font-bold'>
                    {(() => {
                      const categoryCounts = tasks.reduce((acc, task) => {
                        acc[task.category] = (acc[task.category] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                      const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
                      const cat = taskCategories.find(c => c.id === topCategory?.[0])
                      return cat ? `${cat.icon} ${cat.name}` : 'Nenhuma'
                    })()}
                  </p>
                </div>

                {/* Pontos Esta Semana */}
                <div className='bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-md rounded-2xl p-4 border border-yellow-300/30'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='text-2xl'>💰</span>
                    <span className='text-white/70 text-sm'>Esta Semana</span>
                  </div>
                  <p className='text-white text-3xl font-bold'>
                    {tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)}
                  </p>
                  <p className='text-yellow-300 text-xs mt-1'>Pontos ganhos</p>
                </div>
              </div>

              {/* Progresso por Categoria */}
              <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                <h3 className='text-white font-semibold mb-4'>📊 Progresso por Categoria</h3>
                <div className='space-y-3'>
                  {taskCategories.map(category => {
                    const categoryTasks = tasks.filter(t => t.category === category.id)
                    const completed = categoryTasks.filter(t => t.completed).length
                    const total = categoryTasks.length
                    const percentage = total > 0 ? (completed / total) * 100 : 0

                    return (
                      <div key={category.id}>
                        <div className='flex items-center justify-between mb-1'>
                          <div className='flex items-center space-x-2'>
                            <span className='text-xl'>{category.icon}</span>
                            <span className='text-white text-sm'>{category.name}</span>
                          </div>
                          <span className='text-white/70 text-sm'>{completed}/{total}</span>
                        </div>
                        <div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
                          <div 
                            className={`h-full ${category.color} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Ranking dos Filhos */}
              {!selectedChild && (
                <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20'>
                  <h3 className='text-white font-semibold mb-6'>🏆 Ranking dos Filhos</h3>
                  <div className='space-y-4'>
                    {children
                      .sort((a, b) => b.totalPoints - a.totalPoints)
                      .map((child, index) => (
                        <div key={child.id} className='bg-white/5 rounded-xl p-4'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                              <div className='text-2xl'>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                              </div>
                              <div className='text-2xl'>{child.gender === 'son' ? '👦' : '👧'}</div>
                              <div>
                                <p className='text-white font-bold'>{child.name}</p>
                                <p className='text-white/70 text-sm'>
                                  {child.tasksCompleted} tarefas completadas
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='text-cyan-400 font-bold text-xl'>{child.totalPoints}</p>
                              <p className='text-white/70 text-xs'>pontos</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl'>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center'>
                <svg className='w-6 h-6 text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
              </div>
              <h3 className='text-white font-bold text-xl'>Confirmar Exclusão</h3>
            </div>
            
            <p className='text-white/80 mb-6'>
              {confirmDelete.type === 'task' 
                ? 'Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser desfeita.'
                : 'Tem certeza que deseja deletar este filho? Todas as tarefas associadas também serão removidas.'}
            </p>

            <div className='flex space-x-3'>
              <button
                onClick={() => setConfirmDelete(null)}
                className='flex-1 px-4 py-3 rounded-xl font-medium transition-all bg-white/10 hover:bg-white/20 text-white'
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'task') {
                    handleDeleteTask(confirmDelete.id)
                  } else {
                    handleDeleteChild(confirmDelete.id)
                  }
                }}
                className='flex-1 px-4 py-3 rounded-xl font-medium transition-all text-white'
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
