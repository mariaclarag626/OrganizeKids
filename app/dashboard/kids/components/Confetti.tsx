'use client'

interface ConfettiProps {
  show: boolean
  message?: string
}

export function Confetti({ show, message }: ConfettiProps) {
  if (!show) return null

  return (
    <>
      {/* Confetti particles */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-confetti"
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

      {/* Celebration message */}
      {message && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-celebration">
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white text-5xl font-bold px-12 py-8 rounded-3xl shadow-2xl">
            {message}
          </div>
        </div>
      )}

      {/* Stars burst */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2
          return (
            <div
              key={`star-${i}`}
              className="absolute text-4xl animate-burst"
              style={{
                left: '50%',
                top: '50%',
                animationDelay: `${i * 0.05}s`,
                '--burst-x': `${Math.cos(angle) * 300}px`,
                '--burst-y': `${Math.sin(angle) * 300}px`,
              } as any}
            >
              ⭐
            </div>
          )
        })}
      </div>

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
        
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--burst-x), var(--burst-y)) scale(1.5);
            opacity: 0;
          }
        }
        .animate-burst {
          animation: burst 1s ease-out forwards;
        }
      `}</style>
    </>
  )
}
