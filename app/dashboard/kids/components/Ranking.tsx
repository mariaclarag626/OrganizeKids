'use client'

interface RankingProps {
  ranking: Array<{
    id: string
    name: string
    avatar: string
    points: number
    position: number
    isCurrentUser?: boolean
  }>
}

export function Ranking({ ranking }: RankingProps) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl text-center text-gray-500">
        <p>Ainda não há ranking disponível</p>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
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
  )
}
