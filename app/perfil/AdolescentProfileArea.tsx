'use client'

import { useEffect, useMemo, useState } from 'react'
import AchievementsGrid from './components/AchievementsGrid'
import QRCodeDialog from './components/QRCodeDialog'
import { FamilyManager } from '@/lib/familyManager'
import { TaskManager } from '@/lib/taskManager'

export default function AdolescentProfileArea({ user }: { user: { id: string; name: string } }) {
  const [bio, setBio] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [privacyShowRealName, setPrivacyShowRealName] = useState(true)
  const [progressVisibility, setProgressVisibility] = useState<'parents' | 'support'>('parents')
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const { points, tasks7, tasks30 } = useMemo(() => {
    const stats = TaskManager.getChildStats(user.id)
    return {
      points: stats.totalPoints,
      tasks7: stats.tasksCompleted7d,
      tasks30: stats.tasksCompleted30d,
    }
  }, [user.id])

  useEffect(() => {
    setBio(localStorage.getItem(`teen_bio_${user.id}`) || '')
    const saved = localStorage.getItem(`teen_tags_${user.id}`)
    setTags(saved ? JSON.parse(saved) : [])
    setPrivacyShowRealName(localStorage.getItem(`teen_priv_name_${user.id}`) !== 'false')
    setProgressVisibility((localStorage.getItem(`teen_priv_progress_${user.id}`) as any) || 'parents')
  }, [user.id])

  const saveBio = async () => {
    localStorage.setItem(`teen_bio_${user.id}`, bio)
    localStorage.setItem(`teen_tags_${user.id}`, JSON.stringify(tags))
    await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, bio, tags }) })
  }

  const savePrivacy = async () => {
    localStorage.setItem(`teen_priv_name_${user.id}`, String(privacyShowRealName))
    localStorage.setItem(`teen_priv_progress_${user.id}`, progressVisibility)
    await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, privacy: { privacyShowRealName, progressVisibility } }) })
  }

  const family = FamilyManager.getUserFamily(user.id)

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-4 sm:p-5">
        <h3 className="font-semibold mb-3">Bio e interesses</h3>
        <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={140} rows={3} className="w-full border rounded-md p-2 text-sm" placeholder="Conte algo sobre você (até 140 caracteres)" />
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {tags.map((t, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">#{t}</span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input type="text" placeholder="nova tag" className="border rounded-md px-2 py-1 text-sm" onKeyDown={e => {
            if (e.key === 'Enter') {
              const v = (e.target as HTMLInputElement).value.trim()
              if (v && !tags.includes(v)) setTags([...tags, v])
              ;(e.target as HTMLInputElement).value = ''
            }
          }} />
          <button onClick={saveBio} className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm">Salvar</button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold mb-3">Metas e rotinas</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p>Rotinas concluídas (7d): <span className="font-semibold">{tasks7}</span></p>
            <p>Rotinas concluídas (30d): <span className="font-semibold">{tasks30}</span></p>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-1.5 rounded-md border text-sm">Criar meta</button>
            <button className="px-3 py-1.5 rounded-md border text-sm">Ver calendário</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold mb-3">Conquistas e pontos</h3>
          <p className="text-sm text-gray-700">Saldo de pontos: <span className="font-semibold">{points}</span></p>
          <div className="mt-3">
            <AchievementsGrid points={points} />
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold mb-3">Privacidade</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={privacyShowRealName} onChange={e => setPrivacyShowRealName(e.target.checked)} /> Mostrar meu nome real</label>
            <div className="flex items-center gap-2">
              <span>Quem pode ver meu progresso:</span>
              <select value={progressVisibility} onChange={e => setProgressVisibility(e.target.value as any)} className="border rounded-md px-2 py-1">
                <option value="parents">Responsáveis</option>
                <option value="support">Suporte</option>
              </select>
            </div>
            <button onClick={savePrivacy} className="mt-2 px-3 py-1.5 rounded-md border text-sm">Salvar</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Responsáveis vinculados</h3>
            <button onClick={() => setShowLinkDialog(true)} className="px-3 py-1.5 rounded-md border text-sm">Solicitar novo vínculo</button>
          </div>
          {family ? (
            <div className="text-sm text-gray-700">
              <p>Responsável: <span className="font-semibold">{family.parentEmail}</span></p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Você ainda não está conectado a uma família.</p>
          )}
          <QRCodeDialog open={showLinkDialog} onOpenChange={setShowLinkDialog} mode="join" userId={user.id} />
        </div>
      </section>
    </div>
  )
}
