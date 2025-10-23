'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'
import { signIn } from 'next-auth/react'
// Image removed; background will use gradient like /signup
import ShootingStarsBackground from '@/components/ShootingStarsBackground'

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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `linear-gradient(135deg, 
        #250e2c 0%, 
        #837ab6 15%, 
        #9d85b6 30%, 
        #cc8db3 45%, 
        #f6a5c0 60%, 
        #f7c2ca 75%, 
        #FEA98E 82%, 
        #FEBB8E 90%, 
        #FFD99E 100%
      )`
    }}>
      {/* Canvas background: stars + gentle meteors on auth pages */}
  <ShootingStarsBackground className="absolute inset-0" meteors={true} meteorRate={1.2} maxFps={60} starCount={460} />

      <div className="relative z-10 flex min-h-screen items-center flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 gap-8">
        {/* Lado Esquerdo - Texto Motivacional (mais estreito e centralizado verticalmente) */}
        <div className="flex-1 lg:basis-2/5 flex items-center justify-start p-8">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
              LOGIN TO HAVE YOUR
              <br />
              <span className="text-white">
                GOALS ACHIEVED DAILY!
              </span>
            </h1>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login (card centralizado) */}
        <div className="flex-1 lg:basis-3/5 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Card do Formulário */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">LOGIN</h2>
              <p className="text-white/70 mb-8 text-sm">Login with email address</p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Yourname@gmail.com"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Campo Password */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Botão Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#837ab6] hover:bg-[#7a70aa] text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse"></div>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              {/* Divisor */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/60 text-sm">Or continue with</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Botões Sociais */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Google</span>
                </button>

                <button
                  className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-white text-sm font-medium">Facebook</span>
                </button>
              </div>

              {/* Termos e Cadastro */}
              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm mb-4">
                  By registering you with our{' '}
                  <span className="text-purple-400 hover:text-purple-300 underline cursor-pointer">
                    Terms and Conditions
                  </span>
                </p>
                <p className="text-white/60 text-sm">
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => router.push('/signup')}
                    className="text-purple-400 hover:text-purple-300 underline font-medium"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
