/**
 * Script para popular dados de teste do OrganizeKids
 * 
 * Este script cria:
 * - 1 Pai (João Silva)
 * - 1 Adolescente (Maria Silva)
 * - 1 Criança (Pedro Silva)
 * - Conecta todos à mesma família
 * - Cria 3 tarefas pendentes
 * - Cria 1 tarefa completada (aguardando aprovação)
 * - Cria 1 tarefa aprovada
 */

import { LocalAuthManager } from '../src/lib/localAuth'
import { FamilyManager } from '../src/lib/familyManager'
import { TaskManager } from '../src/lib/taskManager'

function seedTestData() {
  console.log('🌱 Iniciando seed de dados de teste...\n')

  // Limpar dados anteriores
  console.log('🧹 Limpando dados anteriores...')
  localStorage.clear()
  console.log('✅ Dados limpos\n')

  // 1. Criar PAI
  console.log('👨 Criando pai...')
  const parent = LocalAuthManager.register({
    name: 'João Silva',
    email: 'joao@test.com',
    password: '123456',
    role: 'parent'
  })
  
  if (!parent.success || !parent.user) {
    console.error('❌ Erro ao criar pai:', parent.message)
    return
  }
  
  console.log('✅ Pai criado:', parent.user.name, '(ID:', parent.user.id, ')')
  
  // Criar família
  const family = FamilyManager.createFamily(parent.user.id, parent.user.email, parent.user.name)
  console.log('👨‍👩‍👧‍👦 Família criada! Código:', family.code)
  console.log('⏰ Expira em:', new Date(family.codeExpires).toLocaleString('pt-BR'), '\n')

  // 2. Criar ADOLESCENTE
  console.log('👧 Criando adolescente...')
  const teenager = LocalAuthManager.register({
    name: 'Maria Silva',
    email: 'maria@test.com',
    password: '123456',
    role: 'teenager'
  })
  
  if (!teenager.success || !teenager.user) {
    console.error('❌ Erro ao criar adolescente:', teenager.message)
    return
  }
  
  console.log('✅ Adolescente criado:', teenager.user.name, '(ID:', teenager.user.id, ')')
  
  // Conectar adolescente à família
  const teenConnection = FamilyManager.joinFamily(
    family.code,
    teenager.user.id,
    teenager.user.email,
    teenager.user.name,
    'teenager'
  )
  
  if (!teenConnection.success) {
    console.error('❌ Erro ao conectar adolescente:', teenConnection.message)
    return
  }
  
  console.log('✅ Adolescente conectado à família\n')

  // 3. Criar CRIANÇA
  console.log('👦 Criando criança...')
  const kid = LocalAuthManager.register({
    name: 'Pedro Silva',
    email: 'pedro@test.com',
    password: '123456',
    role: 'kid'
  })
  
  if (!kid.success || !kid.user) {
    console.error('❌ Erro ao criar criança:', kid.message)
    return
  }
  
  console.log('✅ Criança criada:', kid.user.name, '(ID:', kid.user.id, ')')
  
  // Conectar criança à família
  const kidConnection = FamilyManager.joinFamily(
    family.code,
    kid.user.id,
    kid.user.email,
    kid.user.name,
    'kid'
  )
  
  if (!kidConnection.success) {
    console.error('❌ Erro ao conectar criança:', kidConnection.message)
    return
  }
  
  console.log('✅ Criança conectada à família\n')

  // 4. Criar TAREFAS
  console.log('📝 Criando tarefas...\n')

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
  console.log('✅ Tarefa criada:', task1.title, '→', teenager.user.name, '(Pendente)')

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
  console.log('✅ Tarefa criada:', task2.title, '→', teenager.user.name, '(Pendente)')

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
  console.log('✅ Tarefa criada:', task3.title, '→', kid.user.name, '(Diária - Pendente)')

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
  console.log('✅ Tarefa criada:', task4.title, '→', teenager.user.name, '(⏳ AGUARDANDO APROVAÇÃO)')

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
  console.log('✅ Tarefa criada:', task5.title, '→', kid.user.name, '(Pendente)')

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
  console.log('✅ Tarefa criada:', task6.title, '→', teenager.user.name, '(✅ APROVADA - +20 pts)')

  console.log('\n' + '='.repeat(60))
  console.log('🎉 DADOS DE TESTE CRIADOS COM SUCESSO!')
  console.log('='.repeat(60))
  
  console.log('\n📊 RESUMO:')
  console.log('━'.repeat(60))
  
  console.log('\n👥 USUÁRIOS:')
  console.log(`  👨 Pai: ${parent.user.name}`)
  console.log(`     Email: ${parent.user.email}`)
  console.log(`     Senha: 123456`)
  console.log(`     ID: ${parent.user.id}`)
  
  console.log(`\n  👧 Adolescente: ${teenager.user.name}`)
  console.log(`     Email: ${teenager.user.email}`)
  console.log(`     Senha: 123456`)
  console.log(`     ID: ${teenager.user.id}`)
  console.log(`     Pontos: ${TaskManager.getChildPoints(teenager.user.id)}`)
  
  console.log(`\n  👦 Criança: ${kid.user.name}`)
  console.log(`     Email: ${kid.user.email}`)
  console.log(`     Senha: 123456`)
  console.log(`     ID: ${kid.user.id}`)
  console.log(`     Pontos: ${TaskManager.getChildPoints(kid.user.id)}`)
  
  console.log('\n🏠 FAMÍLIA:')
  console.log(`  Código: ${family.code}`)
  console.log(`  Membros: 3`)
  console.log(`  Expira: ${new Date(family.codeExpires).toLocaleString('pt-BR')}`)
  
  console.log('\n📝 TAREFAS:')
  const allTasks = TaskManager.getFamilyTasks(family.id)
  console.log(`  Total: ${allTasks.length}`)
  console.log(`  Pendentes: ${allTasks.filter(t => t.status === 'pending').length}`)
  console.log(`  Aguardando aprovação: ${allTasks.filter(t => t.status === 'completed').length}`)
  console.log(`  Aprovadas: ${allTasks.filter(t => t.status === 'approved').length}`)
  
  console.log('\n🎯 PRÓXIMOS PASSOS:')
  console.log('━'.repeat(60))
  console.log('1. Vá para http://localhost:3000/change-role')
  console.log('2. Teste os 3 usuários criados')
  console.log('3. Como PAI: Veja a tarefa aguardando aprovação')
  console.log('4. Como ADOLESCENTE/CRIANÇA: Complete uma tarefa')
  console.log('5. Como PAI: Aprove a tarefa e veja os pontos serem creditados')
  console.log('━'.repeat(60))
  
  console.log('\n✨ Dados salvos no localStorage!')
  console.log('🔄 Recarregue a página para ver as mudanças\n')
}

// Executar seed
try {
  seedTestData()
} catch (error) {
  console.error('❌ Erro ao executar seed:', error)
}
