'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { LocalAuthManager, LocalUser } from './localAuth'

export function useSyncAuth() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Sincronizar usuário do Google/Facebook com localStorage
      const userData: LocalUser = {
        id: session.user.id || Date.now().toString(),
        email: session.user.email || '',
        name: session.user.name || '',
        password: '', // OAuth não usa senha
        role: 'parent', // default para OAuth
        createdAt: new Date().toISOString(),
      }

      // Verificar se já existe
      const users = LocalAuthManager.getAllUsers()
      const existingUserIndex = users.findIndex(u => u.email === userData.email)

      if (existingUserIndex >= 0) {
        // Atualizar usuário existente (mantém o role se já escolheu)
        const existingUser = users[existingUserIndex]
        users[existingUserIndex] = { ...existingUser, ...userData, role: existingUser.role }
        localStorage.setItem('organizekids_users', JSON.stringify(users))
        LocalAuthManager.setCurrentUser(users[existingUserIndex])
      } else {
        // Adicionar novo usuário
        users.push(userData)
        localStorage.setItem('organizekids_users', JSON.stringify(users))
        LocalAuthManager.setCurrentUser(userData)
      }
    }
  }, [session, status])

  return { session, status }
}
