export default function HomePage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#160430]'>
      {/* Background Image */}
      <div
        className='absolute left-[-89px] top-0 h-[938px] w-[932px] scale-x-[-1] transform'
        style={{
          background:
            'linear-gradient(89.12deg, #160430 0.47%, rgba(22, 4, 48, 0) 22.87%), url(/space-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Stars and cosmic elements overlay */}
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='absolute h-2 w-2 animate-pulse rounded-full bg-white opacity-80'
          style={{ left: '10%', top: '20%' }}
        />
        <div
          className='absolute h-1 w-1 animate-pulse rounded-full bg-white opacity-60'
          style={{ left: '20%', top: '40%' }}
        />
        <div
          className='absolute h-3 w-3 animate-pulse rounded-full bg-white opacity-90'
          style={{ left: '80%', top: '30%' }}
        />
        <div
          className='absolute h-1 w-1 animate-pulse rounded-full bg-white opacity-70'
          style={{ left: '90%', top: '60%' }}
        />
        <div
          className='absolute h-2 w-2 animate-pulse rounded-full bg-white opacity-75'
          style={{ left: '15%', top: '70%' }}
        />
        <div
          className='absolute h-1 w-1 animate-pulse rounded-full bg-white opacity-50'
          style={{ left: '85%', top: '80%' }}
        />
      </div>

      {/* Bottom fade */}
      <div
        className='absolute left-[27px] top-[776px] h-[134px] w-[1445px] rotate-180 transform'
        style={{
          background:
            'linear-gradient(180deg, #160430 0%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      {/* Main Content */}
      <div className='relative z-10 flex min-h-screen'>
        {/* Left Side - Title */}
        <div className='flex flex-1 items-end pb-32 pl-16'>
          <h1 className="max-w-[617px] font-['Poppins'] text-[50.6825px] font-bold uppercase leading-[51px] text-white">
            SIGN IN TO HAVE YOUR GOALS ACHIEVED DAILY!
          </h1>
        </div>

        {/* Right Side - Sign In Form */}
        <div className='flex w-[500px] flex-col justify-center px-8'>
          {/* Title */}
          <h2 className="mb-4 font-['Poppins'] text-[77.7112px] font-bold leading-[117px] text-white">
            SIGN IN
          </h2>

          {/* Subtitle */}
          <p className="mb-8 font-['Poppins'] text-[15.0409px] font-bold leading-[23px] text-white">
            Sign in with email address
          </p>

          {/* Email Input */}
          <div className='mb-6'>
            <div className='relative h-[68.94px] w-full'>
              <input
                type='email'
                placeholder='Yourname@gmail.com'
                className="h-full w-full rounded-[10.0272px] bg-[#261046] px-6 font-['Poppins'] text-[16.2943px] font-medium leading-[24px] text-[#A4A4A4] backdrop-blur-[7.61834px] placeholder:text-[#A4A4A4]"
                style={{
                  boxShadow: 'inset 0px 0px 11.2807px rgba(0, 0, 0, 0.16)',
                }}
              />
              <div className='absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2'>
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
            </div>
          </div>

          {/* Sign Up Button */}
          <button className="mb-8 h-[62.67px] w-full rounded-[18.8011px] bg-gradient-to-r from-[#501794] to-[#3E70A1] font-['Poppins'] text-[22.4588px] font-medium leading-[34px] text-white">
            Sign up
          </button>

          {/* Separator */}
          <div className='mb-6 h-px w-full border-t border-[#727272]' />

          {/* Or continue with */}
          <p className="mb-6 font-['Poppins'] text-[12.5341px] font-semibold leading-[19px] text-[#B6B6B6]">
            Or continue with
          </p>

          {/* OAuth Buttons */}
          <div className='mb-6 flex gap-4'>
            {/* Google Button */}
            <button className='flex h-[45.12px] w-[225.61px] items-center justify-center gap-3 rounded-[11.0975px] bg-[#3B2063] backdrop-blur-[7.52372px]'>
              <div className='flex h-[18.8px] w-[18.8px] items-center justify-center'>
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
              <span className="font-['Poppins'] text-[15.0409px] font-semibold leading-[23px] text-white">
                Google
              </span>
            </button>

            {/* Facebook Button */}
            <button className='flex h-[45.12px] w-[225.61px] items-center justify-center gap-3 rounded-[11.0975px] bg-[#3B2063] backdrop-blur-[7.52372px]'>
              <div className='flex h-[22.56px] w-[22.56px] items-center justify-center rounded-full bg-[#0A66C2]'>
                <svg viewBox='0 0 24 24' className='h-[14.23px] w-[7.39px]'>
                  <path
                    fill='#FFFFFF'
                    d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
                  />
                </svg>
              </div>
              <span className="font-['Poppins'] text-[15.0409px] font-semibold leading-[23px] text-white">
                Facebook
              </span>
            </button>
          </div>

          {/* Terms */}
          <p className="font-['Poppins'] text-[12.5341px] font-medium leading-[19px] text-[#B6B6B6]">
            By registering you with our Terms and Conditions
          </p>
        </div>
      </div>
    </div>
  )
}
