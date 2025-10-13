'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Temas disponíveis para personalização
const THEMES = {
  princess: {
    name: '🌸 Princesa',
    bg: 'from-purple-400 via-pink-300 to-blue-400',
    primary: 'from-pink-500 to-purple-500',
    secondary: 'from-purple-400 to-pink-400',
    accent: 'from-pink-400 to-purple-400',
  },
  space: {
    name: '🚀 Espacial',
    bg: 'from-blue-600 via-cyan-400 to-blue-500',
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-cyan-400 to-blue-400',
    accent: 'from-blue-400 to-cyan-400',
  },
  nature: {
    name: '🌳 Natureza',
    bg: 'from-green-500 via-lime-300 to-emerald-400',
    primary: 'from-green-500 to-lime-500',
    secondary: 'from-lime-400 to-green-400',
    accent: 'from-green-400 to-lime-400',
  },
  energy: {
    name: '🔥 Energia',
    bg: 'from-orange-500 via-red-400 to-yellow-400',
    primary: 'from-orange-500 to-red-500',
    secondary: 'from-red-400 to-orange-400',
    accent: 'from-orange-400 to-red-400',
  },
  rainbow: {
    name: '🌈 Arco-íris',
    bg: 'from-pink-400 via-purple-400 via-blue-400 via-green-400 to-yellow-400',
    primary: 'from-purple-500 via-pink-500 to-blue-500',
    secondary: 'from-blue-400 via-purple-400 to-pink-400',
    accent: 'from-pink-400 via-blue-400 to-purple-400',
  },
  ocean: {
    name: '🌊 Oceano',
    bg: 'from-blue-500 via-teal-300 to-cyan-400',
    primary: 'from-blue-500 to-teal-500',
    secondary: 'from-teal-400 to-blue-400',
    accent: 'from-blue-400 to-teal-400',
  },
  sunset: {
    name: '🌅 Pôr do Sol',
    bg: 'from-orange-400 via-pink-400 to-purple-500',
    primary: 'from-orange-500 to-pink-500',
    secondary: 'from-pink-400 to-purple-400',
    accent: 'from-orange-400 to-pink-400',
  },
  forest: {
    name: '🏕️ Floresta',
    bg: 'from-emerald-600 via-green-400 to-lime-400',
    primary: 'from-emerald-500 to-green-500',
    secondary: 'from-green-400 to-emerald-400',
    accent: 'from-emerald-400 to-green-400',
  },
}

type ThemeType = keyof typeof THEMES

export default function KidsDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards' | 'achievements' | 'avatar' | 'theme'>('tasks')
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('princess')
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [points, setPoints] = useState(0)
  const [rewards, setRewards] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [suggestedTask, setSuggestedTask] = useState({
    title: '',
    description: '',
    points: 10,
  })

  useEffect(() => {
    // Initialize with mock data immediately
    setUser({ id: '1', name: 'Maria', avatar: '👧' })
    setPoints(150)
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('kidTheme') as ThemeType
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    
    setTasks([
      { id: '1', title: 'Arrumar a cama', points: 10, isCompleted: false, icon: '🛏️', dueDate: new Date() },
      { id: '2', title: 'Escovar os dentes', points: 5, isCompleted: true, icon: '🦷', dueDate: new Date() },
      { id: '3', title: 'Fazer lição de casa', points: 20, isCompleted: false, icon: '📚', dueDate: new Date() },
      { id: '4', title: 'Ajudar com a louça', points: 15, isCompleted: false, icon: '🍽️', dueDate: new Date() },
    ])
    setRewards([
      { id: '1', title: '30 min de videogame', cost: 50, icon: '🎮' },
      { id: '2', title: 'Escolher o filme', cost: 30, icon: '🎬' },
      { id: '3', title: 'Pizza no jantar', cost: 100, icon: '🍕' },
      { id: '4', title: 'Dormir mais tarde', cost: 80, icon: '🌙' },
    ])
    setAchievements([
      { id: '1', title: 'Primeira Tarefa', unlocked: true, icon: '🌟', description: 'Complete sua primeira tarefa' },
      { id: '2', title: 'Sequência de 7 dias', unlocked: false, icon: '🔥', description: 'Complete tarefas por 7 dias seguidos', progress: 3, requirement: 7 },
      { id: '3', title: 'Mestre das Tarefas', unlocked: false, icon: '👑', description: 'Complete 50 tarefas', progress: 12, requirement: 50 },
    ])
    setRanking([
      { id: '2', name: 'João', avatar: '👦', points: 180, position: 1 },
      { id: '1', name: 'Maria', avatar: '👧', points: 150, position: 2, isCurrentUser: true },
      { id: '3', name: 'Pedro', avatar: '🧒', points: 120, position: 3 },
    ])
  }, []) // Empty dependency array - run once on mount

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.isCompleted) return

    // Mensagens simples e diretas
    const messages = [
      `Tarefa concluída! +${task.points} pontos`,
      `Muito bem! +${task.points} pontos`,
      `Ótimo trabalho! +${task.points} pontos`,
      `Parabéns! +${task.points} pontos`,
    ]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setCelebrationMessage(randomMessage)

    // Celebração
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setCelebrationMessage('')
    }, 3000)

    // Atualizar tarefa
    setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: true } : t))
    setPoints(points + task.points)

    // Atualizar ranking
    setRanking(ranking.map(r => 
      r.isCurrentUser 
        ? { ...r, points: r.points + task.points }
        : r
    ).sort((a, b) => b.points - a.points).map((r, i) => ({ ...r, position: i + 1 })))

    // TODO: Chamar API para atualizar no banco
  }

  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward) return

    if (points >= reward.cost) {
      if (confirm(`Resgatar "${reward.title}" por ${reward.cost} pontos?`)) {
        setPoints(points - reward.cost)
        alert('Recompensa resgatada! Aguarde aprovação dos pais.')
        // TODO: Chamar API para criar redemption
      }
    } else {
      alert(`Você precisa de ${reward.cost - points} pontos a mais!`)
    }
  }

  const handleSuggestTask = async () => {
    if (!suggestedTask.title.trim()) {
      alert('Por favor, dê um título para a tarefa')
      return
    }

    try {
      // TODO: Get real householdId and userId from session
      const response = await fetch('/api/tasks/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdId: '00000000-0000-0000-0000-000000000001', // Mock ID
          userId: user?.id || '1',
          title: suggestedTask.title,
          description: suggestedTask.description,
          pointsSuggested: suggestedTask.points,
        }),
      })

      if (response.ok) {
        alert('Sugestão enviada! Aguarde aprovação dos pais.')
        setShowSuggestModal(false)
        setSuggestedTask({ title: '', description: '', points: 10 })
      } else {
        alert('Erro ao enviar sugestão. Tente novamente.')
      }
    } catch (error) {
      console.error('Error suggesting task:', error)
      alert('Erro ao enviar sugestão. Tente novamente.')
    }
  }

  const handleChangeTheme = (themeKey: ThemeType) => {
    setCurrentTheme(themeKey)
    localStorage.setItem('kidTheme', themeKey)
    
    // Show simple feedback
    setCelebrationMessage(`Tema alterado`)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }

  const theme = THEMES[currentTheme]

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}>
        <div className="text-white text-2xl font-medium">Carregando...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* Subtle stars background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <>
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'][Math.floor(Math.random() * 5)],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          {celebrationMessage && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-celebration">
              <div className="bg-white text-gray-800 text-2xl font-semibold px-8 py-4 rounded-xl shadow-xl">
                {celebrationMessage}
              </div>
            </div>
          )}
        </>
      )}

      {/* Header */}
      <div className="bg-white/20 backdrop-blur-lg border-b border-white/30 p-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{user?.avatar || '👧'}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Olá, {user?.name}
              </h1>
              <p className="text-white/80 text-sm">Suas tarefas de hoje</p>
            </div>
          </div>
          <div className="bg-white/20 px-6 py-3 rounded-xl backdrop-blur-sm">
            <div className="text-white/70 text-xs font-medium mb-1">Pontos</div>
            <div className="text-white text-2xl font-bold flex items-center gap-1">
              <span>⭐</span>
              {points}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-6 px-6">
        <div className="flex gap-3 bg-white/20 backdrop-blur-lg p-2 rounded-xl shadow-lg">
          {[
            { id: 'tasks', label: 'Minhas Tarefas', icon: '✅' },
            { id: 'rewards', label: 'Loja de Prêmios', icon: '🎁' },
            { id: 'achievements', label: 'Conquistas', icon: '🏆' },
            { id: 'avatar', label: 'Meu Avatar', icon: '🎨' },
            { id: 'theme', label: 'Tema', icon: '🌈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-1 text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto mt-8 px-6 pb-12">
        {/* Ranking Section - sempre visível no topo */}
        <div className="mb-8 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🏅</span>
            Ranking da Família
          </h2>
          <div className="space-y-3">
            {ranking.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  member.isCurrentUser
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold w-12 text-center">
                    {member.position === 1 ? '🥇' : member.position === 2 ? '🥈' : member.position === 3 ? '🥉' : `#${member.position}`}
                  </div>
                  <div className="text-4xl">{member.avatar}</div>
                  <div>
                    <div className={`font-bold text-lg ${member.isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                      {member.name} {member.isCurrentUser && '(Você)'}
                    </div>
                  </div>
                </div>
                <div className={`font-bold text-2xl flex items-center gap-1 ${member.isCurrentUser ? 'text-white' : 'text-yellow-500'}`}>
                  <span>⭐</span>
                  {member.points}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-semibold">Tarefas Hoje</p>
                    <p className="text-4xl font-bold text-purple-600">
                      {tasks.filter(t => t.isCompleted).length}/{tasks.length}
                    </p>
                  </div>
                  <div className="text-5xl">✅</div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-semibold">Sequência</p>
                    <p className="text-4xl font-bold text-orange-600">3 dias 🔥</p>
                  </div>
                  <div className="text-5xl">📅</div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-semibold">Nível</p>
                    <p className="text-4xl font-bold text-green-600">Nível 5</p>
                  </div>
                  <div className="text-5xl">⬆️</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                <span className="text-4xl">📋</span>
                Tarefas de Hoje
              </h2>
              <button
                onClick={() => setShowSuggestModal(true)}
                className="bg-white/90 hover:bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span className="text-xl">💡</span>
                Sugerir Tarefa
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-105 ${
                    task.isCompleted ? 'opacity-75 border-4 border-green-400' : 'border-4 border-transparent hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{task.icon}</div>
                      <div>
                        <h3 className={`text-xl font-bold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500 font-bold text-lg">⭐ {task.points} pontos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!task.isCompleted ? (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                    >
                      ✨ Completar Tarefa!
                    </button>
                  ) : (
                    <div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-center">
                      ✅ Completada!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
              <span className="text-4xl">🎁</span>
              Loja de Prêmios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canAfford = points >= reward.cost
                return (
                  <div
                    key={reward.id}
                    className={`bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl transform transition-all ${
                      canAfford ? 'hover:scale-105 border-4 border-yellow-400' : 'opacity-75 border-4 border-gray-300'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">{reward.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800">{reward.title}</h3>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-yellow-500 text-2xl font-bold">⭐ {reward.cost}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!canAfford}
                      className={`w-full font-bold py-3 px-6 rounded-xl shadow-lg transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? '🛒 Resgatar!' : '🔒 Precisa mais pontos'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              Suas Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-105 ${
                    achievement.unlocked ? 'border-4 border-yellow-400' : 'border-4 border-gray-300 opacity-75'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`text-6xl mb-3 ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{achievement.description}</p>
                  </div>
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progresso</span>
                        <span>{achievement.progress}/{achievement.requirement}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                          style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-4 rounded-xl text-center">
                      ✨ Desbloqueado!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avatar Tab */}
        {activeTab === 'avatar' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
              <span className="text-4xl">🎨</span>
              Personalize seu Avatar
            </h2>
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-9xl mb-4 animate-bounce inline-block">{user?.avatar || '👧'}</div>
                <h3 className="text-2xl font-bold text-gray-800">Seu Avatar</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['👧', '👦', '🧒', '👶', '🦸‍♀️', '🦸‍♂️', '🧙‍♀️', '🧙‍♂️', '🧚‍♀️', '🧚‍♂️', '🦄', '🐉'].map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setUser({ ...user, avatar })}
                    className={`text-6xl p-6 rounded-2xl transition-all transform hover:scale-110 ${
                      user?.avatar === avatar
                        ? `bg-gradient-to-r ${theme.primary} shadow-2xl scale-110`
                        : 'bg-white/50 hover:bg-white/70 shadow-lg'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <button
                className={`w-full mt-8 bg-gradient-to-r ${theme.secondary} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all`}
                onClick={() => alert('Avatar salvo com sucesso! ✨')}
              >
                💾 Salvar Avatar
              </button>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
              <span className="text-4xl">🌈</span>
              Escolha seu Tema Favorito
            </h2>
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tema Atual: {THEMES[currentTheme].name}</h3>
                <p className="text-gray-600">Clique em um tema para mudar as cores do seu dashboard!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(THEMES) as ThemeType[]).map((themeKey) => {
                  const themeOption = THEMES[themeKey]
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleChangeTheme(themeKey)}
                      className={`relative overflow-hidden rounded-2xl transition-all transform hover:scale-105 ${
                        currentTheme === themeKey
                          ? 'ring-4 ring-yellow-400 shadow-2xl scale-105'
                          : 'shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className={`bg-gradient-to-br ${themeOption.bg} p-8 h-32 flex items-center justify-center`}>
                        <div className="text-white text-4xl font-bold drop-shadow-lg">
                          {themeOption.name}
                        </div>
                      </div>
                      {currentTheme === themeKey && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                          ✓ Ativo
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Dica:
                </h4>
                <p className="text-gray-700">
                  Você pode mudar seu tema sempre que quiser! Cada tema muda todas as cores do dashboard para combinar com seu estilo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Sugerir Tarefa */}
      {showSuggestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">💡</span>
                Sugerir Tarefa
              </h3>
              <button
                onClick={() => setShowSuggestModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4 text-sm">
              Sugira uma tarefa que você gostaria de fazer! Seus pais vão avaliar e podem aprovar.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome da Tarefa *
                </label>
                <input
                  type="text"
                  value={suggestedTask.title}
                  onChange={(e) => setSuggestedTask({ ...suggestedTask, title: e.target.value })}
                  placeholder="Ex: Organizar meu armário"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={suggestedTask.description}
                  onChange={(e) => setSuggestedTask({ ...suggestedTask, description: e.target.value })}
                  placeholder="O que você vai fazer?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Pontos Sugeridos
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSuggestedTask({ ...suggestedTask, points: Math.max(5, suggestedTask.points - 5) })}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold w-10 h-10 rounded-lg"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {suggestedTask.points}
                    </div>
                    <div className="text-xs text-gray-500">pontos</div>
                  </div>
                  <button
                    onClick={() => setSuggestedTask({ ...suggestedTask, points: Math.min(50, suggestedTask.points + 5) })}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold w-10 h-10 rounded-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Seus pais podem ajustar os pontos ao aprovar
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSuggestModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSuggestTask}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Enviar Sugestão
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti forwards;
        }
        
        @keyframes celebration {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-celebration {
          animation: celebration 0.6s ease-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
