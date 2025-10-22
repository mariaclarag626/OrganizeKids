'use client'

import ProfileHeader from './ProfileHeader'
import AccountCard from './AccountCard'
import PreferencesCard from './PreferencesCard'

type Role = 'teenager' | 'parent' | 'kid'

export default function ProfileLayout({
  user,
  children,
}: {
  user: { id: string; name: string; email: string; createdAt: string; role: Role }
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <ProfileHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <AccountCard user={user} />
          <PreferencesCard userId={user.id} />
        </div>

        <div className="lg:col-span-2">
          {children}
        </div>
      </div>
    </div>
  )
}
