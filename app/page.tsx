'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleLogin = () => {
    if (email) {
      localStorage.setItem('temp_email', email)
    }
    router.push('/login')
  }

  const handleCreateAccount = () => {
    router.push('/signup')
  }

  const handleSkipLogin = () => {
    router.push('/who-is-using')
  }

  const handleGoogleLogin = () => {
    alert('Google login will be implemented soon! 🚀\nFor now, please use email/password or skip login.')
  }

  const handleFacebookLogin = () => {
    alert('Facebook login will be implemented soon! 🚀\nFor now, please use email/password or skip login.')
  }

  return (
    <div 
      className='min-h-screen w-full relative overflow-hidden flex items-center justify-center'
      style={{
        background: 'linear-gradient(180deg, #0A0118 0%, #1B0B3D 40%, #2D1458 70%, #1B0B3D 100%)',
      }}
    >
      {/* Skip Login button - top right */}
      <button
        onClick={handleSkipLogin}
        className='absolute top-8 right-8 z-50 text-white font-medium px-6 py-2 rounded-lg hover:bg-white/10 transition-all'
        style={{ fontFamily: 'Poppins' }}
      >
        SKIP LOGIN
      </button>

      {/* Space background with planets and stars */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Big cyan planet - top left with animation */}
        <div 
          className='absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full animate-float-slow'
          style={{
            background: 'radial-gradient(circle at 35% 35%, #7DE3F4 0%, #4DD0E1 25%, #26C6DA 50%, #00ACC1 75%, #0097A7 100%)',
            boxShadow: '0 0 100px rgba(77, 208, 225, 0.4), inset -30px -30px 80px rgba(0, 0, 0, 0.3)',
            animation: 'float-slow 20s ease-in-out infinite, glow-cyan 3s ease-in-out infinite',
          }}
        >
          {/* Cloud-like patterns on planet */}
          <div className='absolute top-20 left-32 w-64 h-32 rounded-full opacity-30'
            style={{
              background: 'radial-gradient(ellipse, #1A5F7A 0%, transparent 70%)',
              filter: 'blur(20px)',
              animation: 'drift 15s ease-in-out infinite',
            }}
          />
          <div className='absolute top-40 left-20 w-48 h-24 rounded-full opacity-25'
            style={{
              background: 'radial-gradient(ellipse, #0D3B52 0%, transparent 70%)',
              filter: 'blur(15px)',
              animation: 'drift 12s ease-in-out infinite reverse',
            }}
          />
          <div className='absolute bottom-32 right-24 w-56 h-28 rounded-full opacity-20'
            style={{
              background: 'radial-gradient(ellipse, #0A2F42 0%, transparent 70%)',
              filter: 'blur(18px)',
              animation: 'drift 18s ease-in-out infinite',
            }}
          />
        </div>

        {/* Purple planet - middle center with rotation */}
        <div 
          className='absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full'
          style={{
            background: 'radial-gradient(circle at 40% 35%, #A78BFA 0%, #8B5CF6 40%, #7C3AED 70%, #6D28D9 100%)',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.5), inset -20px -20px 40px rgba(0, 0, 0, 0.4)',
            animation: 'float-medium 15s ease-in-out infinite, glow-purple 4s ease-in-out infinite',
          }}
        />

        {/* Small purple planet - bottom left */}
        <div 
          className='absolute bottom-32 left-1/4 w-32 h-32 rounded-full'
          style={{
            background: 'radial-gradient(circle at 45% 40%, #9F7AEA 0%, #805AD5 50%, #6B46C1 100%)',
            boxShadow: '0 0 40px rgba(128, 90, 213, 0.4)',
            animation: 'float-fast 10s ease-in-out infinite',
          }}
        />

        {/* Large purple planet - bottom right with swirl */}
        <div 
          className='absolute bottom-0 right-0 w-96 h-96 rounded-full'
          style={{
            background: 'radial-gradient(circle at 30% 30%, #B794F6 0%, #9F7AEA 30%, #805AD5 60%, #6B46C1 85%, #553C9A 100%)',
            boxShadow: '0 0 80px rgba(128, 90, 213, 0.6), inset -25px -25px 60px rgba(0, 0, 0, 0.5)',
            animation: 'float-slow 25s ease-in-out infinite reverse, glow-purple 3s ease-in-out infinite',
          }}
        >
          {/* Swirl pattern */}
          <div className='absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20'
            style={{
              background: 'radial-gradient(circle, #4C1D95 0%, transparent 60%)',
              filter: 'blur(10px)',
              animation: 'spin-slow 30s linear infinite',
            }}
          />
        </div>

        {/* Stars - various sizes */}
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
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Bright stars with glow */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`bright-star-${i}`}
            className='absolute'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <div 
              className='relative w-2 h-2 bg-white rounded-full'
              style={{
                boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px rgba(255, 255, 255, 0.5)',
                animation: `pulse ${Math.random() * 2 + 1}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </div>
        ))}

        {/* Shooting stars */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`shooting-${i}`}
            className='absolute w-1 h-1 bg-white rounded-full'
            style={{
              top: `${Math.random() * 50}%`,
              right: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px #fff, 0 0 8px #fff',
              animation: `shoot ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.5);
            opacity: 1;
          }
        }
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(-300px) translateY(300px);
            opacity: 0;
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-medium {
          0%, 100% {
            transform: translate(-50%, 0px);
          }
          50% {
            transform: translate(-50%, -15px);
          }
        }
        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        @keyframes glow-cyan {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }
        @keyframes glow-purple {
          0%, 100% {
            filter: brightness(1) saturate(1);
          }
          50% {
            filter: brightness(1.3) saturate(1.2);
          }
        }
        @keyframes drift {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(20px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Main content */}
      <div className='relative z-10 w-full max-w-md mx-auto px-4'>
        <div className='text-center mb-8'>
          <h2 
            className='text-white text-6xl font-bold mb-3'
            style={{ fontFamily: 'Poppins', letterSpacing: '0.05em' }}
          >
            LOGIN
          </h2>
          <p className='text-white/80 text-lg' style={{ fontFamily: 'Poppins' }}>
            Login with email address
          </p>
        </div>

        <div className='space-y-4'>
          {/* Email input */}
          <div className='relative'>
            <div className='absolute left-4 top-1/2 -translate-y-1/2 text-white/50'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path d='M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
              </svg>
            </div>
            <input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all'
              style={{ fontFamily: 'Poppins' }}
            />
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            className='w-full py-4 rounded-xl font-semibold text-white text-lg transition-all hover:brightness-110'
            style={{
              background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
              fontFamily: 'Poppins',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            Login
          </button>

          {/* Create New Account button */}
          <button
            onClick={handleCreateAccount}
            className='w-full py-4 rounded-xl font-semibold text-white text-lg border-2 border-white/30 hover:bg-white/5 transition-all'
            style={{
              fontFamily: 'Poppins',
            }}
          >
            Create New Account
          </button>
        </div>

        {/* Divider */}
        <div className='my-8 flex items-center'>
          <div className='flex-1 border-t border-white/20'></div>
          <div className='px-4 flex items-center gap-2'>
            <div className='w-1 h-1 bg-white/30 rounded-full'></div>
            <span className='text-white/50 text-sm' style={{ fontFamily: 'Poppins' }}>continue with</span>
            <div className='w-1 h-1 bg-white/30 rounded-full'></div>
          </div>
          <div className='flex-1 border-t border-white/20'></div>
        </div>

        {/* Social buttons */}
        <div className='flex gap-4 justify-center'>
          <button 
            onClick={handleGoogleLogin}
            className='flex items-center gap-3 px-6 py-3 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-100 hover:scale-105 transition-all shadow-lg'>
            <svg width='20' height='20' viewBox='0 0 20 20'>
              <path d='M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z' fill='#4285F4'/>
              <path d='M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z' fill='#34A853'/>
              <path d='M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z' fill='#FBBC05'/>
              <path d='M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z' fill='#EA4335'/>
            </svg>
            <span style={{ fontFamily: 'Poppins' }}>Google</span>
          </button>
          
          <button 
            onClick={handleFacebookLogin}
            className='flex items-center gap-3 px-6 py-3 rounded-xl bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] hover:scale-105 transition-all shadow-lg'>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='white'>
              <path d='M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z'/>
            </svg>
            <span style={{ fontFamily: 'Poppins' }}>Facebook</span>
          </button>
        </div>

        {/* Terms */}
        <p className='text-white/40 text-xs text-center mt-8' style={{ fontFamily: 'Poppins' }}>
          By registering you with our Terms and Conditions
        </p>
      </div>
    </div>
  )
}
