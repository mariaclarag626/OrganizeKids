'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('userType')

  useEffect(() => {
    // Redireciona para o dashboard específico baseado no userType
    if (userType === 'parents') {
      router.push('/dashboard/parents')
    } else if (userType === 'teenagers') {
      router.push('/dashboard/teenagers')
    } else if (userType === 'kids') {
      router.push('/dashboard/kids')
    } else {
      // Se não tiver userType, volta para home
      router.push('/')
    }
  }, [userType, router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #1B0337 0%, #2D1B69 50%, #1B0337 100%)'
    }}>
      <div className="text-white text-xl" style={{ fontFamily: 'Poppins' }}>
        Loading...
      </div>
    </div>
  )
}
