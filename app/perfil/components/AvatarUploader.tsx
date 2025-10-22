'use client'

import { useEffect, useState } from 'react'

export default function AvatarUploader({ userId, size = 48 }: { userId: string; size?: number }) {
  const [avatar, setAvatar] = useState<string>('')
  useEffect(() => {
    setAvatar(localStorage.getItem(`avatar_${userId}`) || '')
  }, [userId])

  const save = (value: string) => {
    setAvatar(value)
    localStorage.setItem(`avatar_${userId}`, value)
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full bg-gray-100 grid place-items-center text-2xl"
        style={{ width: size, height: size }}
        aria-label="Avatar"
      >
        {avatar || '👤'}
      </div>
      <input
        className="border rounded-md px-2 py-1 text-sm"
        placeholder="Digite um emoji (😀)"
        value={avatar}
        onChange={e => save(e.target.value)}
        maxLength={2}
      />
    </div>
  )
}
