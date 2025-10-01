'use client'

export default function SignUpPage() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 w-full h-full'
        style={{
          backgroundImage: 'url(/space-background-new.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container */}
      <div className='relative z-10 min-h-screen flex flex-col lg:flex-row'>
        {/* Left side - Logo and inspiring text */}
        <div className='w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-6 lg:p-8'>
          {/* Logo/Brand */}
          <div className='mb-4 lg:mb-8'>
            <div className='text-white font-bold text-2xl sm:text-3xl drop-shadow-lg'>OrganizeKids</div>
          </div>

          {/* Inspiring text */}
          <div className='mb-8 lg:mb-16 text-center lg:text-left'>
            <h2 
              className='text-white font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 lg:mb-6 drop-shadow-lg'
              style={{
                fontFamily: 'Poppins',
                lineHeight: '1.1',
              }}
            >
              SIGN IN TO HAVE YOUR<br />
              GOALS ACHIEVED DAILY!
            </h2>
            <p className='text-white/90 text-lg sm:text-xl drop-shadow-md max-w-md mx-auto lg:mx-0'>
              Join thousands of families organizing their lives better every day
            </p>
          </div>
        </div>

        {/* Right side - Form with white background */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8'>
          <div className='w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border-2 border-white/80'>
            {/* Back button */}
            <button
              className='mb-6 lg:mb-8 flex items-center text-white hover:text-white/80 transition-colors'
              onClick={() => window.location.href = '/'}
            >
              <svg className='w-4 h-4 sm:w-5 sm:h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              <span className='text-sm sm:text-base'>Back</span>
            </button>

            {/* Header */}
            <div className='mb-6 lg:mb-8 text-center lg:text-left'>
              <h1 className='text-2xl sm:text-3xl font-bold text-white mb-2'>SIGN UP</h1>
              <p className='text-white/80 text-sm sm:text-base'>
                Already have an account?{' '}
                <button
                  className='text-blue-300 hover:text-blue-200 font-medium underline'
                  onClick={() => window.location.href = '/'}
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Form */}
            <form className='space-y-4 sm:space-y-6'>
              {/* Full Name */}
              <div>
                <input
                  id='fullName'
                  type='text'
                  placeholder='Full Name'
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all bg-white/20 placeholder:text-white/70 text-white text-sm sm:text-base'
                  style={{
                    fontFamily: 'Poppins',
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <input
                  id='email'
                  type='email'
                  placeholder='Email address'
                  className='w-full px-4 py-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all bg-white/20 placeholder:text-white/70 text-white'
                  style={{
                    fontFamily: 'Poppins',
                  }}
                />
              </div>

              {/* Age */}
              <div>
                <input
                  id='age'
                  type='number'
                  placeholder='Age'
                  min='1'
                  max='120'
                  className='w-full px-4 py-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all bg-white/20 placeholder:text-white/70 text-white'
                  style={{
                    fontFamily: 'Poppins',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <input
                  id='password'
                  type='password'
                  placeholder='Password'
                  className='w-full px-4 py-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all bg-white/20 placeholder:text-white/70 text-white'
                  style={{
                    fontFamily: 'Poppins',
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your password'
                  className='w-full px-4 py-3 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all bg-white/20 placeholder:text-white/70 text-white'
                  style={{
                    fontFamily: 'Poppins',
                  }}
                />
              </div>

              {/* Terms and Conditions */}
              <div className='flex items-start space-x-3'>
                <input
                  id='terms'
                  type='checkbox'
                  className='mt-1 w-4 h-4 text-purple-600 border-white/30 bg-white/20 rounded focus:ring-white/50 focus:ring-2'
                />
                <label htmlFor='terms' className='text-sm text-white/80'>
                  By registering you agree to our{' '}
                  <a href='#' className='text-blue-300 hover:text-blue-200 underline'>Terms and Conditions</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type='button'
                className='w-full py-3 px-4 text-white font-semibold rounded-lg transition-all hover:opacity-90 flex items-center justify-center'
                style={{
                  background: 'linear-gradient(90deg, #1B0337 0%, #120326 100%)',
                  fontFamily: 'Poppins',
                }}
                onClick={() => window.location.href = '/who-is-using'}
              >
                Sign up
                <svg className='w-5 h-5 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </button>
            </form>

            {/* Social Login */}
            <div className='mt-6'>
              <div className='text-center text-sm text-white/70 mb-4'>Or continue with</div>
              <div className='flex space-x-3'>
                <button
                  className='flex-1 flex items-center justify-center py-2 px-4 border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5'
                  onClick={() => alert('Google login coming soon!')}
                >
                  <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                    <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                    <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                    <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                    <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                  </svg>
                  <span className='text-white'>Google</span>
                </button>
                <button
                  className='flex-1 flex items-center justify-center py-2 px-4 border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors bg-white/5'
                  onClick={() => alert('Facebook login coming soon!')}
                >
                  <svg className='w-5 h-5 mr-2' fill='#1877F2' viewBox='0 0 24 24'>
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                  </svg>
                  <span className='text-white'>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
