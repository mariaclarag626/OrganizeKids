'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileLayout from './ProfileLayout'
import AdolescentProfileArea from './AdolescentProfileArea'
import ParentProfileArea from './ParentProfileArea'
import ChildProfileArea from './ChildProfileArea'
import { LocalAuthManager } from '@/lib/localAuth'

type Role = 'teenager' | 'parent' | 'kid'

export default function PerfilPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [user, setUser] = useState<{ id: string; name: string; email: string; createdAt: string; role: Role } | null>(null)

  useEffect(() => {
    const current = LocalAuthManager.getCurrentUser()
    if (!current) {
      router.push('/login')
      return
    }
    setRole(current.role)
    setUser({ id: current.id, name: current.name, email: current.email, createdAt: current.createdAt, role: current.role })
  }, [router])

  if (!role || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Carregando perfil...
      </div>
    )
  }

  return (
    <ProfileLayout user={user}>
      {role === 'teenager' && <AdolescentProfileArea user={user} />}
      {role === 'parent' && <ParentProfileArea user={user} />}
      {role === 'kid' && <ChildProfileArea user={user} />}
    </ProfileLayout>
  )
}
