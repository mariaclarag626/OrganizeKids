export default function HomePage() {
  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: '1429px',
        height: '928.09px',
        background: '#160430'
      }}
    >
      {/* Background */}
      <div
        className="absolute"
        style={{
          width: '1561px',
          height: '938px',
          left: '-89px',
          top: '0px'
        }}
      />

      {/* Background Image */}
      <div
        className="absolute"
        style={{
          width: '932px',
          height: '938px',
          left: '-89px',
          top: '0px',
          background: 'linear-gradient(89.12deg, #160430 0.47%, rgba(22, 4, 48, 0) 22.87%), url(/space-background.jpg)',
          transform: 'matrix(-1, 0, 0, 1, 0, 0)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Fade */}
      <div
        className="absolute"
        style={{
          width: '1445px',
          height: '134px',
          left: '27px',
          top: '776px',
          background: 'linear-gradient(180deg, #160430 0%, rgba(0, 0, 0, 0) 100%)',
          transform: 'rotate(-180deg)'
        }}
      />

      {/* Title - Bottom Left */}
      <div
        className="absolute"
        style={{
          width: '617px',
          height: '155px',
          left: '62px',
          top: '775px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '700',
          fontSize: '50.6825px',
          lineHeight: '51px',
          textTransform: 'uppercase',
          color: '#FFFFFF'
        }}
      >
        SIGN IN TO HAVE YOUR GOALS ACHIEVED DAILY!
      </div>

      {/* Title - SIGN IN */}
      <div
        className="absolute"
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
          color: '#FFFFFF'
        }}
      >
        SIGN IN
      </div>

      {/* SubTitle */}
      <div
        className="absolute"
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
          color: '#FFFFFF'
        }}
      >
        Sign in with email address
      </div>

      {/* Email Input */}
      <div
        className="absolute"
        style={{
          width: '460px',
          height: '68.94px',
          left: '901px',
          top: '369.97px'
        }}
      >
        {/* Input Background */}
        <div
          className="absolute"
          style={{
            width: '460px',
            height: '68.94px',
            left: '0px',
            top: '0px',
            background: '#261046',
            backdropFilter: 'blur(7.61834px)',
            borderRadius: '10.0272px',
            boxShadow: 'inset 0px 0px 11.2807px rgba(0, 0, 0, 0.16)'
          }}
        />
        
        {/* Input Text */}
        <input
          type="email"
          placeholder="Yourname@gmail.com"
          className="absolute border-none bg-transparent outline-none placeholder:text-[#A4A4A4]"
          style={{
            width: '246.11px',
            height: '24px',
            left: '58.91px',
            top: '21.31px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '16.2943px',
            lineHeight: '24px',
            color: '#A4A4A4'
          }}
        />

        {/* Email Icon */}
        <div
          className="absolute"
          style={{
            left: '64.63%',
            right: '33.62%',
            top: '42.56%',
            bottom: '55.41%',
            background: '#A4A4A4'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path
              d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
              stroke="#A4A4A4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="22,6 12,13 2,6"
              stroke="#A4A4A4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* SignUp Button */}
      <button
        className="absolute border-none cursor-pointer"
        style={{
          width: '460px',
          height: '62.67px',
          left: '901px',
          top: '461.47px',
          background: 'linear-gradient(90.04deg, #501794 0.03%, #3E70A1 101.88%)',
          borderRadius: '18.8011px'
        }}
      >
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '22.4588px',
            lineHeight: '34px',
            color: '#FFFFFF'
          }}
        >
          Sign up
        </span>
      </button>

      {/* Separator */}
      <div
        className="absolute"
        style={{
          width: '460px',
          height: '0px',
          left: '901px',
          top: '565.5px',
          border: '0.626703px solid #727272'
        }}
      />

      {/* Or continue with */}
      <div
        className="absolute"
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
          color: '#B6B6B6'
        }}
      >
        Or continue with
      </div>

      {/* Google Button */}
      <button
        className="absolute border-none cursor-pointer"
        style={{
          width: '225.61px',
          height: '45.12px',
          left: '901px',
          top: '634.44px',
          background: '#3B2063',
          backdropFilter: 'blur(7.52372px)',
          borderRadius: '11.0975px'
        }}
      >
        <div
          className="flex items-center justify-center gap-3"
          style={{
            width: '103.78px',
            height: '19.88px',
            margin: '0 auto',
            marginTop: '12.62px'
          }}
        >
          {/* Google Icon */}
          <div style={{ width: '18.8px', height: '19.98px' }}>
            <svg viewBox="0 0 24 24" className="h-full w-full">
              <path
                fill="#FFC107"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#4CAF50"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#1976D2"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#FF3D00"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          
          <span
            style={{
              width: '55px',
              height: '23px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '15.0409px',
              lineHeight: '23px',
              color: '#FFFFFF'
            }}
          >
            Google
          </span>
        </div>
      </button>

      {/* Facebook Button */}
      <button
        className="absolute border-none cursor-pointer"
        style={{
          width: '225.61px',
          height: '45.12px',
          left: '1135.39px',
          top: '634.44px',
          background: '#3B2063',
          backdropFilter: 'blur(7.52372px)',
          borderRadius: '11.0975px'
        }}
      >
        <div
          className="flex items-center justify-center gap-3"
          style={{
            width: '107.79px',
            height: '22.56px',
            margin: '0 auto',
            marginTop: '11.28px'
          }}
        >
          {/* Facebook Icon */}
          <div
            style={{
              width: '22.56px',
              height: '22.56px',
              background: '#0A66C2',
              borderRadius: '50%',
              position: 'relative'
            }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{
                width: '7.39px',
                height: '14.23px',
                position: 'absolute',
                left: '7.74px',
                top: '4.51px'
              }}
            >
              <path
                fill="#FFFFFF"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </div>
          
          <span
            style={{
              width: '75.2px',
              height: '18.46px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: '15.0409px',
              lineHeight: '23px',
              color: '#FFFFFF'
            }}
          >
            Facebook
          </span>
        </div>
      </button>

      {/* Terms */}
      <div
        className="absolute"
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
          color: '#B6B6B6'
        }}
      >
        By registering you with our Terms and Conditions
      </div>
    </div>
  )
}
