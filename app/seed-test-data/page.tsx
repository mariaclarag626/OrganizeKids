'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'
import { FamilyManager } from '@/lib/familyManager'
import { TaskManager } from '@/lib/taskManager'

export default function SeedTestDataPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [log, setLog] = useState<string[]>([])
  const [users, setUsers] = useState<any>({})

  const addLog = (message: string) => {
    setLog(prev => [...prev, message])
  }

  useEffect(() => {
    try {
      addLog('🌱 Iniciando seed de dados de teste...')
      addLog('')

      // Limpar dados anteriores
      addLog('🧹 Limpando dados anteriores...')
      localStorage.clear()
      addLog('✅ Dados limpos')
      addLog('')

      // 1. Criar PAI
      addLog('👨 Criando pai...')
      const parent = LocalAuthManager.registerUser(
        'joao@test.com',
        '123456',
        'João Silva',
        'parent'
      )

      if (!parent.success || !parent.user) {
        throw new Error('Erro ao criar pai: ' + parent.message)
      }

      addLog(`✅ Pai criado: ${parent.user.name} (ID: ${parent.user.id})`)

      // Criar família
      const family = FamilyManager.createFamily(parent.user.id, parent.user.email, parent.user.name)
      addLog(`👨‍👩‍👧‍👦 Família criada! Código: ${family.code}`)
      addLog(`⏰ Expira em: ${new Date(family.codeExpires).toLocaleString('pt-BR')}`)
      addLog('')

      // 2. Criar ADOLESCENTE
      addLog('👧 Criando adolescente...')
      const teenager = LocalAuthManager.registerUser(
        'maria@test.com',
        '123456',
        'Maria Silva',
        'teenager'
      )

      if (!teenager.success || !teenager.user) {
        throw new Error('Erro ao criar adolescente: ' + teenager.message)
      }

      addLog(`✅ Adolescente criado: ${teenager.user.name} (ID: ${teenager.user.id})`)

      // Conectar adolescente à família
      const teenConnection = FamilyManager.joinFamily(
        family.code,
        teenager.user.id,
        teenager.user.email,
        teenager.user.name,
        'teenager'
      )

      if (!teenConnection.success) {
        throw new Error('Erro ao conectar adolescente: ' + teenConnection.message)
      }

      addLog('✅ Adolescente conectado à família')
      addLog('')

      // 3. Criar CRIANÇA
      addLog('👦 Criando criança...')
      const kid = LocalAuthManager.registerUser(
        'pedro@test.com',
        '123456',
        'Pedro Silva',
        'kid'
      )

      if (!kid.success || !kid.user) {
        throw new Error('Erro ao criar criança: ' + kid.message)
      }

      addLog(`✅ Criança criada: ${kid.user.name} (ID: ${kid.user.id})`)

      // Conectar criança à família
      const kidConnection = FamilyManager.joinFamily(
        family.code,
        kid.user.id,
        kid.user.email,
        kid.user.name,
        'kid'
      )

      if (!kidConnection.success) {
        throw new Error('Erro ao conectar criança: ' + kidConnection.message)
      }

      addLog('✅ Criança conectada à família')
      addLog('')

      // 4. Criar TAREFAS
      addLog('📝 Criando tarefas...')
      addLog('')

      // Tarefa 1: Arrumar o quarto (Maria - Pendente)
      const task1 = TaskManager.createTask(
        family.id,
        teenager.user.id,
        parent.user.id,
        {
          title: 'Arrumar o quarto',
          description: 'Organizar cama, roupas e mesa de estudos',
          category: 'domestic',
          points: 50,
          dueDate: new Date().toISOString().split('T')[0],
          recurrence: 'once'
        }
      )
      addLog(`✅ Tarefa criada: ${task1.title} → ${teenager.user.name} (Pendente)`)

      // Tarefa 2: Fazer lição de casa (Maria - Pendente)
      const task2 = TaskManager.createTask(
        family.id,
        teenager.user.id,
        parent.user.id,
        {
          title: 'Fazer lição de matemática',
          description: 'Capítulo 5 - Equações',
          category: 'school',
          points: 80,
          dueDate: new Date().toISOString().split('T')[0],
          recurrence: 'once'
        }
      )
      addLog(`✅ Tarefa criada: ${task2.title} → ${teenager.user.name} (Pendente)`)

      // Tarefa 3: Escovar os dentes (Pedro - Pendente)
      const task3 = TaskManager.createTask(
        family.id,
        kid.user.id,
        parent.user.id,
        {
          title: 'Escovar os dentes',
          description: 'Manhã e noite',
          category: 'hygiene',
          points: 10,
          recurrence: 'daily'
        }
      )
      addLog(`✅ Tarefa criada: ${task3.title} → ${kid.user.name} (Diária - Pendente)`)

      // Tarefa 4: Ajudar na cozinha (Maria - COMPLETADA aguardando aprovação)
      const task4 = TaskManager.createTask(
        family.id,
        teenager.user.id,
        parent.user.id,
        {
          title: 'Ajudar a lavar a louça',
          description: 'Após o jantar',
          category: 'domestic',
          points: 30,
          recurrence: 'once'
        }
      )
      TaskManager.completeTask(task4.id, teenager.user.id)
      addLog(`✅ Tarefa criada: ${task4.title} → ${teenager.user.name} (⏳ AGUARDANDO APROVAÇÃO)`)

      // Tarefa 5: Ler 30 minutos (Pedro - Pendente)
      const task5 = TaskManager.createTask(
        family.id,
        kid.user.id,
        parent.user.id,
        {
          title: 'Ler livro por 30 minutos',
          description: 'Qualquer livro de sua escolha',
          category: 'leisure',
          points: 40,
          recurrence: 'once'
        }
      )
      addLog(`✅ Tarefa criada: ${task5.title} → ${kid.user.name} (Pendente)`)

      // Tarefa 6: Organizar mochila (Maria - APROVADA - com pontos)
      const task6 = TaskManager.createTask(
        family.id,
        teenager.user.id,
        parent.user.id,
        {
          title: 'Organizar mochila da escola',
          description: 'Separar materiais para amanhã',
          category: 'school',
          points: 20,
          recurrence: 'once'
        }
      )
      TaskManager.completeTask(task6.id, teenager.user.id)
      TaskManager.approveTask(task6.id, parent.user.id)
      addLog(`✅ Tarefa criada: ${task6.title} → ${teenager.user.name} (✅ APROVADA - +20 pts)`)

      addLog('')
      addLog('🎉 DADOS DE TESTE CRIADOS COM SUCESSO!')

      // Salvar informações dos usuários
      const allTasks = TaskManager.getFamilyTasks(family.id)
      setUsers({
        parent: { ...parent.user, password: '123456' },
        teenager: { 
          ...teenager.user, 
          password: '123456',
          points: TaskManager.getChildPoints(teenager.user.id)
        },
        kid: { 
          ...kid.user, 
          password: '123456',
          points: TaskManager.getChildPoints(kid.user.id)
        },
        family: {
          code: family.code,
          expires: new Date(family.codeExpires).toLocaleString('pt-BR')
        },
        tasks: {
          total: allTasks.length,
          pending: allTasks.filter(t => t.status === 'pending').length,
          completed: allTasks.filter(t => t.status === 'completed').length,
          approved: allTasks.filter(t => t.status === 'approved').length
        }
      })

      setStatus('success')
    } catch (error: any) {
      addLog('')
      addLog('❌ ERRO: ' + error.message)
      setStatus('error')
    }
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20'>
          <h1 className='text-3xl font-bold text-white mb-6 flex items-center'>
            {status === 'loading' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
            <span className='ml-3'>Seed de Dados de Teste</span>
          </h1>

          {/* Log */}
          <div className='bg-gray-900 rounded-lg p-4 mb-6 font-mono text-sm max-h-96 overflow-y-auto'>
            {log.map((line, i) => (
              <div key={i} className='text-gray-300 mb-1'>{line || '\u00A0'}</div>
            ))}
          </div>

          {/* Status de sucesso */}
          {status === 'success' && users.parent && (
            <div className='space-y-6'>
              {/* Usuários */}
              <div className='bg-white/10 rounded-xl p-6'>
                <h2 className='text-xl font-bold text-white mb-4'>👥 Usuários Criados</h2>
                
                <div className='space-y-4'>
                  <div className='bg-blue-500/20 rounded-lg p-4 border border-blue-500/30'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-bold text-white'>👨 {users.parent.name}</h3>
                      <span className='text-xs text-blue-400'>PAI</span>
                    </div>
                    <div className='text-sm text-gray-300 space-y-1'>
                      <p>📧 Email: <span className='text-blue-400'>{users.parent.email}</span></p>
                      <p>🔑 Senha: <span className='text-blue-400'>123456</span></p>
                      <p>🆔 ID: <span className='text-gray-400 text-xs'>{users.parent.id}</span></p>
                    </div>
                  </div>

                  <div className='bg-purple-500/20 rounded-lg p-4 border border-purple-500/30'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-bold text-white'>👧 {users.teenager.name}</h3>
                      <span className='text-xs text-purple-400'>ADOLESCENTE</span>
                    </div>
                    <div className='text-sm text-gray-300 space-y-1'>
                      <p>📧 Email: <span className='text-purple-400'>{users.teenager.email}</span></p>
                      <p>🔑 Senha: <span className='text-purple-400'>123456</span></p>
                      <p>💰 Pontos: <span className='text-yellow-400 font-bold'>{users.teenager.points}</span></p>
                      <p>🆔 ID: <span className='text-gray-400 text-xs'>{users.teenager.id}</span></p>
                    </div>
                  </div>

                  <div className='bg-green-500/20 rounded-lg p-4 border border-green-500/30'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='text-lg font-bold text-white'>👦 {users.kid.name}</h3>
                      <span className='text-xs text-green-400'>CRIANÇA</span>
                    </div>
                    <div className='text-sm text-gray-300 space-y-1'>
                      <p>📧 Email: <span className='text-green-400'>{users.kid.email}</span></p>
                      <p>🔑 Senha: <span className='text-green-400'>123456</span></p>
                      <p>💰 Pontos: <span className='text-yellow-400 font-bold'>{users.kid.points}</span></p>
                      <p>🆔 ID: <span className='text-gray-400 text-xs'>{users.kid.id}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Família */}
              <div className='bg-white/10 rounded-xl p-6'>
                <h2 className='text-xl font-bold text-white mb-4'>🏠 Família</h2>
                <div className='space-y-2 text-gray-300'>
                  <p>📋 Código: <span className='text-yellow-400 font-bold text-lg'>{users.family.code}</span></p>
                  <p>👥 Membros: <span className='text-white'>3</span></p>
                  <p>⏰ Expira: <span className='text-white'>{users.family.expires}</span></p>
                </div>
              </div>

              {/* Tarefas */}
              <div className='bg-white/10 rounded-xl p-6'>
                <h2 className='text-xl font-bold text-white mb-4'>📝 Tarefas</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='bg-gray-700/50 rounded-lg p-4 text-center'>
                    <div className='text-3xl font-bold text-white'>{users.tasks.total}</div>
                    <div className='text-sm text-gray-400 mt-1'>Total</div>
                  </div>
                  <div className='bg-blue-500/20 rounded-lg p-4 text-center border border-blue-500/30'>
                    <div className='text-3xl font-bold text-blue-400'>{users.tasks.pending}</div>
                    <div className='text-sm text-gray-400 mt-1'>Pendentes</div>
                  </div>
                  <div className='bg-yellow-500/20 rounded-lg p-4 text-center border border-yellow-500/30'>
                    <div className='text-3xl font-bold text-yellow-400'>{users.tasks.completed}</div>
                    <div className='text-sm text-gray-400 mt-1'>Aguardando</div>
                  </div>
                  <div className='bg-green-500/20 rounded-lg p-4 text-center border border-green-500/30'>
                    <div className='text-3xl font-bold text-green-400'>{users.tasks.approved}</div>
                    <div className='text-sm text-gray-400 mt-1'>Aprovadas</div>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className='flex gap-4'>
                <button
                  onClick={() => router.push('/change-role')}
                  className='flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:scale-105 transition-transform'
                >
                  🔄 Trocar Usuário
                </button>
                <button
                  onClick={() => router.push('/dashboard/parents')}
                  className='flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg hover:scale-105 transition-transform'
                >
                  👨 Dashboard Pai
                </button>
              </div>
            </div>
          )}

          {/* Botão de voltar em caso de erro */}
          {status === 'error' && (
            <button
              onClick={() => router.push('/')}
              className='w-full px-6 py-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors'
            >
              ⬅️ Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
