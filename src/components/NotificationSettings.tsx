'use client'

import { useState, useEffect } from 'react'
import { notificationManager } from '@/lib/notifications'

export default function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [testSent, setTestSent] = useState(false)

  useEffect(() => {
    if (notificationManager) {
      setIsSupported(notificationManager.isSupported())
      setPermission(notificationManager.getPermission())
    }
  }, [])

  const handleRequestPermission = async () => {
    if (!notificationManager) return
    
    const granted = await notificationManager.requestPermission()
    if (granted) {
      setPermission('granted')
    } else {
      setPermission('denied')
    }
  }

  const handleTestNotification = async () => {
    if (!notificationManager) return
    
    const sent = await notificationManager.sendNotification({
      title: '🎉 Notificação de Teste!',
      body: 'As notificações estão funcionando perfeitamente!',
      tag: 'test',
    })
    
    if (sent) {
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-200 text-sm flex items-center space-x-2">
          <span>⚠️</span>
          <span>Seu navegador não suporta notificações push</span>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">🔔 Notificações</h3>
            <p className="text-white/60 text-sm">Receba lembretes de tarefas e rotinas</p>
          </div>
          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
            permission === 'granted' ? 'bg-green-500/20 text-green-400' :
            permission === 'denied' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {permission === 'granted' ? '✓ Ativado' :
             permission === 'denied' ? '✗ Bloqueado' :
             '○ Não configurado'}
          </div>
        </div>

        {permission === 'default' && (
          <div className="space-y-3">
            <p className="text-white/70 text-sm">
              Permita que o OrganizeKids envie notificações para lembrá-lo de tarefas importantes e rotinas.
            </p>
            <button
              onClick={handleRequestPermission}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
            >
              Ativar Notificações
            </button>
          </div>
        )}

        {permission === 'granted' && (
          <div className="space-y-3">
            <p className="text-green-400 text-sm flex items-center space-x-2">
              <span>✓</span>
              <span>Notificações ativadas com sucesso!</span>
            </p>
            <button
              onClick={handleTestNotification}
              disabled={testSent}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                testSent
                  ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {testSent ? '✓ Enviado!' : '🧪 Testar Notificação'}
            </button>
          </div>
        )}

        {permission === 'denied' && (
          <div className="space-y-3">
            <p className="text-red-400 text-sm">
              Você bloqueou as notificações. Para ativá-las novamente, acesse as configurações do seu navegador.
            </p>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs">
                <strong>Como ativar:</strong><br/>
                Chrome/Edge: Clique no ícone de cadeado ao lado da URL → Configurações do site → Notificações → Permitir
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Configurações de Lembretes */}
      {permission === 'granted' && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4">⚙️ Configurar Lembretes</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <span className="text-white text-sm">Tarefas com prazo próximo (1h antes)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-white/30" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <span className="text-white text-sm">Rotina matinal (7:00)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-white/30" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <span className="text-white text-sm">Rotina noturna (20:00)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-white/30" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <span className="text-white text-sm">Conquistas desbloqueadas</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-white/30" />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
