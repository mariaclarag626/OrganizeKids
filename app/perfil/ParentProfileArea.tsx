'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import ParentalControlsPanel from './components/ParentalControlsPanel'
import QRCodeDialog from './components/QRCodeDialog'
import { FamilyManager } from '@/lib/familyManager'
import { LocalAuthManager } from '@/lib/localAuth'
import { TaskManager } from '@/lib/taskManager'

interface Child {
  id: string
  name: string
  avatar?: string
  role: 'teenager' | 'kid'
  tasksCompleted: number
  totalPoints: number
}

export default function ParentProfileArea({ user }: { user: { id: string; name: string } }) {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [showCode, setShowCode] = useState(false)

  const family = FamilyManager.getUserFamily(user.id) || FamilyManager.createFamily(user.id, LocalAuthManager.getCurrentUser()!.email, user.name)

  useEffect(() => {
    const members = FamilyManager.getChildren(user.id)
    const mapped = members.map(m => {
      const stats = TaskManager.getChildStats(m.id)
      return {
        id: m.id,
        name: m.name,
        role: m.role as 'teenager' | 'kid',
        avatar: m.avatar,
        tasksCompleted: stats.tasksCompleted,
        totalPoints: stats.totalPoints,
      }
    })
    setChildren(mapped)
  }, [user.id])

  const familyTasks = useMemo(() => TaskManager.getFamilyTasks(family.id), [family.id])

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Minhas crianças vinculadas</h3>
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setShowCode(true)}>Adicionar criança</button>
        </div>
        {children.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma criança vinculada ainda.</p>
        ) : (
          <ul className="divide-y">
            {children.map(c => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name} <span className="ml-2 text-xs text-gray-500">{c.role === 'teenager' ? 'Adolescente' : 'Criança'}</span></div>
                  <div className="text-xs text-gray-500">Tarefas concluídas: {c.tasksCompleted} • Pontos: {c.totalPoints}</div>
                </div>
                <button onClick={() => router.push(`/dashboard/${c.role === 'teenager' ? 'teenagers' : 'kids'}`)} className="text-sm px-3 py-1.5 rounded-md border">Ver painel</button>
              </li>
            ))}
          </ul>
        )}
        <QRCodeDialog open={showCode} onOpenChange={setShowCode} mode="show" parentId={user.id} />
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-3">Painel de progresso</h3>
        <div className="text-sm text-gray-700 flex gap-6 flex-wrap">
          <div>Total de tarefas: <span className="font-semibold">{familyTasks.length}</span></div>
          <div>Pendentes: <span className="font-semibold">{familyTasks.filter(t => t.status === 'pending').length}</span></div>
          <div>Para aprovar: <span className="font-semibold">{familyTasks.filter(t => t.status === 'completed').length}</span></div>
          <div>Aprovadas: <span className="font-semibold">{familyTasks.filter(t => t.status === 'approved').length}</span></div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="font-semibold mb-3">Controles parentais</h3>
        <ParentalControlsPanel parentId={user.id} />
      </section>
    </div>
  )
}
