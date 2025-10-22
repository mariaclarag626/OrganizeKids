'use client'

import { useEffect, useState } from 'react'

export default function ParentalControlsPanel({ parentId }: { parentId: string }) {
  const [chatEnabled, setChatEnabled] = useState(true)
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [usageHours, setUsageHours] = useState('08:00 - 20:00')

  useEffect(() => {
    setChatEnabled(localStorage.getItem(`ctl_chat_${parentId}`) !== 'false')
    setTimerEnabled(localStorage.getItem(`ctl_timer_${parentId}`) !== 'false')
    setUsageHours(localStorage.getItem(`ctl_hours_${parentId}`) || '08:00 - 20:00')
  }, [parentId])

  const save = async () => {
    localStorage.setItem(`ctl_chat_${parentId}`, String(chatEnabled))
    localStorage.setItem(`ctl_timer_${parentId}`, String(timerEnabled))
    localStorage.setItem(`ctl_hours_${parentId}`, usageHours)
    await fetch('/api/children', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'controls:update', chatEnabled, timerEnabled, usageHours }) })
  }

  return (
    <div className="space-y-3 text-sm">
      <label className="flex items-center gap-2"><input type="checkbox" checked={chatEnabled} onChange={e => setChatEnabled(e.target.checked)} /> Chat habilitado</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} /> Timer/pomodoro habilitado</label>
      <div className="flex items-center gap-2">
        <span>Horários de uso:</span>
        <input value={usageHours} onChange={e => setUsageHours(e.target.value)} className="border rounded-md px-2 py-1" />
      </div>
      <button onClick={save} className="px-3 py-1.5 rounded-md border">Salvar</button>
    </div>
  )
}
