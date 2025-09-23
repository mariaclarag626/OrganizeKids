'use client'

export default function WhoIsUsingPage() {
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
        className='absolute top-8 right-8 z-30 text-white font-semibold text-lg hover:opacity-80 transition-opacity'
        onClick={() => window.location.href = '/dashboard'}
      >
        SKIP
      </button>

      {/* Main content */}
      <div className='relative z-10 text-center max-w-2xl mx-auto'>
        {/* Large planet decoration */}
        <div
          className='absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-60'
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
          }}
        />

        {/* Title */}
        <h1
          className='text-white mb-6'
          style={{
            fontFamily: 'Poppins',
            fontWeight: '700',
            fontSize: '48px',
            lineHeight: '56px',
            textTransform: 'uppercase',
          }}
        >
          WHO IS USING<br />THE APP ?
        </h1>

        {/* Subtitle */}
        <p
          className='text-white/80 mb-12'
          style={{
            fontFamily: 'Poppins',
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '24px',
          }}
        >
          Select who will be using the application, so that the<br />
          app configures the best features for you.
        </p>

        {/* Options */}
        <div className='space-y-4 mb-8'>
          {/* Parents */}
          <button
            className='w-full max-w-md mx-auto block py-4 px-8 text-white font-semibold text-lg border border-white/30 rounded-lg hover:bg-white/10 transition-all'
            onClick={() => window.location.href = '/dashboard?userType=parents'}
          >
            PARENTS
          </button>

          {/* Teenagers/Students */}
          <button
            className='w-full max-w-md mx-auto block py-4 px-8 text-white font-semibold text-lg border border-blue-400 rounded-lg hover:bg-blue-500/20 transition-all'
            style={{ borderColor: '#60A5FA' }}
            onClick={() => window.location.href = '/dashboard?userType=teenagers'}
          >
            TEENAGERS / STUDENTS
          </button>

          {/* Child */}
          <button
            className='w-full max-w-md mx-auto block py-4 px-8 text-white font-semibold text-lg border border-white/30 rounded-lg hover:bg-white/10 transition-all'
            onClick={() => window.location.href = '/dashboard?userType=child'}
          >
            CHILD
          </button>
        </div>

        {/* Enter button */}
        <button
          className='py-4 px-12 text-white font-semibold text-lg rounded-lg transition-all'
          style={{
            background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)',
          }}
          onClick={() => window.location.href = '/dashboard'}
        >
          Enter
        </button>

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
