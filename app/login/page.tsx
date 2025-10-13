'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('user_email', email)
        router.push('/who-is-using')
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className='min-h-screen w-full relative overflow-hidden flex items-center justify-center'
      style={{
        background: 'linear-gradient(180deg, #0A0118 0%, #1B0B3D 40%, #2D1458 70%, #1B0B3D 100%)',
      }}
    >
      {/* Space background - same as home page */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div 
          className='absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full'
          style={{
            background: 'radial-gradient(circle at 35% 35%, #7DE3F4 0%, #4DD0E1 25%, #26C6DA 50%, #00ACC1 75%, #0097A7 100%)',
            boxShadow: '0 0 100px rgba(77, 208, 225, 0.4), inset -30px -30px 80px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className='absolute top-20 left-32 w-64 h-32 rounded-full opacity-30'
            style={{
              background: 'radial-gradient(ellipse, #1A5F7A 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
        </div>

        <div 
          className='absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full'
          style={{
            background: 'radial-gradient(circle at 40% 35%, #A78BFA 0%, #8B5CF6 40%, #7C3AED 70%, #6D28D9 100%)',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.5), inset -20px -20px 40px rgba(0, 0, 0, 0.4)',
          }}
        />

        <div 
          className='absolute bottom-0 right-0 w-96 h-96 rounded-full'
          style={{
            background: 'radial-gradient(circle at 30% 30%, #B794F6 0%, #9F7AEA 30%, #805AD5 60%, #6B46C1 85%, #553C9A 100%)',
            boxShadow: '0 0 80px rgba(128, 90, 213, 0.6), inset -25px -25px 60px rgba(0, 0, 0, 0.5)',
          }}
        />

        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className='absolute rounded-full bg-white'
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Login form */}
      <div className='relative z-10 w-full max-w-md mx-auto px-4'>
        <div className='text-center mb-8'>
          <h2 
            className='text-white text-6xl font-bold mb-3'
            style={{ fontFamily: 'Poppins', letterSpacing: '0.05em' }}
          >
            LOGIN
          </h2>
          <p className='text-white/80 text-lg' style={{ fontFamily: 'Poppins' }}>
            Enter your credentials
          </p>
        </div>

        {error && (
          <div className='mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50'>
            <p className='text-red-200 text-sm text-center'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
            </div>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <div className='relative'>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:brightness-110 disabled:opacity-50'
            style={{
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
              fontFamily: 'Poppins',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className='text-center mt-6'>
          <button
            onClick={() => router.push('/signup')}
            className='text-purple-300 hover:text-purple-200 text-sm transition-colors'
            style={{ fontFamily: 'Poppins' }}
          >
            Don't have an account? Sign up
          </button>
        </div>

        <p className='text-white/40 text-xs text-center mt-8' style={{ fontFamily: 'Poppins' }}>
          By continuing you agree with our Terms and Conditions
        </p>
      </div>
    </div>
  )
}
