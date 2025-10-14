'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      try {
        if (LocalAuthManager.isLoggedIn()) {
          const user = LocalAuthManager.getCurrentUser()
          if (user && user.role) {
            const dashboardRoute = LocalAuthManager.getDashboardRoute(user.role)
            router.push(dashboardRoute)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      }
    }
  }, [router])

  const handleStart = () => {
    router.push('/signup')
  }

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Isso vai apagar todas as contas e configurações.')) {
      localStorage.clear()
      alert('✅ Dados limpos com sucesso! A página será recarregada.')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Clear Data button (canto inferior esquerdo) */}
      <button
        onClick={handleClearData}
        className="absolute bottom-8 left-8 z-50 text-red-400/80 hover:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all text-sm"
        title="Limpar todos os dados salvos"
      >
        🗑️ Limpar Dados
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            OrganizeKids
          </h1>
          <p className="text-2xl text-white/80 mb-4">
            Organize a vida da sua família! 👨‍👩‍👧‍👦
          </p>
          <p className="text-lg text-white/60">
            Tarefas, recompensas e muito mais em um só lugar
          </p>
        </div>

        <button
          onClick={handleStart}
          className="px-16 py-5 rounded-2xl font-bold text-2xl text-white transition-all transform hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"
        >
          Começar Agora! 🚀
        </button>

        <p className="mt-8 text-white/50 text-sm">
          Gratuito e fácil de usar
        </p>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
