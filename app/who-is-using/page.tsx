'use client'

import { useState } from 'react'

export default function WhoIsUsingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
            selectedCategory 
              ? 'hover:opacity-90' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: selectedCategory 
              ? 'linear-gradient(90deg, #1B0337 0%, #120326 100%)' 
              : 'linear-gradient(90deg, #666 0%, #444 100%)',
          }}
          onClick={() => {
            if (selectedCategory) {
              window.location.href = `/dashboard?userType=${selectedCategory}`
            } else {
              alert('Please select a category before continuing!')
            }
          }}
        >
          Enter
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
