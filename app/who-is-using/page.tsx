'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function WhoIsUsingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true) // Novo estado para verificação inicial
  const router = useRouter()
  const { data: session, status } = useSession()

  // Verificar se usuário já tem userType salvo
  useEffect(() => {
    const checkUserType = async () => {
      // Aguarda a sessão carregar
      if (status === 'loading') {
        return
      }

      // Tenta pegar email da sessão (Google OAuth) ou localStorage (email/senha)
      const email = session?.user?.email || localStorage.getItem('user_email')
      console.log('📧 Email:', email)
      console.log('🔐 Sessão:', session)
      
      if (!email) {
        console.log('❌ Sem email, redirecionando para /')
        router.push('/')
        return
      }

      // Verificar se já tem userType
      console.log('🔍 Verificando userType no banco...')
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      
      const data = await response.json()
      console.log('📊 Dados do usuário:', data)
      
      if (data.user?.userType) {
        // Já tem tipo salvo, redireciona direto
        console.log('✅ UserType encontrado:', data.user.userType)
        console.log('🚀 Redirecionando para dashboard...')
        router.push(`/dashboard/${data.user.userType}`)
      } else {
        console.log('⚠️ Sem userType, mostrando tela de seleção')
        setChecking(false) // Libera para mostrar a tela
      }
    }

    checkUserType()
  }, [router, session, status])

  // Se ainda está verificando, não mostra nada (evita flash da página)
  if (checking) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center' style={{
        background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
      }}>
        <div className='text-white text-xl' style={{ fontFamily: 'Poppins' }}>
          Loading...
        </div>
      </div>
    )
  }

  const handleEnter = async () => {
    if (!selectedCategory) {
      alert('Please select a category before continuing!')
      return
    }

    setLoading(true)
    // Pega email da sessão (Google OAuth) ou localStorage (email/senha)
    const email = session?.user?.email || localStorage.getItem('user_email')

    if (!email) {
      alert('Email not found. Please login again.')
      router.push('/')
      return
    }

    try {
      // Salvar userType no banco de dados
      const response = await fetch('/api/user/update-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          userType: selectedCategory 
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Salvar também no localStorage para acesso rápido
        localStorage.setItem('user_type', selectedCategory)
        
        // Redirecionar para o dashboard específico
        router.push(`/dashboard/${selectedCategory}`)
      } else {
        alert('Error saving user type. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving user type. Please try again.')
      setLoading(false)
    }
  }
  return (
    <div className='space-background flex min-h-screen w-full items-center justify-center p-4 relative'>
      {/* Overlay gradient for better text readability */}
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(89.12deg, rgba(22, 4, 48, 0.8) 0.47%, rgba(22, 4, 48, 0.3) 22.87%, rgba(22, 4, 48, 0.1) 100%)',
        }}
      />

      {/* Animated Stars Background */}
      <div className='absolute inset-0 pointer-events-none'>
        {/* Large Stars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`large-star-${i}`}
            className='absolute animate-pulse'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className='w-2 h-2 bg-white rounded-full opacity-80'
              style={{
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>
        ))}

        {/* Medium Stars */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`medium-star-${i}`}
            className='absolute animate-ping'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            <div
              className='w-1 h-1 bg-blue-200 rounded-full opacity-60'
              style={{
                boxShadow: '0 0 4px rgba(191, 219, 254, 0.6)',
              }}
            />
          </div>
        ))}

        {/* Small Twinkling Stars */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={`small-star-${i}`}
            className='absolute'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${1 + Math.random() * 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <div className='w-0.5 h-0.5 bg-white rounded-full opacity-40' />
          </div>
        ))}

        {/* Floating Stars with gentle movement */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`floating-star-${i}`}
            className='absolute'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div
              className='w-1 h-1 bg-purple-200 rounded-full opacity-50'
              style={{
                boxShadow: '0 0 3px rgba(196, 181, 253, 0.5)',
              }}
            />
          </div>
        ))}

        {/* Shooting Stars (occasional) */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className='absolute'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animation: `shootingStar 8s linear infinite`,
              animationDelay: `${i * 6}s`,
            }}
          >
            <div
              className='w-1 h-0.5 bg-white rounded-full opacity-80'
              style={{
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), -20px 0 10px rgba(255, 255, 255, 0.3)',
                transform: 'rotate(-15deg)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Fade at bottom - Fixed to bottom of viewport */}
      <div
        className='fixed bottom-0 left-0 w-full z-20'
        style={{
          height: '134px',
          background:
            'linear-gradient(0deg, #160430 0%, rgba(22, 4, 48, 0) 100%)',
        }}
      />

      {/* Skip button */}
      <button
        className='absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-30 text-white font-semibold text-sm sm:text-base lg:text-lg hover:opacity-80 transition-opacity'
        onClick={() => window.location.href = '/dashboard'}
      >
        SKIP
      </button>

      {/* Main content */}
      <div className='relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6'>
        {/* Large planet decoration - Hidden on mobile */}
        <div
          className='hidden lg:block absolute -top-20 -right-20 w-32 lg:w-48 h-32 lg:h-48 rounded-full opacity-60'
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
          }}
        />

        {/* Title */}
        <h1
          className='text-white mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight uppercase'
          style={{
            fontFamily: 'Poppins',
          }}
        >
          WHO IS USING<br />THE APP ?
        </h1>

        {/* Subtitle */}
        <p
          className='text-white/80 mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base lg:text-lg px-4 sm:px-0'
          style={{
            fontFamily: 'Poppins',
          }}
        >
          Select who will be using the application, so that the<br className='hidden sm:block' />
          <span className='sm:hidden'> </span>app configures the best features for you.
        </p>

        {/* Options */}
        <div className='space-y-3 sm:space-y-4 mb-6 sm:mb-8 px-4 sm:px-0'>
          {/* Parents */}
          <button
            className={`w-full max-w-md mx-auto block py-3 sm:py-4 px-6 sm:px-8 text-white font-semibold text-sm sm:text-base lg:text-lg border rounded-lg transition-all ${
              selectedCategory === 'parents' 
                ? 'bg-white/20 border-white' 
                : 'border-white/30 hover:bg-white/10'
            }`}
            onClick={() => setSelectedCategory('parents')}
          >
            PARENTS
          </button>

          {/* Teenagers/Students */}
          <button
            className={`w-full max-w-md mx-auto block py-3 sm:py-4 px-6 sm:px-8 text-white font-semibold text-sm sm:text-base lg:text-lg border rounded-lg transition-all ${
              selectedCategory === 'teenagers'
                ? 'bg-blue-500/30 border-blue-400'
                : 'border-blue-400 hover:bg-blue-500/20'
            }`}
            style={{ borderColor: selectedCategory === 'teenagers' ? '#60A5FA' : '#60A5FA' }}
            onClick={() => setSelectedCategory('teenagers')}
          >
            TEENAGERS / STUDENTS
          </button>

          {/* Child */}
          <button
            className={`w-full max-w-md mx-auto block py-3 sm:py-4 px-6 sm:px-8 text-white font-semibold text-sm sm:text-base lg:text-lg border rounded-lg transition-all ${
              selectedCategory === 'child'
                ? 'bg-white/20 border-white'
                : 'border-white/30 hover:bg-white/10'
            }`}
            onClick={() => setSelectedCategory('child')}
          >
            CHILD
          </button>
        </div>

        {/* Enter button */}
        <button
          className={`py-4 px-12 text-white font-semibold text-lg rounded-lg transition-all ${
            selectedCategory && !loading
              ? 'hover:opacity-90' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: selectedCategory 
              ? 'linear-gradient(90deg, #1B0337 0%, #120326 100%)' 
              : 'linear-gradient(90deg, #666 0%, #444 100%)',
          }}
          onClick={handleEnter}
          disabled={!selectedCategory || loading}
        >
          {loading ? 'Saving...' : 'Enter'}
        </button>

        {/* Warning message when no selection */}
        {!selectedCategory && (
          <p
            className='text-yellow-400 mt-3 text-sm animate-pulse'
            style={{ fontFamily: 'Poppins' }}
          >
            ⚠️ Please select a category to continue
          </p>
        )}

        {/* Copyright */}
        <p
          className='text-white/40 mt-8 text-sm'
          style={{
            fontFamily: 'Poppins',
            fontWeight: '300',
          }}
        >
          COPYRIGHT BY IBRAHIM MEMON
        </p>
      </div>
    </div>
  )
}
