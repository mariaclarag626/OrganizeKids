'use client'

import { useState } from 'react'
import AvatarUploader from './components/AvatarUploader'
import EditableField from './components/EditableField'
import { LocalAuthManager } from '@/lib/localAuth'

type Role = 'teenager' | 'parent' | 'kid'

export default function ProfileHeader({ user }: { user: { id: string; name: string; email: string; role: Role } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user.name)

  const saveProfile = async () => {
    // Optimistic update to local storage
    const u = LocalAuthManager.getCurrentUser()
    if (u) {
      // update local user name
      const users = LocalAuthManager.getAllUsers()
      const idx = users.findIndex(x => x.id === u.id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: displayName }
        // @ts-ignore access internal save for local demo persistence
        ;(LocalAuthManager as any).saveUsers(users)
        LocalAuthManager.setCurrentUser(users[idx])
      }
    }
    // Call API for acceptance criteria
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, name: displayName }),
    })
    setIsEditing(false)
  }

  const roleBadge = {
    parent: { label: 'Responsável', color: 'bg-blue-100 text-blue-700' },
    teenager: { label: 'Adolescente', color: 'bg-purple-100 text-purple-700' },
    kid: { label: 'Criança', color: 'bg-emerald-100 text-emerald-700' },
  }[user.role]

  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <AvatarUploader userId={user.id} size={64} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {isEditing ? (
              <EditableField value={displayName} onChange={setDisplayName} />
            ) : (
              <h1 className="text-xl sm:text-2xl font-semibold truncate">{displayName}</h1>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge.color}`}>{roleBadge.label}</span>
          </div>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button onClick={saveProfile} className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">Salvar</button>
              <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-md border text-sm">Cancelar</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50">Editar Perfil</button>
          )}
        </div>
      </div>
    </div>
  )
}
