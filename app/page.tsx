'use client'

export default function HomePage() {
  return (
    <div 
      className='min-h-screen w-full relative overflow-hidden flex'
      style={{
        background: `
          linear-gradient(90deg, 
            transparent 0%, 
            transparent 30%, 
            rgba(27, 3, 55, 0.2) 45%,
            rgba(27, 3, 55, 0.6) 60%,
            rgba(27, 3, 55, 0.85) 70%,
            #1B0337 80%,
            #120326 90%,
            #120326 100%
          ),
          url(/space-background-new.png)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center left',
        backgroundRepeat: 'no-repeat',
      }}
    >
        
        {/* Motivational Text */}
        <div className='absolute bottom-20 left-8 lg:left-16 z-10 max-w-md lg:max-w-lg'>
          <h1
            className='text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight uppercase drop-shadow-lg'
            style={{
              fontFamily: 'Poppins',
            }}
          >
            SIGN IN TO HAVE YOUR<br />
            GOALS ACHIEVED DAILY!
          </h1>
        </div>

      {/* Right Side - Form Container */}
      <div 
        className='ml-auto w-full lg:w-2/5 relative flex items-center justify-center p-8 lg:p-16'
      >
        {/* Skip Sign In button - Top Right */}
        <button
          className='absolute top-6 right-6 lg:top-8 lg:right-8 z-30 text-white font-semibold text-sm lg:text-base hover:opacity-80 transition-opacity'
          onClick={() => window.location.href = '/who-is-using'}
          style={{
            fontFamily: 'Poppins',
            fontWeight: '600',
          }}
        >
          SKIP LOGIN
        </button>

        {/* Login Form Container */}
        <div className='w-full max-w-md mx-auto'>
          {/* Title - LOGIN */}
          <h2
            className='text-white font-bold text-4xl lg:text-5xl mb-6 text-center'
            style={{
              fontFamily: 'Poppins',
            }}
          >
            LOGIN
          </h2>

          {/* SubTitle */}
          <p
            className='text-white/80 text-sm lg:text-base mb-6 text-center'
            style={{
              fontFamily: 'Poppins',
            }}
          >
            Login with email address
          </p>

          {/* Email Input */}
          <div className='relative mb-6'>
            <div
              className='w-full h-14 relative flex items-center'
              style={{
                background: 'rgba(37, 16, 69, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(164, 164, 164, 0.2)',
              }}
            >
              {/* Email Icon */}
              <div className='absolute left-4 w-5 h-5'>
                <svg viewBox='0 0 24 24' fill='none' className='h-full w-full'>
                  <path
                    d='M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z'
                    stroke='#A4A4A4'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <polyline
                    points='22,6 12,13 2,6'
                    stroke='#A4A4A4'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>

              {/* Input Text */}
              <input
                type='email'
                placeholder='Yourname@gmail.com'
                className='pl-12 pr-4 w-full h-full bg-transparent border-none outline-none placeholder:text-[#A4A4A4] text-white'
                style={{
                  fontFamily: 'Poppins',
                }}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            className='w-full h-12 mb-4 cursor-pointer border-none rounded-xl hover:opacity-90 transition-opacity font-medium text-white'
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
              fontFamily: 'Poppins',
            }}
            onClick={() => window.location.href = '/who-is-using'}
          >
            Login
          </button>

          {/* Create New Account Button */}
          <button
            className='w-full h-12 mb-6 cursor-pointer border border-white/30 rounded-xl hover:bg-white/10 transition-all font-medium text-white bg-transparent'
            style={{
              fontFamily: 'Poppins',
            }}
            onClick={() => window.location.href = '/signup'}
          >
            Create New Account
          </button>

          {/* Or continue with */}
          <p
            className='text-white/60 text-sm mb-4 text-center'
            style={{
              fontFamily: 'Poppins',
            }}
          >
            Or continue with
          </p>

          {/* Social Buttons Container */}
          <div className='flex gap-3 mb-6'>
            {/* Google Button */}
            <button
              className='flex-1 h-12 cursor-pointer border-none flex items-center justify-center gap-2 hover:opacity-90 transition-opacity rounded-xl'
              style={{
                background: 'rgba(37, 16, 69, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={() => {
                alert('Google authentication would be implemented here with NextAuth.js');
                setTimeout(() => window.location.href = '/who-is-using', 1000);
              }}
            >
              <div className='w-5 h-5'>
                <svg viewBox='0 0 24 24' className='h-full w-full'>
                  <path fill='#FFC107' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                  <path fill='#4CAF50' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                  <path fill='#1976D2' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                  <path fill='#FF3D00' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                </svg>
              </div>
              <span className='text-white font-medium text-sm' style={{ fontFamily: 'Poppins' }}>
                Google
              </span>
            </button>

            {/* Facebook Button */}
            <button
              className='flex-1 h-12 cursor-pointer border-none flex items-center justify-center gap-2 hover:opacity-90 transition-opacity rounded-xl'
              style={{
                background: 'rgba(37, 16, 69, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
              onClick={() => {
                alert('Facebook authentication would be implemented here with NextAuth.js');
                setTimeout(() => window.location.href = '/who-is-using', 1000);
              }}
            >
              <div className='w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center'>
                <svg viewBox='0 0 24 24' className='w-3 h-3 text-white'>
                  <path fill='currentColor' d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z' />
                </svg>
              </div>
              <span className='text-white font-medium text-sm' style={{ fontFamily: 'Poppins' }}>
                Facebook
              </span>
            </button>
          </div>

          {/* Terms */}
          <p
            className='text-white/50 text-xs text-center mb-4'
            style={{ fontFamily: 'Poppins' }}
          >
            By registering you with our Terms and Conditions
          </p>
        </div>
      </div>
    </div>
  )
}