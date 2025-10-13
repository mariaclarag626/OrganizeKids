'use client'

import { useRouter } from 'next/navigation'

export default function TeenagersDashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_type')
    router.push('/')
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
      }}
    >
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
              🎮 Teenagers Dashboard
            </h1>
            <p className="text-white/70 mt-1">Bem-vindo ao seu painel!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-xl text-white font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)',
              boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div 
          className="backdrop-blur-md rounded-3xl p-8 border border-white/20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        >
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
              Dashboard em Construção
            </h2>
            <p className="text-white/70">
              O dashboard para teenagers será implementado em breve!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
'use client'

import { useRouter } from 'next/navigation'

export default function TeenagersDashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_type')
    router.push('/')
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
      }}
    >
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Poppins' }}>
              🎮 Teenagers Dashboard
            </h1>
            <p className="text-white/70 mt-1">Bem-vindo ao seu painel!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-xl text-white font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 100%)',
              boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div 
          className="backdrop-blur-md rounded-3xl p-8 border border-white/20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        >
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
              Dashboard em Construção
            </h2>
            <p className="text-white/70">
              O dashboard para teenagers será implementado em breve!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
