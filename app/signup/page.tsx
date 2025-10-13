'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      setError('Please enter a valid age')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          email,
          password,
          fullName,
          age: parseInt(age),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Account created successfully - redirect to login
        localStorage.setItem('temp_email', email)
        alert('Account created successfully! Please login.')
        router.push('/login')
      } else {
        setError(data.error || 'Error creating account')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className='min-h-screen w-full relative overflow-hidden flex items-center justify-center py-8'
      style={{
        background: 'linear-gradient(180deg, #0A0118 0%, #1B0B3D 40%, #2D1458 70%, #1B0B3D 100%)',
      }}
    >
      {/* Space background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div 
          className='absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full'
          style={{
            background: 'radial-gradient(circle at 35% 35%, #7DE3F4 0%, #4DD0E1 25%, #26C6DA 50%, #00ACC1 75%, #0097A7 100%)',
            boxShadow: '0 0 100px rgba(77, 208, 225, 0.4), inset -30px -30px 80px rgba(0, 0, 0, 0.3)',
          }}
        />

        <div 
          className='absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full'
          style={{
            background: 'radial-gradient(circle at 40% 35%, #A78BFA 0%, #8B5CF6 40%, #7C3AED 70%, #6D28D9 100%)',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.5)',
          }}
        />

        <div 
          className='absolute bottom-0 right-0 w-96 h-96 rounded-full'
          style={{
            background: 'radial-gradient(circle at 30% 30%, #B794F6 0%, #9F7AEA 30%, #805AD5 60%, #6B46C1 85%, #553C9A 100%)',
            boxShadow: '0 0 80px rgba(128, 90, 213, 0.6)',
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

      {/* Signup form */}
      <div className='relative z-10 w-full max-w-md mx-auto px-4'>
        <div className='text-center mb-8'>
          <h2 
            className='text-white text-6xl font-bold mb-3'
            style={{ fontFamily: 'Poppins', letterSpacing: '0.05em' }}
          >
            SIGN UP
          </h2>
          <p className='text-white/80 text-lg' style={{ fontFamily: 'Poppins' }}>
            Create your account
          </p>
        </div>

        {error && (
          <div className='mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50'>
            <p className='text-red-200 text-sm text-center'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Full Name */}
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z' stroke='currentColor' strokeWidth='1.5'/>
                <path d='M2.5 18.3333C2.5 14.6514 5.65143 11.6667 9.5 11.6667H10.5C14.3486 11.6667 17.5 14.6514 17.5 18.3333' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
              </svg>
            </div>
            <input
              type='text'
              placeholder='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          {/* Email */}
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

          {/* Age */}
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z' stroke='currentColor' strokeWidth='1.5'/>
                <path d='M10 5V10L13.3333 11.6667' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
            </div>
            <input
              type='number'
              placeholder='Age'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min='1'
              max='120'
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          {/* Password */}
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M5.83333 9.16667V6.66667C5.83333 4.36548 7.69881 2.5 10 2.5C12.3012 2.5 14.1667 4.36548 14.1667 6.66667V9.16667M5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V11.6667C17.5 10.286 16.3807 9.16667 15 9.16667H5C3.61929 9.16667 2.5 10.286 2.5 11.6667V15C2.5 16.3807 3.61929 17.5 5 17.5Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
              </svg>
            </div>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          {/* Confirm Password */}
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M5.83333 9.16667V6.66667C5.83333 4.36548 7.69881 2.5 10 2.5C12.3012 2.5 14.1667 4.36548 14.1667 6.66667V9.16667M5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V11.6667C17.5 10.286 16.3807 9.16667 15 9.16667H5C3.61929 9.16667 2.5 10.286 2.5 11.6667V15C2.5 16.3807 3.61929 17.5 5 17.5Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round'/>
              </svg>
            </div>
            <input
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          {/* Submit button */}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='text-center mt-6'>
          <button
            onClick={() => router.push('/')}
            className='text-purple-300 hover:text-purple-200 text-sm transition-colors'
            style={{ fontFamily: 'Poppins' }}
          >
            Already have an account? Login
          </button>
        </div>

        <p className='text-white/40 text-xs text-center mt-8' style={{ fontFamily: 'Poppins' }}>
          By registering you agree with our Terms and Conditions
        </p>
      </div>
    </div>
  )
}
