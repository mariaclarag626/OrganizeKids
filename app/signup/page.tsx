'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'
import { signIn } from 'next-auth/react'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdultChoice, setShowAdultChoice] = useState(false)
  const [adultProfileType, setAdultProfileType] = useState<'parent' | 'personal' | null>(null)

  useEffect(() => {
    const emailParam = searchParams?.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/who-is-using' })
    } catch (err) {
      setError('Erro ao conectar com Google')
      setLoading(false)
    }
  }

  const handleAdultChoice = async (choice: 'parent' | 'personal') => {
    setAdultProfileType(choice)
    const userAge = parseInt(age)
    await createAccount(userAge)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    console.log('📝 Dados do formulário:', { fullName, email, age, password, confirmPassword })

    if (!fullName || !email || !password || !confirmPassword || !age) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      setError('Por favor, insira uma idade válida')
      return
    }

    const userAge = parseInt(age)

    // Se for adulto (18+), mostrar tela de escolha
    if (userAge >= 18) {
      setShowAdultChoice(true)
      return
    }

    // Se não for adulto, continuar com o fluxo normal
    await createAccount(userAge)
  }

  const createAccount = async (userAge: number) => {
    setLoading(true)
    console.log('🔄 Iniciando cadastro...')

    try {
      if (LocalAuthManager.emailExists(email)) {
        console.log('❌ Email já existe')
        setError('Este email já está cadastrado. Faça login!')
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(email))
        }, 2000)
        setLoading(false)
        return
      }

      // Determinar role baseado na idade e escolha do usuário
      let role: 'teenager' | 'parent' | 'kid' = 'teenager'
      
      if (userAge < 13) {
        role = 'kid'
      } else if (userAge >= 18) {
        // Para adultos, usar a escolha feita na tela intermediária
        role = adultProfileType === 'personal' ? 'teenager' : 'parent'
      }

      console.log('👤 Role determinado:', role, 'para idade:', userAge, 'tipo adulto:', adultProfileType)

      const result = LocalAuthManager.registerUser(email, password, fullName, role)

      console.log('📊 Resultado do registro:', result)

      if (result.success && result.user) {
        console.log('✅ Conta criada com sucesso!')
        console.log('👤 Usuário:', result.user)
        
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const savedUser = LocalAuthManager.getCurrentUser()
        console.log('💾 Usuário salvo no localStorage:', savedUser)
        
        if (savedUser) {
          console.log('🔄 Redirecionando para who-is-using...')
          setLoading(false)
          router.push('/who-is-using')
        } else {
          console.error('❌ Erro: Usuário não foi salvo no localStorage!')
          setError('Erro ao salvar dados. Tente novamente.')
          setLoading(false)
        }
      } else {
        console.log('❌ Erro ao criar conta:', result.message)
        setError(result.message || 'Erro ao criar conta')
        setLoading(false)
      }
    } catch (err) {
      console.error('❌ Erro no try/catch:', err)
      setError('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `linear-gradient(135deg, 
        #250e2c 0%, 
        #837ab6 25%, 
        #9d85b6 40%, 
        #cc8db3 60%, 
        #f6a5c0 80%, 
        #f7c2ca 100%
      )`
    }}>

      {/* Estrelas simples e sutis - mesma quantidade do login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: '1px',
              height: '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Algumas estrelas maiores e mais brilhantes para efeito */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`bright-${i}`}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: '2px',
              height: '2px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              opacity: 0.8,
              boxShadow: '0 0 4px rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </div>

      {/* Container principal centralizado */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-8 px-4">
        <div className="w-full max-w-md mx-auto">
        {!showAdultChoice ? (
          /* Formulário Inicial de Signup */
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                SIGN UP
              </h1>
              <p className="text-white/70 text-sm">Create your account and join us</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Campo Nome */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Campo Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Campo Idade */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Campo Confirmar Senha */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  required
                />
              </div>

              {/* Botão Sign Up */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#cc8db3] via-[#837ab6] to-[#250e2c] hover:from-[#cc8db3] hover:via-[#837ab6] hover:to-[#2b1035] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse"></div>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-white/60 text-sm">Or continue with</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Botão Google */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white text-sm font-medium">Google</span>
            </button>

            {/* Link para Login */}
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-purple-400 hover:text-purple-300 underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* Tela de Escolha para Adultos (18+) */
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vimos que você tem mais de 18 anos!
              </h2>
              <p className="text-white/80 text-lg mt-4">
                Como você deseja usar o OrganizeKids?
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Opção 1: Pai/Mãe ou Responsável */}
            <button
              onClick={() => handleAdultChoice('parent')}
              disabled={loading}
              className="w-full p-6 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-purple-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">👨‍👩‍👧‍👦</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    Sou pai/mãe ou responsável
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    Quero organizar a rotina da minha família e gerenciar tarefas das crianças
                  </p>
                </div>
                <div className="text-white/40 group-hover:text-purple-400 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Opção 2: Uso Pessoal */}
            <button
              onClick={() => handleAdultChoice('personal')}
              disabled={loading}
              className="w-full p-6 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-blue-400 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">📋</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    Quero usar para minha própria organização pessoal
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    Vou usar o OrganizeKids para organizar minhas próprias tarefas e rotina
                  </p>
                </div>
                <div className="text-white/40 group-hover:text-blue-400 transition-colors">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Botão Voltar */}
            <button
              onClick={() => setShowAdultChoice(false)}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Voltar
            </button>

            {loading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="text-white/60 mt-2">Criando sua conta...</p>
              </div>
            )}
            </div>
          </div>
        )}
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, rgba(167, 56, 145, 0.2) 0%, transparent 50%);
        }
      `}</style>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
