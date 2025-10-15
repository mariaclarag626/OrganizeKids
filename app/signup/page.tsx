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

  useEffect(() => {
    // Pegar email da URL se vier do login
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

    setLoading(true)
    console.log('🔄 Iniciando cadastro...')

    try {
      // Verificar se email já existe
      if (LocalAuthManager.emailExists(email)) {
        console.log('❌ Email já existe')
        setError('Este email já está cadastrado. Faça login!')
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(email))
        }, 2000)
        setLoading(false)
        return
      }

      // Determinar role baseado na idade
      let role: 'teenager' | 'parent' | 'kid' = 'teenager'
      const userAge = parseInt(age)
      if (userAge < 13) {
        role = 'kid'
      } else if (userAge >= 18) {
        role = 'parent'
      }

      console.log('👤 Role determinado:', role, 'para idade:', userAge)

      // Registrar usuário
      const result = LocalAuthManager.registerUser(email, password, fullName, role)

      console.log('📊 Resultado do registro:', result)

      if (result.success && result.user) {
        console.log('✅ Conta criada com sucesso!')
        console.log('👤 Usuário:', result.user)
        
        // Verificar se foi salvo no localStorage
        const savedUser = LocalAuthManager.getCurrentUser()
        console.log('💾 Usuário salvo no localStorage:', savedUser)
        
        if (savedUser) {
          console.log('🔄 Redirecionando para who-is-using...')
          // Pequeno delay e redirecionar
          setTimeout(() => {
            router.push('/who-is-using')
          }, 100)
        } else {
          console.error('❌ Erro: Usuário não foi salvo no localStorage!')
          setError('Erro ao salvar dados. Tente novamente.')
          setLoading(false)
        }
        return
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center relative overflow-hidden py-8">
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

      {/* Signup form */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SIGN UP
          </h1>
          <p className="text-white/60 text-lg">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            required
          />

          <input
            type="number"
            placeholder="Idade"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            required
          />

          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-all transform hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Divider */}
        <div className='flex items-center gap-4 my-6'>
          <div className='flex-1 h-px bg-white/20'></div>
          <span className='text-white/50 text-sm'>ou</span>
          <div className='flex-1 h-px bg-white/20'></div>
        </div>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className='w-full py-4 px-6 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-semibold text-lg flex items-center justify-center gap-3 transition-all hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <svg width='24' height='24' viewBox='0 0 24 24'>
            <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
            <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
            <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
            <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
          </svg>
          Continuar com Google
        </button>

        <div className="text-center mt-6">
          <p className="text-center text-white/50 text-sm">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Fazer Login
            </button>
          </p>
        </div>
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
