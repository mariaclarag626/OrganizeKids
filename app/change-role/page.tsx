'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'

export default function ChangeRolePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<'parent' | 'teenager' | 'kid'>('parent')

  useEffect(() => {
    const user = LocalAuthManager.getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setCurrentUser(user)
    setSelectedRole(user.role)
  }, [router])

  const handleChangeRole = () => {
    if (!currentUser) return

    // Atualizar o role
    const updatedUser = { ...currentUser, role: selectedRole }
    LocalAuthManager.setCurrentUser(updatedUser)

    // Redirecionar para o dashboard apropriado
    const dashboardRoutes = {
      parent: '/dashboard/parents',
      teenager: '/dashboard/teenagers',
      kid: '/dashboard/kids'
    }

    router.push(dashboardRoutes[selectedRole])
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🔄 Trocar Perfil
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Selecione o tipo de usuário que você é
        </p>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Atual:</strong> {currentUser.name} ({currentUser.email})
            </p>
            <p className="text-sm text-blue-600 mt-1">
              <strong>Perfil:</strong> {currentUser.role === 'parent' ? 'Pai/Mãe' : currentUser.role === 'teenager' ? 'Adolescente' : 'Criança'}
            </p>
          </div>

          <label className="block text-gray-700 font-medium mb-3">
            Novo Perfil:
          </label>
          
          <div className="space-y-3">
            <button
              onClick={() => setSelectedRole('parent')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'parent'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👨‍👩‍👧‍👦</div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Pai/Mãe</div>
                  <div className="text-sm text-gray-600">Gerenciar família e tarefas</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('teenager')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'teenager'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">🧑‍🎓</div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Adolescente (13-17 anos)</div>
                  <div className="text-sm text-gray-600">Tarefas e estudos</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('kid')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'kid'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center">
                <div className="text-4xl mr-4">👧</div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Criança (até 12 anos)</div>
                  <div className="text-sm text-gray-600">Tarefas divertidas</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={handleChangeRole}
          disabled={selectedRole === currentUser.role}
          className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: selectedRole !== currentUser.role
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#9ca3af'
          }}
        >
          {selectedRole === currentUser.role ? 'Perfil atual' : 'Confirmar mudança'}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full mt-3 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
