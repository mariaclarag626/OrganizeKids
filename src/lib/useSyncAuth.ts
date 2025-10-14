'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { LocalAuthManager } from './localAuth'

export function useSyncAuth() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Sincronizar usuário do Google/Facebook com localStorage
      const userData = {
        id: session.user.id || Date.now().toString(),
        email: session.user.email || '',
        name: session.user.name || '',
        password: '', // OAuth não usa senha
        role: 'parent', // default para OAuth
        createdAt: new Date().toISOString(),
      }

      // Verificar se já existe
      const users = JSON.parse(localStorage.getItem('organizekids_users') || '[]')
      const existingUserIndex = users.findIndex((u: any) => u.email === userData.email)

      if (existingUserIndex >= 0) {
        // Atualizar usuário existente
        users[existingUserIndex] = { ...users[existingUserIndex], ...userData }
      } else {
        // Adicionar novo usuário
        users.push(userData)
      }

      localStorage.setItem('organizekids_users', JSON.stringify(users))
      localStorage.setItem('organizekids_current_user', JSON.stringify(userData))
    }
  }, [session, status])

  return { session, status }
}
