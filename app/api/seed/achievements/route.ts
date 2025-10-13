import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { achievements } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    // Initial achievements
    const initialAchievements = [
      {
        code: 'first_task',
        title: 'Primeira Tarefa',
        description: 'Complete sua primeira tarefa',
        icon: '🌟',
        category: 'tasks',
        requirement: 1,
      },
      {
        code: 'streak_3',
        title: 'Sequência de 3 dias',
        description: 'Complete tarefas por 3 dias seguidos',
        icon: '🔥',
        category: 'streaks',
        requirement: 3,
      },
      {
        code: 'streak_7',
        title: 'Sequência de 7 dias',
        description: 'Complete tarefas por 7 dias seguidos',
        icon: '🔥',
        category: 'streaks',
        requirement: 7,
      },
      {
        code: 'streak_30',
        title: 'Sequência de 30 dias',
        description: 'Complete tarefas por 30 dias seguidos',
        icon: '🔥',
        category: 'streaks',
        requirement: 30,
      },
      {
        code: 'tasks_10',
        title: 'Trabalhador',
        description: 'Complete 10 tarefas',
        icon: '💪',
        category: 'tasks',
        requirement: 10,
      },
      {
        code: 'tasks_50',
        title: 'Mestre das Tarefas',
        description: 'Complete 50 tarefas',
        icon: '👑',
        category: 'tasks',
        requirement: 50,
      },
      {
        code: 'tasks_100',
        title: 'Lendário',
        description: 'Complete 100 tarefas',
        icon: '🏆',
        category: 'tasks',
        requirement: 100,
      },
      {
        code: 'points_100',
        title: 'Colecionador',
        description: 'Ganhe 100 pontos',
        icon: '⭐',
        category: 'points',
        requirement: 100,
      },
      {
        code: 'points_500',
        title: 'Acumulador',
        description: 'Ganhe 500 pontos',
        icon: '💎',
        category: 'points',
        requirement: 500,
      },
      {
        code: 'points_1000',
        title: 'Milionário',
        description: 'Ganhe 1000 pontos',
        icon: '💰',
        category: 'points',
        requirement: 1000,
      },
      {
        code: 'early_bird',
        title: 'Madrugador',
        description: 'Complete uma tarefa antes das 8h',
        icon: '🌅',
        category: 'special',
        requirement: 1,
      },
      {
        code: 'night_owl',
        title: 'Coruja da Noite',
        description: 'Complete uma tarefa depois das 20h',
        icon: '🦉',
        category: 'special',
        requirement: 1,
      },
      {
        code: 'perfect_week',
        title: 'Semana Perfeita',
        description: 'Complete todas as tarefas por uma semana',
        icon: '✨',
        category: 'special',
        requirement: 1,
      },
      {
        code: 'helper',
        title: 'Ajudante',
        description: 'Ajude um irmão com uma tarefa',
        icon: '🤝',
        category: 'special',
        requirement: 1,
      },
      {
        code: 'speed_demon',
        title: 'Raio Veloz',
        description: 'Complete 5 tarefas em um dia',
        icon: '⚡',
        category: 'special',
        requirement: 5,
      },
    ]

    // Insert achievements (ignore duplicates)
    for (const achievement of initialAchievements) {
      try {
        await db.insert(achievements).values(achievement).onConflictDoNothing()
      } catch (error) {
        console.error(`Error inserting achievement ${achievement.code}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${initialAchievements.length} achievements seeded`,
    })
  } catch (error) {
    console.error('Error seeding achievements:', error)
    return NextResponse.json({ error: 'Failed to seed achievements' }, { status: 500 })
  }
}
