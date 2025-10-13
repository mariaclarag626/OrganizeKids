'use client'

interface DashboardHeaderProps {
  user: {
    name: string
    avatar: string
  }
  points: number
}

export function DashboardHeader({ user, points }: DashboardHeaderProps) {
  return (
    <div className="bg-white/20 backdrop-blur-lg border-b-4 border-white/30 p-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-bounce">{user.avatar}</div>
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Olá, {user.name}! 👋
            </h1>
            <p className="text-white/90 text-lg">Vamos conquistar o dia!</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
          <div className="text-center">
            <div className="text-white/80 text-sm font-semibold">Seus Pontos</div>
            <div className="text-white text-4xl font-bold flex items-center gap-2">
              <span className="animate-pulse">⭐</span>
              {points}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
