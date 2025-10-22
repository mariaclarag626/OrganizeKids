'use client'

import { useEffect, useState } from 'react'
import { FamilyManager } from '@/lib/familyManager'
import { LocalAuthManager } from '@/lib/localAuth'

export default function QRCodeDialog({
  open,
  onOpenChange,
  mode,
  parentId,
  userId,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: 'show' | 'join'
  parentId?: string
  userId?: string
}) {
  const [code, setCode] = useState('')
  const [expires, setExpires] = useState<Date | null>(null)
  const [input, setInput] = useState('')
  const current = LocalAuthManager.getCurrentUser()

  useEffect(() => {
    if (!open) return
    if (mode === 'show' && parentId) {
      const fam = FamilyManager.getUserFamily(parentId) || FamilyManager.createFamily(parentId, current!.email, current!.name)
      setCode(fam.code)
      setExpires(new Date(fam.codeExpires))
    }
  }, [open, mode, parentId, current])

  const join = async () => {
    if (!userId || !current) return
    const res = FamilyManager.joinFamily(input.trim().toUpperCase(), userId, current.email, current.name, current.role as 'teenager' | 'kid')
    await fetch('/api/children', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'join', code: input }) })
    if (res.success) onOpenChange(false)
    else alert(res.message)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{mode === 'show' ? 'Convite para adicionar criança' : 'Entrar em uma família'}</h4>
          <button className="text-sm" onClick={() => onOpenChange(false)}>Fechar</button>
        </div>
        {mode === 'show' ? (
          <div className="space-y-2 text-sm">
            <p>Compartilhe este código com a criança/adolescente:</p>
            <div className="text-center">
              <div className="text-2xl font-mono tracking-widest">{code}</div>
              {expires && <div className="text-xs text-gray-500 mt-1">Expira em: {expires.toLocaleString('pt-BR')}</div>}
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p>Peça ao seu responsável o código e digite abaixo:</p>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="ABC123" className="w-full border rounded-md px-3 py-2" />
            <button onClick={join} className="w-full py-2 rounded-md bg-indigo-600 text-white">Conectar</button>
          </div>
        )}
      </div>
    </div>
  )
}
