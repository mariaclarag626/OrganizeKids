'use client'

export default function HomePage() {
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

      {/* Skip Sign In button - Top Right */}
      <button
        className='absolute top-8 right-8 z-30 text-white font-semibold text-lg hover:opacity-80 transition-opacity'
        onClick={() => window.location.href = '/who-is-using'}
        style={{
          fontFamily: 'Poppins',
          fontWeight: '600',
          fontSize: '16px',
        }}
      >
        SKIP SIGN IN
      </button>

      {/* Fade at bottom - Fixed to bottom of viewport */}
      <div
        className='fixed bottom-0 left-0 w-full z-20'
        style={{
          height: '134px',
          background:
            'linear-gradient(0deg, #160430 0%, rgba(22, 4, 48, 0) 100%)',
        }}
      />

      <div
        className='relative z-10 mx-auto overflow-hidden'
        style={{
          width: '1429px',
          height: '928.09px',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        {/* Title - Bottom Left */}
        <div
          className='absolute'
          style={{
            width: '800px',
            height: '120px',
            left: '0px',
            top: '700px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '50px',
            lineHeight: '56px',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          SIGN IN TO HAVE YOUR GOALS ACHIEVED DAILY!!
        </div>

        {/* Title - LOG IN */}
        <div
          className='absolute'
          style={{
            width: '287px',
            height: '117px',
            left: '901px',
            top: '197px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '77.7112px',
            lineHeight: '117px',
            color: '#FFFFFF',
          }}
        >
          LOG IN
        </div>

        {/* SubTitle */}
        <div
          className='absolute'
          style={{
            width: '203px',
            height: '23px',
            left: '901px',
            top: '329.86px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '15.0409px',
            lineHeight: '23px',
            color: '#FFFFFF',
          }}
        >
          Sign in with email address
        </div>

        {/* Email Input */}
        <div
          className='absolute'
          style={{
            width: '460px',
            height: '68.94px',
            left: '901px',
            top: '369.97px',
          }}
        >
          {/* Input Background */}
          <div
            className='absolute'
            style={{
              width: '460px',
              height: '68.94px',
              left: '0px',
              top: '0px',
              background: '#261046',
              backdropFilter: 'blur(7.61834px)',
              borderRadius: '10.0272px',
              boxShadow: 'inset 0px 0px 11.2807px rgba(0, 0, 0, 0.16)',
              border: '1px solid rgba(164, 164, 164, 0.2)',
            }}
          />

          {/* Email Icon */}
          <div
            className='absolute'
            style={{
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
            }}
          >
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
            className='absolute border-none bg-transparent outline-none placeholder:text-[#A4A4A4] text-white w-full pr-4'
            style={{
              left: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'calc(100% - 70px)',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: '16.2943px',
              lineHeight: '24px',
              color: '#FFFFFF',
            }}
          />
        </div>

        {/* SignUp Button */}
        <button
          className='absolute cursor-pointer border-none'
          style={{
            width: '460px',
            height: '62.67px',
            left: '901px',
            top: '461.47px',
            background:
              'linear-gradient(90.04deg, #501794 0.03%, #3E70A1 101.88%)',
            borderRadius: '18.8011px',
          }}
          onClick={() => window.location.href = '/who-is-using'}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: '22.4588px',
              lineHeight: '34px',
              color: '#FFFFFF',
            }}
          >
            Sign in
          </span>
        </button>

        {/* Separator */}
        <div
          className='absolute'
          style={{
            width: '460px',
            height: '0px',
            left: '901px',
            top: '565.5px',
            border: '0.626703px solid #727272',
          }}
        />

        {/* Or continue with */}
        <div
          className='absolute'
          style={{
            width: '105px',
            height: '19px',
            left: '901px',
            top: '599.34px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '12.5341px',
            lineHeight: '19px',
            color: '#B6B6B6',
          }}
        >
          Or continue with
        </div>

        {/* Google Button */}
        <button
          className='absolute cursor-pointer border-none flex items-center justify-center gap-3 hover:opacity-90 transition-opacity'
          style={{
            width: '225.61px',
            height: '45.12px',
            left: '901px',
            top: '634.44px',
            background: '#3B2063',
            backdropFilter: 'blur(7.52372px)',
            borderRadius: '11.0975px',
          }}
          onClick={() => {
            // Simular autenticação Google - em produção seria NextAuth.js
            alert('Google authentication would be implemented here with NextAuth.js');
            setTimeout(() => window.location.href = '/who-is-using', 1000);
          }}
        >
          {/* Google Icon */}
          <div style={{ width: '18.8px', height: '19.98px' }}>
            <svg viewBox='0 0 24 24' className='h-full w-full'>
              <path
                fill='#FFC107'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#4CAF50'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#1976D2'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#FF3D00'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
          </div>

          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '15.0409px',
              lineHeight: '23px',
              color: '#FFFFFF',
            }}
          >
            Google
          </span>
        </button>

        {/* Facebook Button */}
        <button
          className='absolute cursor-pointer border-none flex items-center justify-center gap-3 hover:opacity-90 transition-opacity'
          style={{
            width: '225.61px',
            height: '45.12px',
            left: '1135.39px',
            top: '634.44px',
            background: '#3B2063',
            backdropFilter: 'blur(7.52372px)',
            borderRadius: '11.0975px',
          }}
          onClick={() => {
            // Simular autenticação Facebook - em produção seria NextAuth.js
            alert('Facebook authentication would be implemented here with NextAuth.js');
            setTimeout(() => window.location.href = '/who-is-using', 1000);
          }}
        >
          {/* Facebook Icon */}
          <div
            style={{
              width: '22.56px',
              height: '22.56px',
              background: '#0A66C2',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox='0 0 24 24'
              style={{
                width: '12px',
                height: '12px',
              }}
            >
              <path
                fill='#FFFFFF'
                d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z'
              />
            </svg>
          </div>

          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '15.0409px',
              lineHeight: '23px',
              color: '#FFFFFF',
            }}
          >
            Facebook
          </span>
        </button>

        {/* Terms */}
        <div
          className='absolute'
          style={{
            width: '310px',
            height: '19px',
            left: '901px',
            top: '702.12px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '12.5341px',
            lineHeight: '19px',
            color: '#B6B6B6',
          }}
        >
          By registering you with our Terms and Conditions
        </div>

        {/* Create New Account Button */}
        <button
          className='absolute cursor-pointer border-none hover:opacity-90 transition-opacity'
          style={{
            width: '460px',
            height: '45px',
            left: '901px',
            top: '740px',
            background: 'transparent',
            border: '2px solid #B6B6B6',
            borderRadius: '11px',
          }}
          onClick={() => window.location.href = '/signup'}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '16px',
              lineHeight: '24px',
              color: '#B6B6B6',
            }}
          >
            Create New Account
          </span>
        </button>
      </div>
    </div>
  )
}