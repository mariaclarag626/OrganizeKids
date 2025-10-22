'use client'

import { useMemo, useState } from 'react'
import TaskList from './components/TaskList'
import AchievementsGrid from './components/AchievementsGrid'
import { FamilyManager } from '@/lib/familyManager'
import { TaskManager } from '@/lib/taskManager'

export default function ChildProfileArea({ user }: { user: { id: string; name: string } }) {
  const [soundOn, setSoundOn] = useState(true)

  const tasks = useMemo(() => TaskManager.getChildTasks(user.id, { status: 'pending' }), [user.id])
  const parentEmail = FamilyManager.getUserFamily(user.id)?.parentEmail
  const points = TaskManager.getChildPoints(user.id)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-3">Meu dia</h3>
        <TaskList userId={user.id} tasks={tasks} compact={false} largeButtons />
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-3">Conquistas</h3>
        <AchievementsGrid points={points} big />
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-3">Conta (somente leitura)</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>Nome: <span className="font-semibold">{user.name}</span></p>
          <p>E-mail do responsável: <span className="font-semibold">{parentEmail || '—'}</span></p>
          <p className="text-gray-500">Se precisar de ajuda, chame seu responsável.</p>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={soundOn} onChange={e => setSoundOn(e.target.checked)} /> Sons do app</label>
        </div>
      </section>
    </div>
  )
}
