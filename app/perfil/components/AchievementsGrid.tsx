'use client'

export default function AchievementsGrid({ points, big = false }: { points: number; big?: boolean }) {
  const achievements = [
    { id: 'bronze', name: 'Bronze', req: 100, emoji: '🥉' },
    { id: 'silver', name: 'Prata', req: 300, emoji: '🥈' },
    { id: 'gold', name: 'Ouro', req: 600, emoji: '🥇' },
    { id: 'diamond', name: 'Diamante', req: 1000, emoji: '💎' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {achievements.map(a => {
        const unlocked = points >= a.req
        return (
          <div key={a.id} className={`rounded-lg border p-3 text-center ${unlocked ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}>
            <div className={`${big ? 'text-3xl' : 'text-2xl'}`}>{a.emoji}</div>
            <div className="text-xs mt-1">
              <div className="font-semibold">{a.name}</div>
              <div className="text-gray-500">{a.req} pts</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
