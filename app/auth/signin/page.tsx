'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const provider = searchParams.get('provider') || 'email'
  const emailFromUrl = searchParams.get('email') || ''
  
  const [step, setStep] = useState<'select-email' | 'create-password' | 'login'>('select-email')
  const [selectedEmail, setSelectedEmail] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<Array<{email: string, name: string, avatar: string, password?: string}>>([])
  const [loading, setLoading] = useState(false)

  // Carregar contas salvas do localStorage
  useEffect(() => {
    const accounts = localStorage.getItem('saved_accounts')
    if (accounts) {
      setSavedAccounts(JSON.parse(accounts))
    }
    
    // Se veio email da URL, usar automaticamente
    if (emailFromUrl) {
      handleEmailSelect(emailFromUrl)
    }
  }, [])

  // Apenas contas realmente salvas (sem emails fake)
  const availableEmails = savedAccounts

  const handleEmailSelect = async (email: string) => {
    setSelectedEmail(email)
    setLoading(true)
    
    try {
      // Verificar se existe no banco de dados
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', email }),
      })
      
      const data = await response.json()
      
      console.log('🔍 Verificação de usuário:', data)
      
      // Verificar também se tem senha no localStorage
      const passwords = JSON.parse(localStorage.getItem('user_passwords') || '{}')
      const hasPassword = passwords[email]
      
      if (data.exists && hasPassword) {
        // Se existe no banco E tem senha salva, vai para LOGIN
        console.log('✅ Usuário existe - Indo para LOGIN')
        setStep('login')
      } else {
        // Se não existe ou não tem senha, vai para CRIAR CONTA
        console.log('➕ Novo usuário - Indo para CRIAR SENHA')
        setStep('create-password')
      }
    } catch (error) {
      console.error('Error checking user:', error)
      // Em caso de erro, sempre cria nova conta
      setStep('create-password')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomEmail = async () => {
    if (customEmail) {
      await handleEmailSelect(customEmail)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedEmail && password) {
      setLoading(true)
      
      try {
        // Criar usuário no banco de dados
        const response = await fetch('/api/auth-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup',
            email: selectedEmail,
            password,
          }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Salvar hash da senha no localStorage
          const passwords = JSON.parse(localStorage.getItem('user_passwords') || '{}')
          passwords[selectedEmail] = result.passwordHash
          localStorage.setItem('user_passwords', JSON.stringify(passwords))
          
          // Adicionar à lista de contas salvas
          const newAccount = {
            email: selectedEmail,
            name: result.user?.name || selectedEmail.split('@')[0],
            avatar: '👤',
          }
          
          const updatedAccounts = [...savedAccounts, newAccount]
          localStorage.setItem('saved_accounts', JSON.stringify(updatedAccounts))
          localStorage.setItem('user_email', selectedEmail)
          localStorage.setItem('auth_provider', provider)
          
          // Redirecionar para who-is-using
          router.push('/who-is-using')
        } else {
          alert('Erro ao criar conta: ' + (result.error || 'Erro desconhecido'))
        }
      } catch (error) {
        console.error('Error signing up:', error)
        alert('Erro ao criar conta. Tente novamente.')
      } finally {
        setLoading(false)
      }
    } else {
      alert('Por favor, preencha todos os campos!')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Verificar senha usando a API (agora compara com o banco de dados)
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: selectedEmail,
          password,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Salvar no localStorage para manter a sessão
        localStorage.setItem('user_email', selectedEmail)
        localStorage.setItem('auth_provider', provider)
        
        // Redirecionar para who-is-using
        router.push('/who-is-using')
      } else {
        alert('Senha incorreta!')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      alert('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getProviderName = () => {
    switch (provider) {
      case 'google':
        return 'Google'
      case 'facebook':
        return 'Facebook'
      default:
        return 'Email'
    }
  }

  const getProviderIcon = () => {
    if (provider === 'google') {
      return (
        <svg viewBox='0 0 24 24' className='h-12 w-12'>
          <path fill='#FFC107' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
          <path fill='#4CAF50' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
          <path fill='#1976D2' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
          <path fill='#FF3D00' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
        </svg>
      )
    } else if (provider === 'facebook') {
      return (
        <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
          <svg viewBox='0 0 24 24' className='w-7 h-7 text-white'>
            <path fill='currentColor' d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z' />
          </svg>
        </div>
      )
    }
    return null
  }

  return (
    <div 
      className='min-h-screen w-full flex items-center justify-center p-4'
      style={{
        background: `
          linear-gradient(135deg, 
            #1B0337 0%,
            #2D1B69 50%,
            #1B0337 100%
          )
        `,
      }}
    >
      <div className='w-full max-w-md'>
        {/* Card Container */}
        <div
          className='rounded-2xl p-8 shadow-2xl'
          style={{
            background: 'rgba(37, 16, 69, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(164, 164, 164, 0.2)',
          }}
        >
          {/* Provider Icon/Name */}
          <div className='flex flex-col items-center mb-6'>
            {getProviderIcon()}
            <h2
              className='text-white font-bold text-2xl mt-4 mb-2'
              style={{ fontFamily: 'Poppins' }}
            >
              {step === 'select-email' 
                ? 'Escolha uma conta' 
                : step === 'create-password'
                ? 'Criar senha'
                : 'Bem-vindo de volta!'}
            </h2>
            <p
              className='text-white/70 text-sm text-center'
              style={{ fontFamily: 'Poppins' }}
            >
              {step === 'login' 
                ? 'Digite sua senha para continuar' 
                : `para continuar com ${getProviderName()}`}
            </p>
          </div>

          {/* Step 1: Select Email */}
          {step === 'select-email' && (
            <div className='space-y-3'>
              {/* Google-style header */}
              <div className='text-center mb-6'>
                <p
                  className='text-white text-base'
                  style={{ fontFamily: 'Poppins', fontWeight: '400' }}
                >
                  {savedAccounts.length > 0 ? 'Escolha uma conta' : 'Digite seu email'}
                </p>
                <p
                  className='text-white/60 text-sm mt-1'
                  style={{ fontFamily: 'Poppins' }}
                >
                  para continuar com OrganizeKids
                </p>
              </div>

              {/* Available Accounts - Google Style (somente se houver contas salvas) */}
              {savedAccounts.length > 0 && availableEmails.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleEmailSelect(account.email)}
                  className='w-full p-4 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-all border border-white/10 hover:border-white/30'
                  style={{
                    background: 'transparent',
                  }}
                >
                  {/* Avatar Circle */}
                  <div 
                    className='w-10 h-10 rounded-full flex items-center justify-center text-xl'
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {account.avatar}
                  </div>
                  <div className='flex-1 text-left'>
                    <p
                      className='text-white font-medium text-sm'
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {account.name}
                    </p>
                    <p
                      className='text-white/60 text-xs'
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {account.email}
                    </p>
                  </div>
                  {/* Chevron */}
                  <svg className='w-5 h-5 text-white/40' viewBox='0 0 24 24' fill='none'>
                    <path d='M9 18L15 12L9 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                </button>
              ))}

              {/* Use another account - Google Style (somente se houver contas salvas) */}
              {savedAccounts.length > 0 && (
                <button
                  onClick={() => {
                    const customEmailInput = document.getElementById('custom-email-input') as HTMLInputElement
                    if (customEmailInput) {
                      customEmailInput.focus()
                    }
                  }}
                  className='w-full p-4 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-all border border-white/10 hover:border-white/30'
                  style={{
                    background: 'transparent',
                  }}
                >
                  {/* Icon */}
                  <div 
                    className='w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30'
                    style={{
                      background: 'transparent',
                    }}
                  >
                    <svg className='w-5 h-5 text-white/70' viewBox='0 0 24 24' fill='none'>
                      <path d='M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 11L20 8M20 8L17 11M20 8V16M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
                    </svg>
                  </div>
                  <div className='flex-1 text-left'>
                    <p
                      className='text-white font-medium text-sm'
                      style={{ fontFamily: 'Poppins' }}
                    >
                      Usar outra conta
                    </p>
                  </div>
                </button>
              )}

              {/* Custom Email Input */}
              <div className={savedAccounts.length > 0 ? 'pt-2' : 'pt-4'}>
                {/* Label quando não há contas salvas */}
                {savedAccounts.length === 0 && (
                  <label
                    htmlFor='custom-email-input'
                    className='block text-white/80 text-sm mb-2'
                    style={{ fontFamily: 'Poppins' }}
                  >
                    Digite seu email
                  </label>
                )}
                <div className='flex gap-2'>
                  <div
                    className='flex-1 h-11 relative flex items-center'
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      border: '1px solid rgba(164, 164, 164, 0.2)',
                    }}
                  >
                    <input
                      id='custom-email-input'
                      type='email'
                      placeholder='Email ou telefone'
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomEmail()}
                      autoFocus={savedAccounts.length === 0}
                      className='px-4 w-full h-full bg-transparent border-none outline-none placeholder:text-[#A4A4A4] text-white text-sm'
                      style={{ fontFamily: 'Poppins' }}
                    />
                  </div>
                </div>
                {customEmail && (
                  <button
                    onClick={handleCustomEmail}
                    disabled={loading}
                    className='mt-3 px-6 h-9 rounded-md font-medium text-sm text-white hover:opacity-90 transition-opacity ml-auto block disabled:opacity-50 disabled:cursor-not-allowed'
                    style={{
                      background: '#1a73e8',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {loading ? 'Verificando...' : 'Avançar'}
                  </button>
                )}
              </div>

              {/* Footer links - Google style */}
              <div className='flex justify-between items-center pt-6 border-t border-white/10'>
                <button
                  className='text-white/60 text-xs hover:text-white transition-colors'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Política de Privacidade
                </button>
                <button
                  className='text-white/60 text-xs hover:text-white transition-colors'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Termos de Serviço
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => router.push('/')}
                className='w-full h-10 mt-2 cursor-pointer border border-white/30 rounded-lg hover:bg-white/10 transition-all font-medium text-white/70 text-sm bg-transparent'
                style={{ fontFamily: 'Poppins' }}
              >
                ← Voltar ao Login
              </button>
            </div>
          )}

          {/* Step 2: Create Password */}
          {step === 'create-password' && (
            <form onSubmit={handleSignUp} className='space-y-4'>
              {/* Email Display (read-only) */}
              <div>
                <label
                  className='text-white/80 text-sm mb-2 block'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Email
                </label>
                <div
                  className='w-full h-12 px-4 flex items-center rounded-xl'
                  style={{
                    background: 'rgba(37, 16, 69, 0.5)',
                    border: '1px solid rgba(164, 164, 164, 0.2)',
                  }}
                >
                  <p
                    className='text-white/90'
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {selectedEmail}
                  </p>
                </div>
              </div>

              {/* Password Input with Show/Hide */}
              <div>
                <label
                  className='text-white/80 text-sm mb-2 block'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Criar Senha
                </label>
                <div
                  className='w-full h-12 relative flex items-center'
                  style={{
                    background: 'rgba(37, 16, 69, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(164, 164, 164, 0.2)',
                  }}
                >
                  <div className='absolute left-4 w-5 h-5'>
                    <svg viewBox='0 0 24 24' fill='none' className='h-full w-full'>
                      <path
                        d='M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z'
                        stroke='#A4A4A4'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11'
                        stroke='#A4A4A4'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Digite sua senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-12 pr-12 w-full h-full bg-transparent border-none outline-none placeholder:text-[#A4A4A4] text-white'
                    style={{ fontFamily: 'Poppins' }}
                    required
                  />
                  {/* Show/Hide Password Button */}
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 text-white/60 hover:text-white transition-colors'
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M3 3L21 21M10.584 10.587C10.2087 10.9622 9.99778 11.4708 9.99756 12.0013C9.99734 12.5317 10.2078 13.0405 10.5828 13.416C10.9578 13.7915 11.4663 14.0025 11.9968 14.0027C12.5272 14.003 13.036 13.7925 13.4115 13.4175M17.357 17.349C15.726 18.449 13.942 19 12 19C7 19 2.73 15.73 1 12C2.01 9.52 3.66 7.41 5.64 5.64M9.88 9.88C10.2547 9.50528 10.763 9.29437 11.2935 9.29415C11.8239 9.29392 12.3325 9.50439 12.7075 9.87881C13.0825 10.2532 13.2935 10.7615 13.2937 11.292C13.294 11.8224 13.0835 12.331 12.709 12.706M9.88 9.88L12.709 12.706M9.88 9.88L6.88 6.88M12.709 12.706L15.709 15.706M15.709 15.706L17.357 17.349M15.709 15.706L19.709 19.706M6.88 6.88L3 3M6.88 6.88L9.88 9.88'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <circle
                          cx='12'
                          cy='12'
                          r='3'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full h-12 cursor-pointer border-none rounded-xl hover:opacity-90 transition-opacity font-medium text-white mt-6 disabled:opacity-50 disabled:cursor-not-allowed'
                style={{
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  fontFamily: 'Poppins',
                }}
              >
                {loading ? 'Criando conta...' : 'Sign Up'}
              </button>

              {/* Back to email selection */}
              <button
                type='button'
                onClick={() => setStep('select-email')}
                className='w-full h-10 mt-2 cursor-pointer border border-white/30 rounded-xl hover:bg-white/10 transition-all font-medium text-white/70 text-sm bg-transparent'
                style={{ fontFamily: 'Poppins' }}
              >
                Voltar e escolher outro email
              </button>
            </form>
          )}

          {/* Step 3: Login (existing account) */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className='space-y-4'>
              {/* Account info */}
              <div className='flex items-center gap-3 pb-4 border-b border-white/10'>
                <div 
                  className='w-12 h-12 rounded-full flex items-center justify-center text-2xl'
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {savedAccounts.find(acc => acc.email === selectedEmail)?.avatar || '👤'}
                </div>
                <div>
                  <p
                    className='text-white font-medium'
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {selectedEmail}
                  </p>
                  <p
                    className='text-white/60 text-sm'
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {savedAccounts.find(acc => acc.email === selectedEmail)?.name}
                  </p>
                </div>
              </div>

              {/* Welcome back message */}
              <div className='text-center py-2'>
                <h3
                  className='text-white font-semibold text-xl'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Bem-vindo de volta!
                </h3>
                <p
                  className='text-white/60 text-sm mt-1'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Digite sua senha para continuar
                </p>
              </div>

              {/* Password Input with Show/Hide */}
              <div>
                <label
                  className='text-white/80 text-sm mb-2 block'
                  style={{ fontFamily: 'Poppins' }}
                >
                  Senha
                </label>
                <div
                  className='w-full h-12 relative flex items-center'
                  style={{
                    background: 'rgba(37, 16, 69, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(164, 164, 164, 0.2)',
                  }}
                >
                  <div className='absolute left-4 w-5 h-5'>
                    <svg viewBox='0 0 24 24' fill='none' className='h-full w-full'>
                      <path
                        d='M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z'
                        stroke='#A4A4A4'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11'
                        stroke='#A4A4A4'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Digite sua senha'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-12 pr-12 w-full h-full bg-transparent border-none outline-none placeholder:text-[#A4A4A4] text-white'
                    style={{ fontFamily: 'Poppins' }}
                    required
                    autoFocus
                  />
                  {/* Show/Hide Password Button */}
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 text-white/60 hover:text-white transition-colors'
                  >
                    {showPassword ? (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M3 3L21 21M10.584 10.587C10.2087 10.9622 9.99778 11.4708 9.99756 12.0013C9.99734 12.5317 10.2078 13.0405 10.5828 13.416C10.9578 13.7915 11.4663 14.0025 11.9968 14.0027C12.5272 14.003 13.036 13.7925 13.4115 13.4175M17.357 17.349C15.726 18.449 13.942 19 12 19C7 19 2.73 15.73 1 12C2.01 9.52 3.66 7.41 5.64 5.64M9.88 9.88C10.2547 9.50528 10.763 9.29437 11.2935 9.29415C11.8239 9.29392 12.3325 9.50439 12.7075 9.87881C13.0825 10.2532 13.2935 10.7615 13.2937 11.292C13.294 11.8224 13.0835 12.331 12.709 12.706M9.88 9.88L12.709 12.706M9.88 9.88L6.88 6.88M12.709 12.706L15.709 15.706M15.709 15.706L17.357 17.349M15.709 15.706L19.709 19.706M6.88 6.88L3 3M6.88 6.88L9.88 9.88'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <circle
                          cx='12'
                          cy='12'
                          r='3'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className='text-right'>
                <button
                  type='button'
                  className='text-blue-400 text-sm hover:text-blue-300 transition-colors'
                  style={{ fontFamily: 'Poppins' }}
                  onClick={() => alert('Recurso de recuperação de senha em desenvolvimento')}
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full h-12 cursor-pointer border-none rounded-xl hover:opacity-90 transition-opacity font-medium text-white mt-6 disabled:opacity-50 disabled:cursor-not-allowed'
                style={{
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                  fontFamily: 'Poppins',
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              {/* Back to email selection */}
              <button
                type='button'
                onClick={() => setStep('select-email')}
                className='w-full h-10 mt-2 cursor-pointer border border-white/30 rounded-xl hover:bg-white/10 transition-all font-medium text-white/70 text-sm bg-transparent'
                style={{ fontFamily: 'Poppins' }}
              >
                Usar outra conta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
