'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearDataPage() {
  const router = useRouter()
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const clearAllData = async () => {
    setLoading(true)
    setStatus('🗑️ Limpando dados...')
    
    try {
      // Limpar localStorage
      localStorage.clear()
      setStatus('✅ localStorage limpo!')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Limpar do banco de dados
      setStatus('🗑️ Limpando banco de dados...')
      const response = await fetch('/api/auth-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'delete-all',
          email: 'maria.calvarenga@geoportal.org'
        }),
      })
      
      if (response.ok) {
        setStatus('✅ TUDO LIMPO! Você pode testar do zero agora!')
      } else {
        setStatus('⚠️ localStorage limpo, mas erro no banco. Você pode testar mesmo assim.')
      }
    } catch (error) {
      setStatus('⚠️ localStorage limpo! Você pode testar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className='min-h-screen w-full flex items-center justify-center p-4'
      style={{
        background: `linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)`,
      }}
    >
      <div className='w-full max-w-md'>
        <div
          className='rounded-2xl p-8 shadow-2xl text-center'
          style={{
            background: 'rgba(37, 16, 69, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(164, 164, 164, 0.2)',
          }}
        >
          <h1 
            className='text-white font-bold text-3xl mb-4'
            style={{ fontFamily: 'Poppins' }}
          >
            🗑️ Limpar Dados
          </h1>
          
          <p 
            className='text-white/70 mb-8'
            style={{ fontFamily: 'Poppins' }}
          >
            Isso vai limpar todos os dados salvos (localStorage e banco de dados)
          </p>

          {status && (
            <div 
              className='mb-6 p-4 rounded-lg'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <p 
                className='text-white text-sm'
                style={{ fontFamily: 'Poppins' }}
              >
                {status}
              </p>
            </div>
          )}

          <button
            onClick={clearAllData}
            disabled={loading}
            className='w-full h-12 rounded-lg font-bold text-white mb-4 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity'
            style={{
              background: 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)',
              fontFamily: 'Poppins',
            }}
          >
            {loading ? 'Limpando...' : '🗑️ Limpar Tudo'}
          </button>

          <button
            onClick={() => router.push('/')}
            className='w-full h-12 rounded-lg font-medium text-white/70 hover:text-white transition-colors'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontFamily: 'Poppins',
            }}
          >
            ← Voltar
          </button>

          {status.includes('TUDO LIMPO') && (
            <button
              onClick={() => router.push('/auth/signin?provider=google')}
              className='w-full h-12 rounded-lg font-bold text-white mt-4 hover:opacity-90 transition-opacity'
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'Poppins',
              }}
            >
              ✅ Ir para Login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
