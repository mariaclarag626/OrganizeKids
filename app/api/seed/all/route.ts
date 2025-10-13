import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, households, householdMembers, tasks, rewards, achievements, userPoints, profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const reset = searchParams.get('reset') === 'true'

    // 1. Create test family (parents)
    const hashedPassword = '$2a$10$YourHashedPasswordHere' // Placeholder - replace with actual hash
    
    // Check if parent already exists
    const existingParent = await db
      .select()
      .from(users)
      .where(eq(users.email, 'pai@test.com'))
      .limit(1)

    let parentUser
    if (existingParent.length > 0) {
      parentUser = existingParent[0]
    } else {
      const newParent = await db.insert(users).values({
        email: 'pai@test.com',
        name: 'João Silva',
        password: hashedPassword,
        userType: 'parents',
      }).returning()
      parentUser = newParent[0]
    }

    // 2. Create household
    const existingHousehold = await db
      .select()
      .from(households)
      .where(eq(households.createdBy, parentUser.id))
      .limit(1)

    let household
    if (existingHousehold.length > 0) {
      household = existingHousehold[0]
    } else {
      const newHousehold = await db.insert(households).values({
        name: 'Família Silva',
        description: 'Nossa família feliz! 🏠',
        createdBy: parentUser.id,
        settings: {
          timezone: 'America/Sao_Paulo',
          language: 'pt-BR',
        },
      }).returning()
      household = newHousehold[0]
    }

    // 3. Add parent to household
    const existingParentMember = await db
      .select()
      .from(householdMembers)
      .where(eq(householdMembers.userId, parentUser.id))
      .limit(1)

    if (existingParentMember.length === 0) {
      await db.insert(householdMembers).values({
        householdId: household.id,
        userId: parentUser.id,
        role: 'parent',
      })
    }

    // 4. Create kids
    const kids = [
      { name: 'Maria Clara', email: 'maria@test.com', avatar: '👧', age: 8 },
      { name: 'João Pedro', email: 'joao@test.com', avatar: '👦', age: 10 },
      { name: 'Ana Julia', email: 'ana@test.com', avatar: '🧒', age: 6 },
    ]

    const createdKids = []
    for (const kid of kids) {
      const existingKid = await db
        .select()
        .from(users)
        .where(eq(users.email, kid.email))
        .limit(1)

      let kidUser
      if (existingKid.length > 0) {
        kidUser = existingKid[0]
      } else {
        const newKid = await db.insert(users).values({
          email: kid.email,
          name: kid.name,
          password: hashedPassword, // Using same hash
          userType: 'kids',
        }).returning()
        kidUser = newKid[0]

        // Create profile
        await db.insert(profiles).values({
          userId: kidUser.id,
          displayName: kid.name,
          avatar: kid.avatar,
          dateOfBirth: new Date(2017, 0, 1), // Approximate
        })

        // Add to household
        await db.insert(householdMembers).values({
          householdId: household.id,
          userId: kidUser.id,
          role: 'child',
        })

        // Initialize points
        await db.insert(userPoints).values({
          userId: kidUser.id,
          householdId: household.id,
          points: 0,
          totalEarned: 0,
          totalSpent: 0,
        })
      }
      createdKids.push(kidUser)
    }

    // 5. Create tasks
    const taskTemplates = [
      { title: 'Arrumar a cama', icon: '🛏️', points: 10, description: 'Deixar a cama arrumada todos os dias' },
      { title: 'Escovar os dentes', icon: '🦷', points: 5, description: 'Escovar os dentes 3 vezes ao dia' },
      { title: 'Fazer lição de casa', icon: '📚', points: 20, description: 'Completar todas as lições da escola' },
      { title: 'Ajudar com a louça', icon: '🍽️', points: 15, description: 'Ajudar a lavar ou secar a louça' },
      { title: 'Organizar os brinquedos', icon: '🧸', points: 10, description: 'Guardar todos os brinquedos no lugar' },
      { title: 'Regar as plantas', icon: '🌱', points: 8, description: 'Regar as plantas do jardim' },
      { title: 'Tirar o lixo', icon: '🗑️', points: 12, description: 'Levar o lixo para fora' },
      { title: 'Estudar 30 minutos', icon: '📖', points: 25, description: 'Estudar ou ler por 30 minutos' },
    ]

    for (const kid of createdKids) {
      // Assign random tasks to each kid
      const kidTasks = taskTemplates.slice(0, 4 + Math.floor(Math.random() * 3))
      
      for (const template of kidTasks) {
        const existingTask = await db
          .select()
          .from(tasks)
          .where(eq(tasks.title, template.title))
          .limit(1)

        if (existingTask.length === 0 || reset) {
          await db.insert(tasks).values({
            householdId: household.id,
            title: template.title,
            description: template.description,
            points: template.points,
            assignedTo: kid.id,
            createdBy: parentUser.id,
            dueDate: new Date(),
            isCompleted: false,
          })
        }
      }
    }

    // 6. Create rewards
    const rewardTemplates = [
      { title: '30 min de videogame', cost: 50, icon: '🎮', description: 'Jogue por 30 minutos extras' },
      { title: 'Escolher o filme', cost: 30, icon: '🎬', description: 'Escolha o filme da noite' },
      { title: 'Pizza no jantar', cost: 100, icon: '🍕', description: 'Pizza para o jantar!' },
      { title: 'Dormir mais tarde', cost: 80, icon: '🌙', description: 'Dormir 1 hora mais tarde' },
      { title: 'Sorvete especial', cost: 40, icon: '🍦', description: 'Escolha seu sorvete favorito' },
      { title: 'Passeio no parque', cost: 150, icon: '🎡', description: 'Passeio no parque de diversões' },
      { title: 'Brinquedo novo', cost: 300, icon: '🎁', description: 'Ganhar um brinquedo novo' },
      { title: 'Amigo para dormir', cost: 200, icon: '🏠', description: 'Convidar um amigo para dormir em casa' },
    ]

    for (const template of rewardTemplates) {
      const existingReward = await db
        .select()
        .from(rewards)
        .where(eq(rewards.title, template.title))
        .limit(1)

      if (existingReward.length === 0) {
        await db.insert(rewards).values({
          householdId: household.id,
          title: template.title,
          description: template.description,
          cost: template.cost,
          icon: template.icon,
          createdBy: parentUser.id,
          isActive: true,
        })
      }
    }

    // 7. Seed achievements
    const achievementTemplates = [
      { code: 'first_task', title: 'Primeira Tarefa', description: 'Complete sua primeira tarefa', icon: '🌟', category: 'tasks', requirement: 1 },
      { code: 'streak_3', title: 'Sequência de 3 dias', description: 'Complete tarefas por 3 dias seguidos', icon: '🔥', category: 'streaks', requirement: 3 },
      { code: 'streak_7', title: 'Sequência de 7 dias', description: 'Complete tarefas por 7 dias seguidos', icon: '🔥', category: 'streaks', requirement: 7 },
      { code: 'streak_30', title: 'Sequência de 30 dias', description: 'Complete tarefas por 30 dias seguidos', icon: '🔥', category: 'streaks', requirement: 30 },
      { code: 'tasks_10', title: 'Trabalhador', description: 'Complete 10 tarefas', icon: '💪', category: 'tasks', requirement: 10 },
      { code: 'tasks_50', title: 'Mestre das Tarefas', description: 'Complete 50 tarefas', icon: '👑', category: 'tasks', requirement: 50 },
      { code: 'tasks_100', title: 'Lendário', description: 'Complete 100 tarefas', icon: '🏆', category: 'tasks', requirement: 100 },
      { code: 'points_100', title: 'Colecionador', description: 'Ganhe 100 pontos', icon: '⭐', category: 'points', requirement: 100 },
      { code: 'points_500', title: 'Acumulador', description: 'Ganhe 500 pontos', icon: '💎', category: 'points', requirement: 500 },
      { code: 'points_1000', title: 'Milionário', description: 'Ganhe 1000 pontos', icon: '💰', category: 'points', requirement: 1000 },
      { code: 'early_bird', title: 'Madrugador', description: 'Complete uma tarefa antes das 8h', icon: '🌅', category: 'special', requirement: 1 },
      { code: 'night_owl', title: 'Coruja da Noite', description: 'Complete uma tarefa depois das 20h', icon: '🦉', category: 'special', requirement: 1 },
      { code: 'perfect_week', title: 'Semana Perfeita', description: 'Complete todas as tarefas por uma semana', icon: '✨', category: 'special', requirement: 1 },
      { code: 'helper', title: 'Ajudante', description: 'Ajude um irmão com uma tarefa', icon: '🤝', category: 'special', requirement: 1 },
      { code: 'speed_demon', title: 'Raio Veloz', description: 'Complete 5 tarefas em um dia', icon: '⚡', category: 'special', requirement: 5 },
    ]

    for (const template of achievementTemplates) {
      const existing = await db
        .select()
        .from(achievements)
        .where(eq(achievements.code, template.code))
        .limit(1)

      if (existing.length === 0) {
        await db.insert(achievements).values(template)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Banco populado com sucesso! 🎉',
      data: {
        parent: { email: 'pai@test.com', password: '123456' },
        kids: kids.map(k => ({ email: k.email, password: '123456', name: k.name })),
        household: { id: household.id, name: household.name },
        stats: {
          tasks: taskTemplates.length * createdKids.length,
          rewards: rewardTemplates.length,
          achievements: achievementTemplates.length,
        }
      }
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
