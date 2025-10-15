'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'
import { useSyncAuth } from '@/lib/useSyncAuth'

export default function WhoIsUsingPage() {
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState<'teenager' | 'parent' | 'kid' | null>(null)
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()
  
  // Sincronizar NextAuth com localStorage
  useSyncAuth()

  useEffect(() => {
    const currentUser = LocalAuthManager.getCurrentUser()
    console.log('🔍 Who-is-using: Verificando usuário atual:', currentUser)
    
    if (!currentUser) {
      console.log('❌ Who-is-using: Nenhum usuário encontrado, redirecionando para /')
      router.push('/')
      return
    }

    console.log('✅ Who-is-using: Usuário encontrado!', currentUser)
    setUserName(currentUser.name)
    setUserRole(currentUser.role)
    
    // Verificar se usuário veio do Google OAuth (sem senha = OAuth)
    // E se tem role = 'parent' (padrão do OAuth)
    if (!currentUser.password && currentUser.role === 'parent') {
      // Verificar se já escolheu o role antes
      const hasChosenRole = localStorage.getItem(`role_chosen_${currentUser.email}`)
      
      if (!hasChosenRole) {
        // Precisa escolher o role
        setNeedsRoleSelection(true)
        return // Não inicia countdown
      }
    }
    
    // Iniciar countdown de 3 segundos
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Redirecionar para o dashboard
          const dashboardRoute = LocalAuthManager.getDashboardRoute(currentUser.role)
          router.push(dashboardRoute)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const handleRoleSelection = (selectedRole: 'teenager' | 'parent' | 'kid') => {
    const currentUser = LocalAuthManager.getCurrentUser()
    if (!currentUser) return

    // Atualizar o role do usuário
    LocalAuthManager.updateUserRole(currentUser.email, selectedRole)
    
    // Marcar que o usuário já escolheu o role
    localStorage.setItem(`role_chosen_${currentUser.email}`, 'true')
    
    // Atualizar estado e iniciar countdown
    setUserRole(selectedRole)
    setNeedsRoleSelection(false)
    
    // Redirecionar imediatamente
    const dashboardRoute = LocalAuthManager.getDashboardRoute(selectedRole)
    router.push(dashboardRoute)
  }

  const categories = [
    {
      id: 'teenager' as const,
      name: 'Adolescente',
      emoji: '🧑‍🎓',
      description: 'Para adolescentes (13-17 anos)',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'parent' as const,
      name: 'Pais',
      emoji: '👨‍👩‍👧‍👦',
      description: 'Para gerenciar a família',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'kid' as const,
      name: 'Criança',
      emoji: '🧒',
      description: 'Para crianças (até 12 anos)',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  // Encontrar categoria selecionada baseada no role
  const selectedCategory = categories.find(cat => cat.id === userRole)

  // Se precisa escolher o role, mostrar cards clicáveis
  if (needsRoleSelection) {
    return (
      <div className='min-h-screen w-full flex items-center justify-center p-4' style={{
        background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
      }}>
        <div className='w-full max-w-6xl'>
          <div className='text-center mb-12'>
            <h1 className='text-5xl font-bold text-white mb-4'>
              Olá, {userName || 'Usuário'}! 👋
            </h1>
            <p className='text-xl text-white/80 mb-2'>
              Quem está usando?
            </p>
            <p className='text-lg text-white/60'>
              Clique no card que melhor te representa
            </p>
          </div>

          {/* Grid de cards clicáveis */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleRoleSelection(category.id)}
                className='group relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white'
              >
                <div className={`bg-gradient-to-br ${category.gradient} absolute inset-0 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className='relative z-10 text-center'>
                  <div className='text-6xl mb-4 group-hover:scale-110 transition-transform'>{category.emoji}</div>
                  <h3 className='text-3xl font-bold text-white mb-3'>
                    {category.name}
                  </h3>
                  <p className='text-white/90 text-base'>
                    {category.description}
                  </p>
                </div>

                {/* Efeito hover */}
                <div className='absolute inset-0 rounded-2xl ring-4 ring-white/0 group-hover:ring-white/50 transition-all'></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{
      background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
    }}>
      <div className='w-full max-w-4xl'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-white mb-4'>
            Olá, {userName || 'Usuário'}! 👋
          </h1>
          <p className='text-xl text-white/80'>
            Você está entrando como:
          </p>
        </div>

        {/* Card da categoria selecionada - centralizado e maior */}
        {selectedCategory && (
          <div className='flex justify-center mb-8'>
            <div className='relative p-12 rounded-2xl w-96 ring-4 ring-white shadow-2xl'>
              <div className={`bg-gradient-to-br ${selectedCategory.gradient} absolute inset-0 rounded-2xl opacity-90`}></div>
              
              <div className='relative z-10 text-center'>
                <div className='text-8xl mb-6'>{selectedCategory.emoji}</div>
                <h3 className='text-4xl font-bold text-white mb-4'>
                  {selectedCategory.name}
                </h3>
                <p className='text-white/90 text-lg'>
                  {selectedCategory.description}
                </p>
              </div>

              <div className='absolute top-6 right-6 bg-white rounded-full p-3'>
                <svg className='w-8 h-8 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Contador de redirecionamento */}
        <div className='text-center'>
          <div className='text-white text-2xl font-semibold mb-4'>
            Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </div>
          <div className='flex justify-center'>
            <div className='w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin'></div>
          </div>
        </div>
      </div>
    </div>
  )
}
