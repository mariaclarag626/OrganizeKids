'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const tempEmail = localStorage.getItem('temp_email')
    if (tempEmail) {
      setEmail(tempEmail)
      localStorage.removeItem('temp_email')
    }
  }, [])

  const handleGoogleLogin = async () => {
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
    setLoading(true)

    try {
      // Usar LocalAuthManager para validar
      const result = LocalAuthManager.login(email, password)

      if (result.success && result.user) {
        console.log('✅ Login bem-sucedido!')
        console.log('📧 Email:', email)
        console.log('👤 User data:', result.user)
        
        // Redirecionar DIRETO para o dashboard específico (pula who-is-using)
        const dashboardRoute = LocalAuthManager.getDashboardRoute(result.user.role)
        console.log('🔄 Redirecionando para:', dashboardRoute)
        router.push(dashboardRoute)
      } else {
        console.log('❌ Login falhou:', result.message)
        setError(result.message)
        
        // Se email não existe, redirecionar para signup
        if (result.message.includes('não encontrado')) {
          setTimeout(() => {
            router.push('/signup?email=' + encodeURIComponent(email))
          }, 2000)
        }
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden'>
      {/* Animated Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className='absolute bg-white rounded-full'
          style={{
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Login form */}
      <div className='relative z-10 w-full max-w-md mx-auto px-6'>
        <div className='text-center mb-8'>
          <h1 className='text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
            LOGIN
          </h1>
        </div>

        {error && (
          <div className='mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50'>
            <p className='text-red-200 text-sm text-center'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Email */}
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all'
          />

          {/* Password */}
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all'
          />

          {/* Submit button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divider */}
        <div className='flex items-center gap-4 my-6'>
          <div className='flex-1 h-px bg-white/20'></div>
          <span className='text-white/50 text-sm'>ou</span>
          <div className='flex-1 h-px bg-white/20'></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
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

        {/* Sign up link */}
        <div className='text-center mt-6'>
          <button
            onClick={() => router.push('/signup')}
            className='text-purple-300 hover:text-white transition-colors text-sm'
          >
            Não tem uma conta? Criar Conta
          </button>
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
