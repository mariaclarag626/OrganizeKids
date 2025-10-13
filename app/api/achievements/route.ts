import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { achievements, userAchievements } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get all achievements
    const allAchievements = await db.select().from(achievements)

    // Get user's unlocked achievements
    const userUnlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))

    // Merge data
    const achievementsWithProgress = allAchievements.map((achievement) => {
      const userAchievement = userUnlocked.find(
        (ua) => ua.achievementId === achievement.id
      )
      return {
        ...achievement,
        unlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt,
        progress: userAchievement?.progress || 0,
      }
    })

    return NextResponse.json({ achievements: achievementsWithProgress })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 })
    }

    const body = await request.json()
    const { action, userId, achievementCode, progress } = body

    if (action === 'unlock') {
      // Find achievement by code
      const achievement = await db
        .select()
        .from(achievements)
        .where(eq(achievements.code, achievementCode))
        .limit(1)

      if (!achievement || achievement.length === 0) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
      }

      // Check if already unlocked
      const existing = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievement[0].id)
          )
        )

      if (existing.length > 0) {
        return NextResponse.json({ message: 'Already unlocked' }, { status: 200 })
      }

      // Unlock achievement
      await db.insert(userAchievements).values({
        userId,
        achievementId: achievement[0].id,
        progress: progress || achievement[0].requirement || 0,
      })

      return NextResponse.json({
        success: true,
        achievement: achievement[0],
      })
    }

    if (action === 'updateProgress') {
      // Update achievement progress
      const achievement = await db
        .select()
        .from(achievements)
        .where(eq(achievements.code, achievementCode))
        .limit(1)

      if (!achievement || achievement.length === 0) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
      }

      const existing = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievement[0].id)
          )
        )

      if (existing.length > 0) {
        await db
          .update(userAchievements)
          .set({ progress })
          .where(eq(userAchievements.id, existing[0].id))
      } else {
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement[0].id,
          progress,
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}
