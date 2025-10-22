'use client'

import { useEffect, useState } from 'react'

export default function PreferencesCard({ userId }: { userId: string }) {
  const [theme, setTheme] = useState('auto')
  const [language, setLanguage] = useState('pt')
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    setTheme(localStorage.getItem(`pref_theme_${userId}`) || 'auto')
    setLanguage(localStorage.getItem(`pref_lang_${userId}`) || 'pt')
    setNotifications(localStorage.getItem(`pref_notif_${userId}`) !== 'false')
  }, [userId])

  const save = async () => {
    localStorage.setItem(`pref_theme_${userId}`, theme)
    localStorage.setItem(`pref_lang_${userId}`, language)
    localStorage.setItem(`pref_notif_${userId}`, String(notifications))
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, preferences: { theme, language, notifications } }),
    })
  }

  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Preferências</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <label className="text-gray-600">Tema</label>
          <select value={theme} onChange={e => setTheme(e.target.value)} className="border rounded-md px-2 py-1">
            <option value="auto">Automático</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="text-gray-600">Idioma</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded-md px-2 py-1">
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="text-gray-600">Notificações</label>
          <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
        </div>
        <div className="pt-1">
          <button onClick={save} className="w-full py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Salvar preferências</button>
        </div>
      </div>
    </div>
  )
}
