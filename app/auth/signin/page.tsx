'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Chrome, Facebook, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignUp = async () => {
    setIsLoading(true)
    // This would handle magic link or regular email signup
    // For now, we'll just show the email input as per the design
    console.log('Email signup:', email)
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
    setIsLoading(false)
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(true)
    await signIn('facebook', { callbackUrl: '/dashboard' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden space-background">
      {/* Animated background elements */}
      <div className="planet planet-large"></div>
      <div className="planet planet-medium"></div>
      <div className="planet planet-small"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star" style={{ top: '20%', animationDelay: '0s' }}></div>
      <div className="shooting-star" style={{ top: '40%', animationDelay: '2s' }}></div>
      <div className="shooting-star" style={{ top: '60%', animationDelay: '4s' }}></div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Welcome message */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              SIGN IN TO HAVE YOUR
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                GOALS ACHIEVED DAILY!
              </span>
            </h1>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <Card className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl">
            <CardHeader className="text-center pb-2">
              <h2 className="text-4xl font-bold mb-2">SIGN IN</h2>
              <p className="text-white/80 text-sm">Sign in with email address</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Email input */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                <Input
                  type="email"
                  placeholder="Yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                />
              </div>

              {/* Sign up button */}
              <Button
                onClick={handleEmailSignUp}
                disabled={isLoading || !email}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl"
              >
                Sign up
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/60">Or continue with</span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="glass"
                  className="w-full h-12 justify-center gap-3 rounded-xl"
                >
                  <Chrome className="h-5 w-5" />
                  Google
                </Button>
                
                <Button
                  onClick={handleFacebookSignIn}
                  disabled={isLoading}
                  variant="glass"
                  className="w-full h-12 justify-center gap-3 rounded-xl"
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Button>
              </div>

              {/* Terms */}
              <div className="text-center">
                <p className="text-xs text-white/60">
                  By registering you with our{' '}
                  <a href="#" className="text-blue-400 hover:underline">
                    Terms and Conditions
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Mobile welcome message */}
      <div className="lg:hidden absolute bottom-8 left-6 right-6 text-center">
        <h1 className="text-2xl font-bold text-white leading-tight">
          SIGN IN TO HAVE YOUR
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            GOALS ACHIEVED DAILY!
          </span>
        </h1>
      </div>
    </div>
  )
}